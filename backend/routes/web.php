<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\GuideController;


Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/register', [AuthController::class, 'register']);
