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
     * Muestra todas las guías.
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
     * ESTA ES LA FUNCIÓN CORRECTA PARA CREAR GUÍAS.
     */
    public function store(Request $request)
    {
        // Esta validación ya lanza una respuesta 422 con los errores si falla,
        // por lo que no necesitas un Validator::make() manual.
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:guides,title', // unique para evitar títulos repetidos
            'content' => 'required|string',
            'game_id' => 'required|exists:games,id', // 'game_id' debe coincidir con tu base de datos
        ]);

        $guide = Guide::create([
            'title' => $validatedData['title'],
            'slug' => Str::slug($validatedData['title']),
            'content' => $validatedData['content'],
            'game_id' => $validatedData['game_id'],
            'user_id' => Auth::id(), // Asignamos el ID del usuario autenticado.
        ]);

        // Devolvemos la guía creada con sus relaciones (usuario y juego) y un estado 201 (Created).
        return response()->json($guide->load('user', 'game'), 201);
    }

    /**
     * Muestra una guía específica.
     */
    public function show(Guide $guide)
    {
        return $guide->load('user', 'game');
    }

    /**
     * Muestra las guías del usuario autenticado.
     */
    public function userGuides()
    {
        $userId = Auth::id();
        $guides = Guide::where('user_id', $userId)
                       ->with('game')
                       ->orderBy('created_at', 'desc')
                       ->get();
        return response()->json($guides);
    }

    /**
     * Actualiza una guía.
     */
    public function update(Request $request, Guide $guide)
    {
        // Verificamos que el usuario que intenta actualizar es el autor de la guía.
        if ($guide->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:guides,title,' . $guide->id, // unique, pero ignora el actual
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
     * Elimina una guía.
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