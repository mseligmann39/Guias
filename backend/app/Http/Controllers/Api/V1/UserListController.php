<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use App\Models\GuideUser; // <- ¡ASEGÚRATE DE TENER ESTA!
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <- ¡Y ESTA!
use Illuminate\Validation\Rule; // <- ¡Y SOBRE TODO ESTA!

class UserListController extends Controller
{
    /**
     * Actualiza el estado de una guía para el usuario autenticado.
     */
    public function update(Request $request, Guide $guide)
    {
        $validated = $request->validate([
            // Validamos que los campos sean del tipo correcto si existen
            'is_favorite' => 'sometimes|boolean',
            'progress_status' => [
                'sometimes',
                'nullable',
                Rule::in(['todo', 'completed'])
            ],
        ]);

        $user = Auth::user();

        // Usamos 'updateOrCreate' para la elegancia
        // Busca por user_id y guide_id, y actualiza/crea con 'validated'
        $listEntry = GuideUser::updateOrCreate(
            [
                'user_id' => $user->id,
                'guide_id' => $guide->id,
            ],
            $validated
        );

        // Si una entrada se queda sin estados, la borramos para limpiar la BD
        if ($listEntry->is_favorite == false && $listEntry->progress_status == null) {
            $listEntry->delete();
            return response()->json(['message' => 'Guide removed from lists'], 200);
        }

        return response()->json($listEntry, 200);
    }

    /**
     * Devuelve las guías guardadas por el usuario, separadas por lista.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Cargamos las guías CON los datos del juego (para las Cards)
        $favorites = $user->savedGuides()
            ->wherePivot('is_favorite', true)
            ->with('game') // ¡Eficiente!
            ->get();

        $todo = $user->savedGuides()
            ->wherePivot('progress_status', 'todo')
            ->with('game')
            ->get();

        $completed = $user->savedGuides()
            ->wherePivot('progress_status', 'completed')
            ->with('game')
            ->get();

        return response()->json([
            'favorites' => $favorites,
            'todo' => $todo,
            'completed' => $completed,
        ]);
    }
}