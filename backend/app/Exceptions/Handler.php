<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        // Para rutas API, devolver JSON en lugar de redirección
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }
        return response()->json([
            'message' => 'Unauthenticated.'
        ], 401);
        // Para rutas web, redirigir al login (comportamiento normal)
       /*  return redirect()->guest(route('login')); */
    }
}