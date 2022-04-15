<?php
/**
 * Mailer | el.kulo v3.3.0 (https://github.com/elkulo/Mailer/)
 * Copyright 2020-2022 A.Sudo
 * Licensed under LGPL-2.1-only (https://github.com/elkulo/Mailer/blob/main/LICENSE)
 */
declare(strict_types=1);

namespace App\Infrastructure\Persistence\HealthCheck;

use Slim\Csrf\Guard;
use Slim\Flash\Messages;
use App\Domain\HealthCheck\HealthCheckRepository;
use App\Domain\HealthCheck\HealthCheckPostData;
use App\Application\Settings\SettingsInterface;
use App\Application\Router\RouterInterface;
use App\Application\Handlers\Validate\ValidateHandlerInterface;
use App\Application\Handlers\Mail\MailHandlerInterface;
use App\Application\Handlers\DB\DBHandlerInterface;

class InMemoryHealthCheckRepository implements HealthCheckRepository
{

    /**
     * CSRF対策
     *
     * @var Guard
     */
    private $guard;

    /**
     * フラッシュメッセージ
     *
     * @var Messages
     */
    private $flash;

    /**
     * ロジック
     *
     * @var HealthCheckPostData
     */
    private $postData;

    /**
     * 設定値
     *
     * @var SettingsInterface
     */
    private $settings;

    /**
     * ルーター
     *
     * @var RouterInterface
     */
    protected $router;

    /**
     * 検証ハンドラー
     *
     * @var ValidateHandlerInterface
     */
    private $validate;

    /**
     * メールハンドラー
     *
     * @var MailHandlerInterface
     */
    private $mail;

    /**
     * DBハンドラー
     *
     * @var DBHandlerInterface|null
     */
    private $db = null;

    /**
     * InMemoryHealthCheckRepository constructor.
     *
     * @param Guard $guard,
     * @param Messages $messages
     * @param SettingsInterface $settings
     * @param RouterInterface $router
     * @param ValidateHandlerInterface $validate
     * @param MailHandlerInterface $mail
     * @param DBHandlerInterface|null $db
     */
    public function __construct(
        Guard $guard,
        Messages $messages,
        SettingsInterface $settings,
        RouterInterface $router,
        ValidateHandlerInterface $validate,
        MailHandlerInterface $mail,
        ?DBHandlerInterface $db
    ) {
        // CSRF
        $this->guard = $guard;

        // フラッシュメッセージ
        $this->flash = $messages;

        // 設定
        $this->settings = $settings;

        // ルーター
        $this->router = $router;

        // バリデーションアクションをセット
        $this->validate = $validate;

        // メールハンドラーをセット
        $this->mail = $mail;

        // データベースハンドラーをセット
        $this->db = $db;

        // POSTデータを取得
        $posts = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS)?? [];

        // POSTデータをサニタイズして格納
        $this->postData = new HealthCheckPostData($posts, $settings);

        // POSTデータをバリデーションに格納
        $this->validate->set($posts);
    }

    /**
     * 受付画面
     *
     * @return array
     */
    public function index(): array
    {
        $mailSettings = $this->settings->get('mail');
        $to = (array) $mailSettings['ADMIN_MAIL'];
        $cc = $mailSettings['ADMIN_CC']? explode(',', $mailSettings['ADMIN_CC']) : [];
        $bcc = $mailSettings['ADMIN_BCC']? explode(',', $mailSettings['ADMIN_BCC']) : [];

        try {
            // 環境設定のメールアドレスの形式に不備があれば警告.
            foreach (array_merge($to, $cc, $bcc) as $mailaddress) {
                if (!$this->validate->isCheckMailFormat($mailaddress)) {
                    throw new \Exception('環境設定のメールアドレスに不備があります。設定を見直してください。');
                }
            }
        } catch (\Exception $e) {
            $this->flash->clearMessages();
            $this->flash->addMessageNow('danger', $e->getMessage());
        }

        return [
            'template' => 'index.twig',
            'data' => [
                'SectionTitle' => '送受信テスト',
                'SectionDescription' => 'メールの送受信に問題がないかテストを行います。ヘルスチェックを開始するには、管理者のメールアドレス宛に確認コードが送信されます。',
                'Guard'   => [
                    'keys' => [
                        'name'  => $this->guard->getTokenNameKey(),
                        'value' => $this->guard->getTokenValueKey(),
                    ],
                    'name'  => $this->guard->getTokenName(),
                    'value' => $this->guard->getTokenValue(),
                ],
                'Action' => [
                    'url' => $this->router->getUrl('health-check.confirm'),
                ]
            ]
        ];
    }

    /**
     * 確認画面
     *
     * @return array
     */
    public function confirm(): array
    {
        $mailSettings = $this->settings->get('mail');
        $posts = $this->postData->getPosts();
        $postEmail = isset($posts['email'])? $posts['email']: '';
        $passcode = '';
        $success = false;
        $to = (array) $mailSettings['ADMIN_MAIL'];
        $cc = $mailSettings['ADMIN_CC']? explode(',', $mailSettings['ADMIN_CC']) : [];
        $bcc = $mailSettings['ADMIN_BCC']? explode(',', $mailSettings['ADMIN_BCC']) : [];

        try {
            // 環境設定のメールアドレスの形式に不備がある場合は処理を中止.
            foreach (array_merge($to, $cc, $bcc) as $mailaddress) {
                if (!$this->validate->isCheckMailFormat($mailaddress)) {
                    throw new \Exception('環境設定のメールアドレスに不備があります。設定を見直してください。');
                }
            }

            // リファラチェック
            if (!$this->validate->isCheckReferer()) {
                throw new \Exception('指定のページ以外から送信されています。');
            }

            // 管理者メールの比較
            if ($this->validate->isCheckMailFormat($postEmail) && $postEmail === $mailSettings['ADMIN_MAIL']) {
                // パスコードの送信
                $passcode = sprintf("%06d", mt_rand(1, 999999));
                $_SESSION['healthCheckPasscode'] = $passcode;

                // 管理者宛に届くメールをセット
                $success = $this->mail->send(
                    $mailSettings['ADMIN_MAIL'],
                    $this->postData->getMailSubject(),
                    $this->postData->renderAdminMail([
                        'Passcode' => $passcode,
                        '__SITE_TITLE' => $this->settings->get('siteTitle'),
                        '__SITE_URL' => $this->settings->get('siteUrl')
                    ])
                );
                if (!$success) {
                    throw new \Exception('環境設定のSMTPに不備があります。設定を見直してください。');
                }
            } else {
                throw new \Exception('入力内容に誤りがあります。入力内容を確認の上、再度お試しください。');
            }
        } catch (\Exception $e) {
            $this->flash->addMessage('warning', $e->getMessage());
            return [
                'redirect' => $this->router->getUrl('health-check')
            ];
        }

        return [
            'template' => 'confirm.twig',
            'data' => [
                'SectionTitle' => '確認コード',
                'SectionDescription' => '管理者のメールアドレス宛に確認コードを送信しました。受信された確認コードを入力してください。',
                'Guard'   => [
                    'keys' => [
                        'name'  => $this->guard->getTokenNameKey(),
                        'value' => $this->guard->getTokenValueKey(),
                    ],
                    'name'  => $this->guard->getTokenName(),
                    'value' => $this->guard->getTokenValue(),
                ],
                'Action' => [
                    'url' => $this->router->getUrl('health-check.result'),
                ]
            ]
        ];
    }

    /**
     * 結果画面
     *
     * @return array
     */
    public function result(): array
    {
        $phpMinSupport = $this->settings->get('phpMinSupport');
        $mailSettings = $this->settings->get('mail');
        $validateSettings = $this->settings->get('validate');
        $posts = $this->postData->getPosts();
        $resultList = [];
        $resultSeccessCount = 0;
        $postPasscode = [];
        $passcode = null;

        try {
            // セッションからパスコードを取得して削除.
            $passcode = isset($_SESSION['healthCheckPasscode']) ? $_SESSION['healthCheckPasscode'] : null;
            if (isset($_SESSION['healthCheckPasscode'])) {
                unset($_SESSION['healthCheckPasscode']);
            }

            // パスコードの結合.
            for ($i = 1; $i <= 6; $i++) {
                $postPasscode[] = isset($posts['passcode-' . $i])? $posts['passcode-' . $i]: null;
            }

            // パスコードの比較.
            if (implode('', $postPasscode) === $passcode) {
                $resultList = [
                    1 => [
                        'description' => 'SMTPでのメール送信はできましたか？',
                        'success' => true
                    ],
                    2 => [
                        'description' => "PHPのバージョンが ver{$phpMinSupport} 以上ありますか？",
                        'success' => (version_compare(PHP_VERSION, $phpMinSupport) >= 0) ? true : false
                    ],
                    3 => [
                        'description' => 'HTTPSで暗号化されたサイト接続ですか？',
                        'success' => (isset($_SERVER['HTTPS'])) ? true : false
                    ],
                    4 => [
                        'description' => 'SSL/TLSで暗号化されたメールを送信されていますか？',
                        'success' => (in_array($mailSettings['SMTP_ENCRYPT'], ['ssl', 'tls'])) ? true : false
                    ],
                    5 => [
                        'description' => 'データベースに接続できましたか？',
                        'success' => ($this->db)? $this->db->make(): false
                    ],
                    6 => [
                        'description' => 'データベースに履歴は書き込めましたか？',
                        'success' => ($this->db)? $this->db->test(): false
                    ],
                    7 => [
                        'description' => 'reCAPTCHAでBOT対策はされていますか？',
                        'success' => !empty($validateSettings['RECAPTCHA_SECRETKEY'])? true: false
                    ],
                    8 => [
                        'description' => 'デバッグモードが無効になっていますか？',
                        'success' => $this->settings->get('debug')? false: true
                    ],
                ];
    
                foreach ($resultList as $value) {
                    if ($value['success']) {
                        $resultSeccessCount++;
                    }
                }
            } else {
                throw new \Exception('確認コードが一致しませんでした。入力内容を確認の上、再度お試しください。');
            }
        } catch (\Exception $e) {
            $this->flash->addMessage('warning', $e->getMessage());
            return [
                'redirect' => $this->router->getUrl('health-check')
            ];
        }

        return [
            'template' => 'result.twig',
            'data' => [
                'SectionTitle' => 'チェック結果',
                'SectionDescription' => 'メールプログラムは正常に機能しています。
                    実際のメールフォームからの送信内容の検証は、設置されたフォームからテストをしてください。
                    ヘルスチェックの検証内容は次の通りです。',
                'ResultList' => $resultList,
                'ResultSeccessCount' => $resultSeccessCount,
                'ResultSeccessRatio' => floor($resultSeccessCount / count($resultList) * 100) . '%'
            ]
        ];
    }
}
