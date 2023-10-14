<?php
declare(strict_types=1);

use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Application\Settings\SettingsInterface;
use App\Application\Router\RouterInterface;
use App\Application\Actions\Assets\AssetsAction;
use App\Application\Actions\Dashboard\IndexDashboardAction;
use App\Application\Actions\Dashboard\APIAction;
use App\Application\Actions\Mailer\IndexMailerAction;
use App\Application\Actions\Mailer\ConfirmMailerAction;
use App\Application\Actions\Mailer\CompleteMailerAction;
use App\Application\Actions\HealthCheck\IndexHealthCheckAction;
use App\Application\Actions\HealthCheck\ConfirmHealthCheckAction;
use App\Application\Actions\HealthCheck\ResultHealthCheckAction;

return function (App $app) {
    $settings = $app->getContainer()->get(SettingsInterface::class);
    $router = $app->getContainer()->get(RouterInterface::class);

    // 初期ルート.
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    // ルート設定.
    $app->group('', function (Group $group) use ($router) {

        // ダッシュボード.
        $group->get('/', IndexDashboardAction::class)->setName('dashboard');

        // API for JSON.
        $group->get('/api/v1/mailer-json', APIAction::class)->setName('mailer-json');

        // Guard for Javascript (Nonce Token).
        $group->get('/assets/guard-min-js', [AssetsAction::class, 'guardJavaScript'])->setName('guard.min.js');

        // reCAPTCHA for JavaScript.
        $group->get(
            '/assets/recaptcha-min-js',
            [AssetsAction::class, 'recaptchaJavaScript']
        )->setName('recaptcha.min.js');

        // Bootstrap for CSS.
        $group->get('/assets/bootstrap-min-css', [AssetsAction::class, 'bootstrapStyle'])->setName('bootstrap.min.css');

        // Bootstrap for JavaScript.
        $group->get(
            '/assets/bootstrap-min-js',
            [AssetsAction::class, 'bootstrapJavaScript']
        )->setName('bootstrap.min.js');

        // 最後のスラッシュを強制.
        $group->get('', function (Request $request, Response $response) use ($router) {
            return $router->redirect('dashboard', $request, $response);
        });
    });

    // メールフォーム.
    $app->group('/post', function (Group $group) use ($settings, $router) {

        // ルートに投稿された場合、スキップ設定で自動振り分け.
        $group->post(
            '',
            empty($settings->get('form')['IS_CONFIRM_SKIP']) ? ConfirmMailerAction::class : CompleteMailerAction::class
        );

        // 投稿画面.
        $group->get('', IndexMailerAction::class)->setName('mailer');

        // 確認画面.
        $group->post('/confirm', ConfirmMailerAction::class)->setName('mailer.confirm');

        // 完了画面.
        $group->post('/complete', CompleteMailerAction::class)->setName('mailer.complete');

        // 最後のスラッシュを排除.
        $group->get('/', function (Request $request, Response $response) use ($router) {
            return $router->redirect('mailer', $request, $response);
        });
    });

    // ヘルスチェック.
    $app->group('/health-check', function (Group $group) use ($router) {

        // 投稿画面.
        $group->get('', IndexHealthCheckAction::class)->setName('health-check');

        // 確認画面.
        $group->post('/confirm', ConfirmHealthCheckAction::class)->setName('health-check.confirm');

        // 完了画面.
        $group->post('/result', ResultHealthCheckAction::class)->setName('health-check.result');

        // 最後のスラッシュを排除.
        $group->get('/', function (Request $request, Response $response) use ($router) {
            return $router->redirect('health-check', $request, $response);
        });
    });
};
