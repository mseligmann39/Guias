<?php
// backend/app/Http/Controllers/Api/Admin/GuideController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use Illuminate\Http\Request; // <-- ¡Asegúrate de importar Request!
use Illuminate\Support\Facades\Storage; 

class GuideController extends Controller
{
    /**
     * Muestra una lista paginada de guías (para el panel de admin).
     * Incluye búsqueda y carga de relaciones.
     */
    public function index(Request $request) // <-- ¡AÑADIR ESTE MÉTODO COMPLETO!
    {
        // Usamos with() para Eager Loading de las relaciones
        // y seleccionamos solo los campos que necesitamos.
        $query = Guide::with([
            'user:id,name', // De la tabla 'users', trae id y name
            'game:id,title' // De la tabla 'games', trae id y title
        ]);

        // Búsqueda por título de guía
        if ($request->has('search')) {
            $query->where('title', 'LIKE', "%{$request->search}%");
        }
        
        // Búsqueda por ID de juego (¡Extra! útil para el futuro)
        if ($request->has('game_id')) {
            $query->where('game_id', $request->game_id);
        }

        $guides = $query->orderBy('created_at', 'desc')
                        ->paginate($request->get('per_page', 20));

        return response()->json($guides);
    }


    /**
     * Elimina la guía especificada (como administrador).
     */
    public function destroy(Guide $guide)
    {
        // Tu lógica de 'destroy' está bien, 
        // pero asegúrate de que el modelo Guide cargue las relaciones
        // 'sections' si no lo hace automáticamente.
        // Si 'sections' es una relación, hay que cargarla primero.
        $guide->load('sections'); // <-- Añade esto por si acaso

        // 1. Borrar todas las imágenes asociadas
        if ($guide->sections) { // Comprueba si la relación se cargó
            foreach ($guide->sections as $section) {
                if ($section->image_path) {
                    Storage::disk('public')->delete($section->image_path);
                }
            }
        }

        // 2. Eliminar la guía
        $guide->delete();

        return response()->json(null, 204); 
    }
}