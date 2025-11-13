<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GameController extends Controller
{
    /**
     * Almacena un nuevo juego (manualmente).
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:games,title',
            'description' => 'required|string',
            'cover_image_url' => 'nullable|url',
            'release_date' => 'nullable|date',
        ]);

        $game = Game::create([
            'title' => $validatedData['title'],
            'slug' => Str::slug($validatedData['title']),
            'description' => $validatedData['description'],
            'cover_image_url' => $validatedData['cover_image_url'],
            'release_date' => $validatedData['release_date'],
        ]);

        return response()->json($game, 201); // 201 = Created
    }

    /**
     * Actualiza un juego existente (ej. para traducir descripciones).
     */
    public function update(Request $request, Game $game)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:games,title,' . $game->id,
            'description' => 'required|string',
            'cover_image_url' => 'nullable|url',
            'release_date' => 'nullable|date',
        ]);

        // Si el título cambia, actualiza el slug
        if ($request->has('title')) {
            $validatedData['slug'] = Str::slug($validatedData['title']);
        }

        $game->update($validatedData);

        return response()->json($game); // Devuelve el juego actualizado
    }

    /**
     * Elimina un juego.
     */
  public function destroy(Game $game)
    {
        // 1. ANTES de borrar el juego, actualiza todas sus guías
        //    y pon su 'game_id' a null.
        // Esto asume que tienes la relación 'guides' en tu modelo 'Game'.
        $game->guides()->update(['game_id' => null]);

        // 2. AHORA que no hay guías apuntando a este juego,
        //    puedes eliminarlo de forma segura.
        $game->delete();

        return response()->json(null, 204);
    }
}