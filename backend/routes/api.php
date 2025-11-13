<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\GameController;
use App\Http\Controllers\Api\V1\GuideController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController as ApiAuthController;
use App\Http\Controllers\Api\V1\RatingController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\UserListController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\Admin\GameController as AdminGameController;
use App\Http\Controllers\Api\Admin\GuideController as AdminGuideController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
|
*/

// --- Rutas Públicas (Sin autenticación) ---
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

// Recursos públicos
Route::apiResource('games', GameController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::get('/guides/user/{userId}', [GuideController::class, 'guidesByUser']);
Route::get('/guides/popular', [GuideController::class, 'popular']);
Route::apiResource('guides', GuideController::class)->only(['index', 'show']);

Route::get('/search', [SearchController::class, 'index']);

// Guías por usuario


// Ruta de depuración de configuración de Sanctum (solo para desarrollo)
if (config('app.debug')) {
    Route::get('/debug-sanctum-config', function (Request $request) {
        $sanctumConfig = config('sanctum');
        $origin = $request->header('Origin');
        $originHost = $origin ? parse_url($origin, PHP_URL_HOST) : null;
        $originPort = $origin ? parse_url($origin, PHP_URL_PORT) : null;
        $fullOrigin = $originHost . ($originPort ? ':' . $originPort : '');
        
        return response()->json([
            'stateful_domains' => $sanctumConfig['stateful'],
            'request_origin' => $origin,
            'origin_host' => $originHost,
            'is_in_stateful_list' => in_array($originHost, $sanctumConfig['stateful']) || in_array($fullOrigin, $sanctumConfig['stateful']),
            'auth_check' => Auth::check(),
            'auth_user_id' => Auth::id(),
        ]);
    });
}

// --- Rutas Protegidas (Requieren autenticación) ---
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    Route::get('/me', [ApiAuthController::class, 'me']);

    // Usuario
    Route::prefix('user')->group(function () {
        Route::get('', fn (Request $request) => $request->user());
        Route::put('/profile', [UserController::class, 'update']);
        Route::get('/my-lists', [UserListController::class, 'index']);
    });

    Route::put('/guides/{guide}', [GuideController::class, 'update']);

    // NUEVA RUTA: Para eliminar una guía
    Route::delete('/guides/{guide}', [GuideController::class, 'destroy']);

    // Listas de usuario
    Route::post('/guides/{guide}/list-status', [UserListController::class, 'update']);

    // Comentarios
    Route::post('/guides/{guide}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Valoraciones
    Route::post('/guides/{guide}/ratings', [RatingController::class, 'store']);

    // Depuración (solo desarrollo)
    if (config('app.debug')) {
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
    }

    // Obtener las guías del usuario autenticado
   

    // Rutas para crear, actualizar y eliminar guías (solo usuarios autenticados)
    // Esto incluye: POST /guides, PUT/PATCH /guides/{guide}, DELETE /guides/{guide}
    Route::apiResource('guides', GuideController::class)->except(['index', 'show']);

    // --- Rutas solo para Administradores ---
    // El middleware 'admin' debe estar registrado en App/Http/Kernel.php
   
});

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Gestión de Juegos
    Route::post('/games', [AdminGameController::class, 'store']);
    Route::put('/games/{game}', [AdminGameController::class, 'update']);
    Route::delete('/games/{game}', [AdminGameController::class, 'destroy']);
    // (Asumo que también tienes GET /admin/games aquí)
    // Route::get('/games', [AdminGameController::class, 'index']); // <-- Asegúrate de tener esto

    // Gestión de Guías
    Route::get('/guides', [AdminGuideController::class, 'index']); // <-- ¡AÑADIR ESTA LÍNEA!
    Route::delete('/guides/{guide}', [AdminGuideController::class, 'destroy']);

    // Gestión de Usuarios
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
});