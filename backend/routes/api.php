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
use App\Http\Controllers\Api\V1\GuideReportController;
use App\Http\Controllers\Api\Admin\GameController as AdminGameController;
use App\Http\Controllers\Api\Admin\GuideController as AdminGuideController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;

/*
|--------------------------------------------------------------------------
| Rutas de la API
|--------------------------------------------------------------------------
|
| Aquí puedes registrar las rutas de la API para tu aplicación.
|
*/

// Rutas públicas (Sin autenticación requerida)
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

// Recursos públicos
Route::apiResource('games', GameController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::get('/guides/user/{userId}', [GuideController::class, 'guidesByUser']);
Route::get('/guides/popular', [GuideController::class, 'popular']);
Route::apiResource('guides', GuideController::class)->only(['index', 'show']);

// Reportar una guía (admite reportes anónimos)
Route::post('/guias/{guide}/reporte', [GuideReportController::class, 'store']);

Route::get('/search', [SearchController::class, 'index']);

// --- Rutas Protegidas (Requiere autenticación) ---
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

    // Eliminar una guía
    Route::delete('/guides/{guide}', [GuideController::class, 'destroy']);

    // Listas de usuario
    Route::post('/guides/{guide}/list-status', [UserListController::class, 'update']);

    // Comentarios
    Route::post('/guides/{guide}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Valoraciones
    Route::post('/guides/{guide}/ratings', [RatingController::class, 'store']);


    // Crear, actualizar y eliminar guías (solo usuarios autenticados)
    Route::apiResource('guides', GuideController::class)->except(['index', 'show']);

    // --- Admin Routes ---
});

// Rutas de administrador (requiere privilegios de administrador)
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Gestión de juegos
    Route::post('/games', [AdminGameController::class, 'store']);
    Route::put('/games/{game}', [AdminGameController::class, 'update']);
    Route::delete('/games/{game}', [AdminGameController::class, 'destroy']);

    // Gestión de guías
    Route::get('/guides', [AdminGuideController::class, 'index']);
    Route::delete('/guides/{guide}', [AdminGuideController::class, 'destroy']);

    // Gestión de reportes de guías
    Route::get('/reportes', [\App\Http\Controllers\Api\Admin\ReporteGuiaController::class, 'index']);
    Route::get('/reportes/{reporte}', [\App\Http\Controllers\Api\Admin\ReporteGuiaController::class, 'show']);
    Route::put('/reportes/{reporte}', [\App\Http\Controllers\Api\Admin\ReporteGuiaController::class, 'update']);

    // Gestión de usuarios
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
});