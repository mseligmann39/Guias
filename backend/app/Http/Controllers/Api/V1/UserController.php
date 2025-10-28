<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Guide; // Añade este import si no está

class UserController extends Controller
{
    public function myGuides(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Debug: verificar si el usuario tiene relación guides
        \Log::info("Usuario autenticado: " . $user->id);
        \Log::info("Número de guías: " . $user->guides()->count());

        $guides = $user->guides()
               ->with('game:id,title')
               ->orderBy('created_at', 'desc')
               ->get();

        return response()->json($guides);
    }
}