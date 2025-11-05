<?php

use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\GameController;
use App\Http\Controllers\Api\V1\GuideController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- Rutas Públicas (Cualquiera puede acceder) ---
// Cualquiera puede ver listas de juegos, categorías, guías y logros.
Route::apiResource('games', GameController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('guides', GuideController::class)->only(['index', 'show']);
Route::apiResource('achievements', AchievementController::class)->only(['index', 'show']);


// --- Rutas Protegidas (Requieren autenticación con Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Obtener información del usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Obtener las guías del usuario autenticado
    Route::get('/user/guides', [GuideController::class, 'userGuides'])->name('user.guides');

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