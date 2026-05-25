<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AdminMiddleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ✅ SetLocale كيتطبق على كل routes ديال API
        

        $middleware->alias([
            'admin' => AdminMiddleware::class,
         
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
    // use Illuminate\Foundation\Application;
// use Illuminate\Foundation\Configuration\Exceptions;
// use Illuminate\Foundation\Configuration\Middleware;
// use App\Http\Middleware\AdminMiddleware;
// use App\Http\Middleware\SetLocale;

// return Application::configure(basePath: dirname(__DIR__))
//     ->withRouting(
//         web: __DIR__.'/../routes/web.php',
//         api: __DIR__.'/../routes/api.php',
//         commands: __DIR__.'/../routes/console.php',
//         health: '/up',
//     )
//     ->withMiddleware(function (Middleware $middleware) {

//         // // ✅ CORS — khasso ikoun awel haja f pipeline
//         // $middleware->use([
//         //     \Illuminate\Http\Middleware\HandleCors::class,
//         // ]);

//         // Alias middlewares
//         $middleware->alias([
//             'admin' => AdminMiddleware::class,
//             'locale' => SetLocale::class,
//         ]);
//     })
//     ->withExceptions(function (Exceptions $exceptions) {
//         //
//     })->create();


// return Application::configure(basePath: dirname(__DIR__))
//     ->withRouting(
//         web: __DIR__.'/../routes/web.php',
//         api: __DIR__.'/../routes/api.php',
//         commands: __DIR__.'/../routes/console.php',
//         health: '/up',
//     )
//     ->withMiddleware(function (Middleware $middleware) {
//         // ← hbet statefulApi() — makhassekch l React m3a Bearer token
//         $middleware->alias([
//             'admin' => AdminMiddleware::class,
//         ]);
//     })
//     ->withExceptions(function (Exceptions $exceptions) {
//         //
//     })->create();
