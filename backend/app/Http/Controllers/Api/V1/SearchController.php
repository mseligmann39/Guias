<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Guide;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Realiza una búsqueda global en Juegos, Guías y Usuarios.
     */
    public function index(Request $request)
    {
        // Validamos que el término de búsqueda 'q' esté presente
        $validated = $request->validate([
            'q' => 'required|string|min:3',
        ]);

        $searchTerm = '%' . $validated['q'] . '%';

        // 1. Buscar Juegos
        $games = Game::where('title', 'LIKE', $searchTerm)
                     ->select('id', 'title', 'slug', 'cover_image_url') // Devolver solo lo necesario
                     ->limit(5)
                     ->get();

        // 2. Buscar Guías
        $guides = Guide::where('title', 'LIKE', $searchTerm)
                       ->select('id', 'title', 'slug', 'game_id')
                       ->with('game:id,title') // Carga ligera del juego
                       ->limit(5)
                       ->get();

        // 3. Buscar Usuarios
        $users = User::where('name', 'LIKE', $searchTerm)
                     ->select('id', 'name') // ¡NUNCA devolver email o contraseñas!
                     ->limit(5)
                     ->get();

        return response()->json([
            'games' => $games,
            'guides' => $guides,
            'users' => $users,
        ]);
    }
}