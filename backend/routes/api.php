<?php

use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\GameController;
use App\Http\Controllers\Api\V1\GuideController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;

use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// ¡Elimina esta línea de aquí! Las rutas de auth NO van en la API. // Las rutas de autenticación ya están definidas en routes/web.php y routes/auth.php
// y no deben ser incluidas directamente aquí para evitar duplicidades o comportamientos inesperados.
// require __DIR__ . '/auth.php'; 

Route::middleware([EnsureFrontendRequestsAreStateful::class])->group(function () {
    
    // --- RUTA DEL USUARIO ACTUAL PRIMERO ---
    Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
        return $request->user();
    });

    // --- Rutas Públicas ---
    Route::apiResource('games', GameController::class)->only(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::apiResource('guides', GuideController::class)->only(['index', 'show']);
    Route::apiResource('achievements', AchievementController::class)->only(['index', 'show']);
    // --- Rutas Protegidas (Requieren autenticación via Sanctum stateful) ---
    Route::middleware(['auth:sanctum'])->group(function () {

        // Rutas de usuario autenticado
       Route::get('/user/guides', [GuideController::class, 'userGuides'])->name('user.guides'); // Obtener las guías del usuario autenticado

        // Rutas solo para Administradores (middleware 'admin' debe ser definido)
        // Rutas solo para Administradores
        Route::middleware(['admin'])->group(function () {
            Route::apiResource('games', GameController::class)->except(['index', 'show']);
            Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
            Route::apiResource('achievements', AchievementController::class)->except(['index', 'show']);
        });

        // Rutas para crear/editar/eliminar guías (cualquier usuario autenticado)
        Route::apiResource('guides', GuideController::class)->except(['index', 'show']);

        // Puedes añadir más rutas protegidas aquí...
    });
});