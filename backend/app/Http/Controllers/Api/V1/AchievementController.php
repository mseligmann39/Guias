<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    /**
     * Muestra todos los logros, opcionalmente filtrados por juego.
     * GET /api/achievements o /api/achievements?game_id=1
     */
    public function index(Request $request)
    {
        if ($request->has('game_id')) {
            return Achievement::where('game_id', $request->game_id)->get();
        }

        return Achievement::all();
    }

    /**
     * Almacena un nuevo logro en la base de datos.
     * POST /api/achievements
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'game_id' => 'required|exists:games,id',
            'icon_url' => 'nullable|url',
        ]);

        $achievement = Achievement::create($validatedData);

        return response()->json($achievement, 201);
    }

    /**
     * Muestra un logro específico.
     * GET /api/achievements/{id}
     */
    public function show(Achievement $achievement)
    {
        return $achievement;
    }

    /**
     * Actualiza un logro existente.
     * PUT/PATCH /api/achievements/{id}
     */
    public function update(Request $request, Achievement $achievement)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'game_id' => 'required|exists:games,id',
            'icon_url' => 'nullable|url',
        ]);

        $achievement->update($validatedData);

        return response()->json($achievement);
    }

    /**
     * Elimina un logro.
     * DELETE /api/achievements/{id}
     */
    public function destroy(Achievement $achievement)
    {
        $achievement->delete();

        return response()->json(null, 204);
    }
}