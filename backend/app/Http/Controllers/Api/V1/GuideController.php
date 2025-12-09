<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use App\Models\GuideSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class GuideController extends Controller
{
    /**
     * Muestra todas las guías.
     */
    public function index(Request $request)
    {
        $query = Guide::query()->with('user', 'game');

        if ($request->has('game_id')) {
            $query->where('game_id', $request->game_id);
        }
        if ($request->has('category_id')) {
            $query->whereHas('game.categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        $sort = $request->input('sort', 'newest');
        if ($sort === 'rating_desc') {
            $query->withAvg('ratings', 'rating')
                ->orderByDesc('ratings_avg_rating');
        } else {
            $query->orderByDesc('created_at');
        }

        return $query->paginate(Guide::PER_PAGE);
    }

    /**
     * Almacena una nueva guía con secciones.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:guides,title',
            'game_id' => 'required|exists:games,id',
            'sections' => 'required|array|min:1',
            'sections.*.order' => 'required|integer',
            'sections.*.type' => 'required|in:text,image,video',
            'sections.*.content' => 'nullable|string',
            'sections.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $guide = DB::transaction(function () use ($request, $validatedData) {

            $guide = Guide::create([
                'title' => $validatedData['title'],
                'slug' => Str::slug($validatedData['title']),
                'game_id' => $validatedData['game_id'],
                'user_id' => Auth::id(),
            ]);

            foreach ($request->input('sections') as $index => $sectionData) {
                $imagePath = null;
                $content = $sectionData['content'] ?? null;

                if ($sectionData['type'] === 'image' && $request->hasFile("sections.$index.image")) {
                    $file = $request->file("sections.$index.image");
                    $imagePath = $file->store('guides_images', 'public');
                    $content = null;
                }

                $guide->sections()->create([
                    'order' => $sectionData['order'],
                    'type' => $sectionData['type'],
                    'content' => $content,
                    'image_path' => $imagePath,
                ]);
            }

            return $guide;
        });

        return response()->json($guide->load('user', 'game', 'sections'), 201);
    }

    /**
     * Muestra una guía específica.
     */
    public function show(string $id)
    {
        try {
            $guide = Guide::with([
                'user',
                'game',
                'comments.user',
                'sections'
            ])->findOrFail($id);

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
     */
    public function update(Request $request, Guide $guide)
    {
        if ($guide->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:guides,title,' . $guide->id,
            'game_id' => 'required|exists:games,id',
            'sections' => 'required|array|min:1',
            'sections.*.order' => 'required|integer',
            'sections.*.type' => 'required|in:text,image,video',
            'sections.*.content' => 'nullable|string',
            'sections.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        DB::transaction(function () use ($request, $guide, $validatedData) {

            $guide->update([
                'title' => $validatedData['title'],
                'slug' => Str::slug($validatedData['title']),
                'game_id' => $validatedData['game_id'],
            ]);

            // Recopilar rutas de imágenes que se deben MANTENER (vienen en la request)
            $keptImagePaths = [];
            foreach ($request->input('sections') as $sectionData) {
                if (isset($sectionData['image_path']) && !empty($sectionData['image_path'])) {
                    $keptImagePaths[] = $sectionData['image_path'];
                }
            }

            // Eliminar imágenes antiguas SOLO si no están en la lista de "mantenidas"
            foreach ($guide->sections as $oldSection) {
                if ($oldSection->image_path) {
                    // Si la imagen antigua NO está en la lista de las que se quedan, se borra del disco
                    if (!in_array($oldSection->image_path, $keptImagePaths)) {
                         if (Storage::disk('public')->exists($oldSection->image_path)) {
                            Storage::disk('public')->delete($oldSection->image_path);
                        }
                    }
                }
            }

            $guide->sections()->delete();

            foreach ($request->input('sections') as $index => $sectionData) {
                $imagePath = null;
                $content = $sectionData['content'] ?? null;

                if ($sectionData['type'] === 'image') {
                    if ($request->hasFile("sections.$index.image")) {
                        // Caso A: Se subió una IMAGEN NUEVA
                        $file = $request->file("sections.$index.image");
                        $imagePath = $file->store('guides_images', 'public');
                        $content = null;
                    } elseif (!empty($sectionData['image_path'])) {
                        // Caso B: Se MANTIENE la imagen existente
                        $imagePath = $sectionData['image_path'];
                    }
                }

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
     */
    public function destroy(Guide $guide)
    {
        if ($guide->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        foreach ($guide->sections as $section) {
            if ($section->image_path) {
                if (Storage::disk('public')->exists($section->image_path)) {
                    Storage::disk('public')->delete($section->image_path);
                }
            }
        }

        $guide->delete();

        return response()->json(null, 204);
    }

    /**
     * Muestra guías populares.
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