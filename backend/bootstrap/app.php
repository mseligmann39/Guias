<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Routing\Middleware\SubstituteBindings;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Carga las rutas de autenticación definidas en routes/auth.php
            require base_path('routes/auth.php');
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Habilita la pila de middleware de API stateful para Sanctum (cookies + sesión)
        $middleware->statefulApi();
    })

    ->withExceptions(function (Exceptions $exceptions) {
    })->create();
