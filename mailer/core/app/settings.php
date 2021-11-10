<?php
declare(strict_types=1);

use DI\ContainerBuilder;
use Monolog\Logger;
use App\Application\Settings\Settings;
use App\Application\Settings\SettingsInterface;

return function (ContainerBuilder $containerBuilder) {
    // Global Settings Object
    $containerBuilder->addDefinitions([
        SettingsInterface::class => function () {

            // サイト設定値.
            $site = include rtrim(SETTINGS_DIR_PATH, '/') . '/settings/site.php';

            // ログファイル.
            $logFile = isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/app-' . date("Y-m-d") . '.log';

            return new Settings([
                'phpMinSupport' => '7.4.0',
                'appPath' => rtrim(__DIR__ . '/../', '/'),
                'siteTitle' => $site['SITE_TITLE'],
                'siteUrl' => (empty($_SERVER['HTTPS']) ? 'http://' : 'https://') . rtrim($site['SITE_DOMAIN'], '/'),
                'siteLang' => $site['SITE_LANG'],
                'timeZone' => $site['TIME_ZONE'],
                'templatesDirPath' => rtrim(TEMPLATES_DIR_PATH, '/'),
                'settingsDirPath' => rtrim(SETTINGS_DIR_PATH, '/'),
                'debug' => isset($site['DEBUG']) ? $site['DEBUG'] : false,
                // Should be set to false in production
                'displayErrorDetails' => isset($site['DEBUG']) ? $site['DEBUG'] : false,
                'logError'            => isset($site['DEBUG']) ? ! $site['DEBUG'] : true,
                'logErrorDetails'     => isset($site['DEBUG']) ? ! $site['DEBUG'] : true,
                'logger' => [
                    'name' => 'mailer',
                    'path' => $logFile,
                    'level' => Logger::DEBUG,
                ],
                'twig' => [
                    'debug' => isset($site['DEBUG']) ? $site['DEBUG'] === 'true' : false,
                    'auto_reload' => isset($site['DEBUG']) ? $site['DEBUG'] === 'true' : false,
                    'strict_variables' => isset($site['DEBUG']) ? $site['DEBUG'] === 'true' : false,
                    //'cache' => __DIR__ . '/../var/cache/twig',
                    'cache' => false,
                ],
                'database' => include rtrim(SETTINGS_DIR_PATH, '/') . '/settings/database.php',
                'form' => include rtrim(SETTINGS_DIR_PATH, '/') . '/settings/form.php',
                'mail' => include rtrim(SETTINGS_DIR_PATH, '/') . '/settings/mail.php',
                'validate' => include rtrim(SETTINGS_DIR_PATH, '/') . '/settings/validate.php',
            ]);
        }
    ]);
};
