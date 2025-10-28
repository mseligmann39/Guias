<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GuideController extends Controller
{
    /**
     * Muestra todas las guías. Se puede filtrar por juego.
     * GET /api/guides o /api/guides?game_id=1
     */
    public function index()
    {
        if (request('game_id')) {
            return Guide::where('game_id', request('game_id'))->with('user', 'game')->get();
        }

        
       
        return Guide::with('user', 'game')->get();
    }

    /**
     * Almacena una nueva guía. El autor será el usuario autenticado.
     * POST /api/guides
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'game_id' => 'required|exists:games,id',
        ]);

        $guide = Guide::create([
            'title' => $validatedData['title'],
            'slug' => Str::slug($validatedData['title']),
            'content' => $validatedData['content'],
            'game_id' => $validatedData['game_id'],
            'user_id' => Auth::id(), // ¡Importante! Asignamos el ID del usuario autenticado.
        ]);

        return response()->json($guide->load('user', 'game'), 201);
    }

    /**
     * Muestra una guía específica.
     * GET /api/guides/{id}
     */
    public function show(Guide $guide)
    {
        return $guide->load('user', 'game');
    }

    public function userGuides()
    {
        // Obtenemos el ID del usuario autenticado
        $userId = Auth::id();

        // Buscamos las guías donde el user_id coincida
        // Usamos 'with' para cargar también la información del juego (Eager Loading)
        // Ordenamos por fecha de creación descendente (opcional)
        $guides = Guide::where('user_id', $userId)
                       ->with('game') // Carga la relación 'game' definida en el modelo Guide
                       ->orderBy('created_at', 'desc')
                       ->get();

        // Devolvemos las guías encontradas como JSON
        return response()->json($guides);
    }

    
    /**
     * Actualiza una guía. Solo el autor original puede hacerlo.
     * PUT/PATCH /api/guides/{id}
     */
    public function update(Request $request, Guide $guide)
    {
        // Verificamos que el usuario que intenta actualizar es el autor de la guía.
        if ($guide->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'game_id' => 'required|exists:games,id',
        ]);

        $guide->update([
            'title' => $validatedData['title'],
            'slug' => Str::slug($validatedData['title']),
            'content' => $validatedData['content'],
            'game_id' => $validatedData['game_id'],
        ]);

        return response()->json($guide->load('user', 'game'));
    }

    /**
     * Elimina una guía. Solo el autor original puede hacerlo.
     * DELETE /api/guides/{id}
     */
    public function destroy(Guide $guide)
    {
        if ($guide->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $guide->delete();

        return response()->json(null, 204);
    }
}