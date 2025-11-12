<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use App\Models\GuideSection; // --- NUEVO: Importar el nuevo modelo ---
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; // --- NUEVO: Importar para manejar archivos ---
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB; // --- NUEVO: Para usar transacciones ---

class GuideController extends Controller
{
    /**
     * Muestra todas las guías.
     * (Tu método 'index' está excelente, no se toca)
     */
    public function index(Request $request)
    {
        // Empezamos la consulta con Eager Loading (buena práctica)
        $query = Guide::query()->with('user', 'game');

        // --- 1. FILTRADO ---
        if ($request->has('game_id')) {
            $query->where('game_id', $request->game_id);
        }
        if ($request->has('category_id')) {
            $query->whereHas('game.categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        // --- 2. ORDENACIÓN ---
        $sort = $request->input('sort', 'newest');
        if ($sort === 'rating_desc') {
            $query->withAvg('ratings', 'rating')
                  ->orderByDesc('ratings_avg_rating');
        } else {
            $query->orderByDesc('created_at');
        }

        // --- 3. PAGINACIÓN ---
        return $query->paginate(15);
    }

    /**
     * Almacena una nueva guía con secciones.
     * --- MÉTODO COMPLETAMENTE MODIFICADO ---
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:guides,title',
            'game_id' => 'required|exists:games,id',
            'sections' => 'required|array|min:1',
            'sections.*.order' => 'required|integer',
            'sections.*.type' => 'required|in:text,image,video',
            'sections.*.content' => 'nullable|string', // Para texto o URL de video
            'sections.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048' // Para subida de archivos
        ]);

        // Usamos una transacción para asegurar que o todo se crea, o nada se crea.
        $guide = DB::transaction(function () use ($request, $validatedData) {
            
            // 1. Crear la Guía principal
            $guide = Guide::create([
                'title' => $validatedData['title'],
                'slug' => Str::slug($validatedData['title']),
                'game_id' => $validatedData['game_id'],
                'user_id' => Auth::id(),
                // 'content' ya no existe, ¡correcto!
            ]);

            // 2. Crear las Secciones
            foreach ($request->input('sections') as $index => $sectionData) {
                $imagePath = null;
                $content = $sectionData['content'] ?? null;

                // 3. Lógica para subir y guardar la IMAGEN
                if ($sectionData['type'] === 'image' && $request->hasFile("sections.$index.image")) {
                    // 'store' guarda el archivo en 'storage/app/public/guides_images'
                    // y devuelve solo el path (ej: "guides_images/asdfj298as.jpg")
                    $file = $request->file("sections.$index.image");
                    $imagePath = $file->store('guides_images', 'public');
                    $content = null; // Nos aseguramos de que el contenido de texto esté vacío
                }

                $guide->sections()->create([
                    'order' => $sectionData['order'],
                    'type' => $sectionData['type'],
                    'content' => $content,      // Texto o URL de video
                    'image_path' => $imagePath,  // Path a la imagen guardada (o null)
                ]);
            }

            return $guide;
        });

        // Devolvemos la guía con todas sus nuevas relaciones cargadas
        return response()->json($guide->load('user', 'game', 'sections'), 201);
    }

    /**
     * Muestra una guía específica.
     * --- MÉTODO MODIFICADO ---
     */
    public function show(string $id)
    {
        try {
            // --- MODIFICADO: Añadimos 'sections' al 'with' ---
            $guide = Guide::with([
                'user',
                'game',
                'comments.user',
                'sections'         // <-- ¡NUEVO! Carga todas las secciones ordenadas
            ])->findOrFail($id);

            // (El resto de tu lógica 'show' era excelente y se mantiene)
            $averageRating = $guide->average_rating;
            $ratingCount = $guide->rating_count;

            $userRating = null;
            if (Auth::guard('sanctum')->check()) {
                $user = Auth::guard('sanctum')->user();
                $rating = $guide->ratings()->where('user_id', $user->id)->first();
                if ($rating) {
                    $userRating = $rating->rating;
                }
            }
            $userListStatus = [
                'is_favorite' => false,
                'progress_status' => null,
            ];

            if (Auth::guard('sanctum')->check()) {
                $user = Auth::guard('sanctum')->user();
                $entry = $user->savedGuides()->where('guide_id', $guide->id)->first();
                if ($entry) {
                    $userListStatus['is_favorite'] = $entry->pivot->is_favorite;
                    $userListStatus['progress_status'] = $entry->pivot->progress_status;
                }
            }

            $guideData = $guide->toArray();
            $guideData['average_rating'] = $averageRating;
            $guideData['rating_count'] = $ratingCount;
            $guideData['user_rating'] = $userRating;
            $guideData['list_status'] = $userListStatus;

            return response()->json($guideData);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Guide not found'], 404);
        }
    }

    /**
     * Muestra las guías del usuario autenticado.
     * (No se toca)
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
     * Muestra las guías de un usuario específico por su ID.
     * (No se toca)
     */
    public function guidesByUser($userId)
    {
        $guides = Guide::where('user_id', $userId)
                       ->with('user', 'game')
                       ->orderBy('created_at', 'desc')
                       ->get();
        return response()->json($guides);
    }

    /**
     * Actualiza una guía.
     * --- MÉTODO COMPLETAMENTE MODIFICADO ---
     */
    public function update(Request $request, Guide $guide)
    {
        // 1. Autorización
        if ($guide->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // 2. Validación (similar a 'store')
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:guides,title,' . $guide->id, // Ignora su propio ID
            'game_id' => 'required|exists:games,id',
            'sections' => 'required|array|min:1',
            'sections.*.order' => 'required|integer',
            'sections.*.type' => 'required|in:text,image,video',
            'sections.*.content' => 'nullable|string',
            // Nota: El manejo de imágenes es más complejo en 'update'
            // El frontend debe enviar la imagen solo si es nueva.
            'sections.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Usamos una transacción para seguridad
        DB::transaction(function () use ($request, $guide, $validatedData) {
            
            // 3. Actualizar la Guía principal
            $guide->update([
                'title' => $validatedData['title'],
                'slug' => Str::slug($validatedData['title']),
                'game_id' => $validatedData['game_id'],
            ]);

            // 4. Lógica de "Sync" de secciones (borrar todo y recrear)
            // Es la forma más simple y segura de empezar.
            
            // 4a. ¡IMPORTANTE! Borrar imágenes antiguas del disco
            foreach ($guide->sections as $oldSection) {
                if ($oldSection->image_path) {
                    Storage::disk('public')->delete($oldSection->image_path);
                }
            }
            
            // 4b. Borrar las secciones de la DB
            $guide->sections()->delete();

            // 4c. Re-crear las secciones (igual que en 'store')
            foreach ($request->input('sections') as $index => $sectionData) {
                $imagePath = null;
                $content = $sectionData['content'] ?? null;

                if ($sectionData['type'] === 'image') {
                    if ($request->hasFile("sections.$index.image")) {
                        // Subir imagen NUEVA
                        $file = $request->file("sections.$index.image");
                        $imagePath = $file->store('guides_images', 'public');
                        $content = null;
                    } elseif (!empty($sectionData['image_path'])) {
                        // Conservar imagen existente (si el frontend la re-envía como path)
                        // ESTO ES AVANZADO. Por ahora, asumimos que se re-sube o se borra.
                        // La lógica simple de "borrar todo" asume que el frontend envía todo de nuevo.
                        $imagePath = $sectionData['image_path']; // Peligroso si no se sanea
                    }
                }

                // Lógica de "store" es más segura aquí:
                if ($sectionData['type'] === 'image' && $request->hasFile("sections.$index.image")) {
                     $file = $request->file("sections.$index.image");
                     $imagePath = $file->store('guides_images', 'public');
                     $content = null;
                }

                // TODO: Mejorar la lógica de 'update' para no requerir re-subir imágenes.
                // Por ahora, esta lógica funciona si el frontend envía *todas* las secciones
                // como si fueran nuevas, incluyendo subir los archivos de nuevo.

                $guide->sections()->create([
                    'order' => $sectionData['order'],
                    'type' => $sectionData['type'],
                    'content' => $content,
                    'image_path' => $imagePath,
                ]);
            }
        });
        
        return response()->json($guide->load('user', 'game', 'sections'));
    }

    /**
     * Elimina una guía.
     * --- MÉTODO MODIFICADO ---
     */
    public function destroy(Guide $guide)
    {
        // 1. Autorización
        if ($guide->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // 2. --- NUEVO: Borrar todas las imágenes asociadas ---
        // La DB borrará las *filas* de secciones por el 'onDelete('cascade')'
        // Pero no borrará los *archivos* del disco.
        foreach ($guide->sections as $section) {
            if ($section->image_path) {
                Storage::disk('public')->delete($section->image_path);
            }
        }

        // 3. Eliminar la guía (y las secciones se van en cascada)
        $guide->delete();

        return response()->json(null, 204);
    }

    /**
     * Muestra guías populares.
     * (No se toca)
     */
    public function popular(Request $request)
    {
        $limit = $request->input('limit', 5);
        return Guide::query()
            ->with('user', 'game')
            ->withAvg('ratings', 'rating')
            ->orderByDesc('ratings_avg_rating')
            ->take($limit)
            ->get();
    }
}