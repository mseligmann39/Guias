<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Necesario para obtener el usuario autenticado

class UserController extends Controller
{
    /**
     * Devuelve las guías creadas por el usuario autenticado.
     * GET /api/user/guides
     */
    public function myGuides(Request $request)
    {
        // Obtenemos el usuario autenticado
        $user = Auth::user();

        // Verificamos si realmente hay un usuario (aunque el middleware ya debería hacerlo)
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Cargamos las guías del usuario, y también cargamos la relación 'game' de cada guía
        // para tener el título del juego en el frontend.
        // Ordenamos por fecha de creación descendente (las más nuevas primero)
        $guides = $user->guides()->with('game:id,title') // Solo seleccionamos id y title del juego
                       ->orderBy('created_at', 'desc')
                       ->get();

        return response()->json($guides);
    }

    // Aquí podrías añadir más métodos en el futuro, como updateUser, changePassword, etc.
}