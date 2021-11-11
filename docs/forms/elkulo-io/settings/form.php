<?php
/**
 * メールフォームの設定
 */
return [

  /**(1)
   * 
   * 送信完了後に戻るページURL
   */
  'RETURN_PAGE' => 'https://elkulo.github.io/contact/',

  /**(2)
   * 
   * 自動応答
   * ユーザーのEmailに指定したname属性の値に自動応答のメールを送信(送る=1, 送らない=0)
   */
  'IS_REPLY_USERMAIL' => 0,

  /**(3)
   * 
   * 管理者宛のメールで差出人のEmailをReply-Toに含める(含める=1, 含めない=0)
   * ただし、サーバーによってはSMTPのEmailが自動付与される。
   */
  'IS_FROM_USERMAIL' => 0,

  /**(4)
   * 
   * 件名の頭につける文字
   */
  'SUBJECT_BEFORE' => '',

  /**(5)
   * 
   * 件名の後ろにつける文字
   */
  'SUBJECT_AFTER' => ' - el.kulo',

  /**(6)
   * 
   * 件名にするname属性
   * 件名の形式 -> SUBJECT_BEFORE.SUBJECT_ATTRIBUTE.SUBJECT_AFTER
   */
  'SUBJECT_ATTRIBUTE' => 'customerTitle',

  /**(7)
   * 
   * ユーザーのEmailのname属性
   * メールアドレス形式チェックあり
   * (2)が有効の場合の自動返信の送信先
   */
  'EMAIL_ATTRIBUTE' => 'email',

  /**(8)
   * 
   * name属性とラベルの紐付け（日本語変換の場合）
   * 省略された場合はname属性を出力に使用されます。
   */
  'NAME_FOR_LABELS' => [
    'customerTitle' => '件名',
    'customerType' => '種別',
    'customerName' => 'お名前',
    'customerNameKana' => 'フリガナ',
    'address' => 'ご住所',
    'email' => 'メールアドレス',
    'phoneNumber' => '電話番号',
    'requestContent' => 'ご要望',
    'personalInformation' => '個人情報取扱',
  ],

  /**(9)
   * 
   * 必須項目のname属性
   */
  'REQUIRED_ATTRIBUTES' => [
    'customerTitle',
    'customerType',
    'customerName',
    'customerNameKana',
    'email',
    'requestContent',
    'personalInformation',
  ],

  /**(10)
   * 
   * 全角英数字を半角変換
   * 全角英数字→半角変換を行う項目のname属性の値（name="○○"の「○○」部分）
   * 配列の形「name="○○[]"」の場合には必ず後ろの[]を取ったものを指定して下さい。
   */
  'HANKAKU_ATTRIBUTES' => ['phoneNumber'],

  /**(11)
   * 
   * 添付ファイル「type="file"」のname属性の値
   */
  'ATTACHMENT_ATTRIBUTES' => ['uploadFile'],

  /**(12)
   * 
   * 添付ファイルで許可するファイルの種類
   */
  'ATTACHMENT_ACCEPTS' => [
    'image/png',
    'image/gif',
    'image/jpeg'
  ],

  /**(13)
   * 
   * 日本語を含まない文章の受付をブロック
   * 本文にあたるname属性を1つ指定してください。
   */
  'MULTIBYTE_ATTRIBUTE' => 'requestContent',

  /**(14)
   * 
   * 禁止ワードを含む文章をブロック
   */
  'WORDFILTER_ATTRIBUTE' => 'requestContent',

  /**(15)
   * 
   * 禁止ワードのリスト
   * 単語は半角全角を別々の単語と認識します。
   * 半角スペースで1つの単語として区切られます。
   * (14)で指定のname属性で判定します。
   */
  'BLOCK_NG_WORD' => 'bitch fuck',

  /**(16)
   * 
   * 禁止メールアドレスからの送信をブロック
   * 配列で複数指定してください。
   * (7)で指定のname属性で判定します。
   */
  'BLOCK_DOMAINS' => [
    '@ad-tube.biz',
    '@rediffmail.com',
    '@qq.com',
    '@example.com',
    'no-reply',
    'noreply',
  ],

  /**(17)
   * 
   * 確認画面のスキップ(スキップする=1, スキップしない=0)
   * 投稿画面からのPOSTを即時送信します。
   */
  'IS_CONFIRM_SKIP' => 0,

  /**(18)
   * 
   * HTMLタグを使用したメールテンプレート(HTML形式=1, Plain形式=0)
   * 入力内容の改行にはTwigタグの nl2br を指定する必要があります。
   */
  'IS_HTMLMAIL_TEMPLATE' => 0,

  /**(19)
   * 
   * 管理者宛のメールテンプレート(オプション)
   * PHPで生成したTwigテンプレートを使用する場合
   * admin.mail.twig を上書きします。
   */
  'TEMPLATE_ADMIN_MAIL' => '',

  /**(20)
   * 
   * ユーザ宛のメールテンプレート(オプション)
   * PHPで生成したTwigテンプレートを使用する場合
   * user.mail.twig を上書きします。
   */
  'TEMPLATE_USER_MAIL' => '',

];
