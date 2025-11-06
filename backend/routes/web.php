<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\GuideController;


Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Web routes kept minimal for API-only usage. Authentication for the API
// is handled under routes/api.php by App\Http\Controllers\Api\AuthController.
