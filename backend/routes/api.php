<?php

use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\GameController;
use App\Http\Controllers\Api\V1\GuideController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController as ApiAuthController;


// --- Rutas Públicas (Cualquiera puede acceder) ---
// Cualquiera puede ver listas de juegos, categorías, guías y logros.

// IMPORTANTE: Esta ruta específica debe estar ANTES de las rutas de apiResource
// para evitar conflictos con /guides/{guide}
// Obtener las guías de un usuario específico por su ID
Route::get('/guides/user/{userId}', [GuideController::class, 'guidesByUser']);

Route::apiResource('games', GameController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('guides', GuideController::class)->only(['index', 'show']);
Route::apiResource('achievements', AchievementController::class)->only(['index', 'show']);


// Rutas de autenticación
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    Route::get('/me', [ApiAuthController::class, 'me']);
});

// Ruta de debugging pública - verificar configuración de Sanctum
Route::get('/debug-sanctum-config', function (Request $request) {
    $sanctumConfig = config('sanctum');
    $origin = $request->header('Origin');
    $originHost = $origin ? parse_url($origin, PHP_URL_HOST) : null;
    $originPort = $origin ? parse_url($origin, PHP_URL_PORT) : null;
    $fullOrigin = $originHost . ($originPort ? ':' . $originPort : '');
    
    return response()->json([
        'stateful_domains' => $sanctumConfig['stateful'],
        'request_origin' => $origin,
        'request_referer' => $request->header('Referer'),
        'request_host' => $request->header('Host'),
        'origin_host' => $originHost,
        'origin_port' => $originPort,
        'full_origin' => $fullOrigin,
        'is_in_stateful_list' => in_array($originHost, $sanctumConfig['stateful']) || in_array($fullOrigin, $sanctumConfig['stateful']),
        'cookies_received' => array_keys($request->cookies->all()),
        'has_session' => $request->hasSession(),
        'session_id' => $request->hasSession() ? $request->session()->getId() : null,
        'auth_check' => Auth::check(),
        'auth_user_id' => Auth::id(),
    ]);
});

// --- Rutas Protegidas (Requieren autenticación con Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
   
   

    // Obtener información del usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Ruta de debugging temporal - ELIMINAR DESPUÉS
    Route::get('/debug-auth', function (Request $request) {
        return response()->json([
            'authenticated' => Auth::check(),
            'user' => Auth::user(),
            'user_id' => Auth::id(),
            'session_id' => $request->session()->getId(),
            'has_session' => $request->hasSession(),
            'all_cookies' => $request->cookies->all(),
            'headers' => [
                'origin' => $request->header('Origin'),
                'referer' => $request->header('Referer'),
                'host' => $request->header('Host'),
            ],
        ]);
    });

    // Obtener las guías del usuario autenticado
   

    // Rutas para crear, actualizar y eliminar guías (solo usuarios autenticados)
    // Esto incluye: POST /guides, PUT/PATCH /guides/{guide}, DELETE /guides/{guide}
    Route::apiResource('guides', GuideController::class)->except(['index', 'show']);

    // --- Rutas solo para Administradores ---
    // El middleware 'admin' debe estar registrado en App/Http/Kernel.php
    Route::middleware(['admin'])->group(function () {
        Route::apiResource('games', GameController::class)->except(['index', 'show']);
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('achievements', AchievementController::class)->except(['index', 'show']);
    });
});