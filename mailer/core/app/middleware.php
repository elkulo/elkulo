<?php
declare(strict_types=1);

use Slim\App;
use Slim\Csrf\Guard;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use Slim\Flash\Messages;
use App\Application\Middleware\SessionMiddleware;
use App\Application\Settings\SettingsInterface;
use App\Application\Router\RouterInterface;
use Middlewares\Whoops;

return function (App $app) {
    $app->add(SessionMiddleware::class);

    // Whoops.
    if ($app->getContainer()->get(SettingsInterface::class)->get('debug')) {
        $app->add(Whoops::class);
    }

    // CSRF.
    $app->add(Guard::class);

    // Twig.
    $app->add(TwigMiddleware::createFromContainer($app, Twig::class));

    // Flash Messages.
    $app->add(
        function ($request, $next) use ($app) {
            if (session_status() !== PHP_SESSION_ACTIVE) {
                session_start();
            }
            $app->getContainer()->get(Messages::class)->__construct($_SESSION);
            return $next->handle($request);
        }
    );

    // Router.
    $app->add(
        function ($request, $next) use ($app) {
            $app->getContainer()->get(RouterInterface::class)->init($request);
            return $next->handle($request);
        }
    );
};
