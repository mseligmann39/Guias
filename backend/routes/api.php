<?php

use App\Http\Controllers\Api\V1\AchievementController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\GameController;
use App\Http\Controllers\Api\V1\GuideController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas de Autenticación (ya existentes)
require __DIR__.'/auth.php';

// Rutas Públicas (Cualquiera puede verlas)
Route::apiResource('games', GameController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('guides', GuideController::class)->only(['index', 'show']);
Route::apiResource('achievements', AchievementController::class)->only(['index', 'show']);
// Puedes añadir aquí las rutas para ver guías y logros si quieres que sean públicas

// Rutas Protegidas (Solo para usuarios autenticados)
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
});