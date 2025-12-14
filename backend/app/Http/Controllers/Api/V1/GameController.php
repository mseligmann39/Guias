<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GameController extends Controller
{
    /**
     * Muestra una lista de todos los juegos con sus categorías.
     * GET /api/games
     */
   public function index(Request $request)
{
    $query = Game::query();

    // ¡NUEVO! Lógica de Búsqueda
    if ($request->has('search')) {
        $searchTerm = $request->input('search');
        // Busca si el título "es como" (LIKE) el término de búsqueda
        $query->where('title', 'LIKE', '%' . $searchTerm . '%');
    }

    // Ordenar por título por defecto
    $query->orderBy('title', 'asc');

    // Check if we want all games (lightweight list for dropdowns)
    if ($request->has('all') && $request->input('all') == 'true') {
        return response()->json($query->select('id', 'title')->get());
    }

    // Devolvemos 18 por página (o 50 si es una petición de admin)
    $perPage = $request->input('per_page', 18);

    return $query->paginate($perPage);
}

    /**
     * Almacena un nuevo juego en la base de datos.
     * POST /api/games
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:games',
            'description' => 'required|string',
            'release_date' => 'nullable|date',
            'cover_image_url' => 'nullable|url',
            'categories' => 'required|array', // Esperamos un array de IDs de categoría
            'categories.*' => 'exists:categories,id' // Verificamos que cada ID exista en la tabla categories
        ]);

        #dd($validatedData);

        // Creamos el juego con sus datos principales
        $game = Game::create([
            'title' => $validatedData['title'],
            'slug' => Str::slug($validatedData['title']),
            'description' => $validatedData['description'],
            'release_date' => $validatedData['release_date'],
            'cover_image_url' => $validatedData['cover_image_url'],
        ]);

        // Vinculamos las categorías al juego en la tabla pivote
        $game->categories()->attach($validatedData['categories']);

        // Devolvemos el juego recién creado, incluyendo sus categorías
        return response()->json($game->load('categories'), 201);
    }

    /**
     * Muestra un juego específico con todas sus relaciones.
     * GET /api/games/{id}
     */
    public function show(Game $game)
    {
        // Cargamos todas las relaciones que hemos definido en el modelo
        return $game->load('categories', 'guides');
    }

    /**
     * Actualiza un juego existente.
     * PUT/PATCH /api/games/{id}
     */
    public function update(Request $request, Game $game)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|unique:games,title,' . $game->id,
            'description' => 'required|string',
            'release_date' => 'nullable|date',
            'cover_image_url' => 'nullable|url',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id'
        ]);
        
        // Actualizamos los datos principales del juego
        $game->update([
            'title' => $validatedData['title'],
            'slug' => Str::slug($validatedData['title']),
            'description' => $validatedData['description'],
            'release_date' => $validatedData['release_date'],
            'cover_image_url' => $validatedData['cover_image_url'],
        ]);

        // Sincronizamos las categorías. sync() es ideal para actualizar.
        // Automáticamente añade las nuevas, quita las que no están y mantiene las que ya estaban.
        $game->categories()->sync($validatedData['categories']);

        return response()->json($game->load('categories'));
    }

    /**
     * Elimina un juego.
     * DELETE /api/games/{id}
     */
    public function destroy(Game $game)
    {
        $game->delete();
        
        // Gracias al 'onDelete('cascade')' que pusimos en las migraciones,
        // al borrar un juego se borrarán automáticamente sus guías, logros y
        // las entradas en la tabla pivote. ¡Todo en un solo paso!

        return response()->json(null, 204);
    }
}