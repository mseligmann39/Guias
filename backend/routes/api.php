<?php

use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\GameController;
use App\Http\Controllers\Api\V1\GuideController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Importa el middleware
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// ¡Elimina esta línea de aquí! Las rutas de auth NO van en la API.
// require __DIR__ . '/auth.php'; 

// Aplica el middleware stateful a TODAS las rutas definidas en este archivo
Route::middleware([EnsureFrontendRequestsAreStateful::class])->group(function () {

    // --- Rutas Públicas ---
    Route::apiResource('games', GameController::class)->only(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::apiResource('guides', GuideController::class)->only(['index', 'show']);
    Route::apiResource('achievements', AchievementController::class)->only(['index', 'show']);

    // --- Rutas Protegidas (Requieren autenticación via Sanctum stateful) ---
    Route::middleware(['auth:sanctum'])->group(function () {

        // Obtener información del usuario actual
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Rutas solo para Administradores
        Route::middleware(['admin'])->group(function () {
            Route::apiResource('games', GameController::class)->except(['index', 'show']);
            Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
            Route::apiResource('achievements', AchievementController::class)->except(['index', 'show']);
        });

        // Rutas para crear/editar guías (cualquier usuario autenticado)
        Route::apiResource('guides', GuideController::class)->except(['index', 'show']);

        // Puedes añadir más rutas protegidas aquí...
    });
});