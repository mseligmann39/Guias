<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function store(Request $request, Guide $guide)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $rating = $guide->ratings()->updateOrCreate(
            [
                'user_id' => Auth::id(), // Clave para buscar
            ],
            [
                'rating' => $request->rating, // Valor para actualizar/crear
            ]
        );

        return response()->json($rating, 200);
    }
}