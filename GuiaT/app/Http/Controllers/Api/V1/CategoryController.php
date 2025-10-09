<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Muestra una lista de todas las categorías.
     * GET /api/categories
     */
    public function index()
    {
        return Category::all();
    }

    /**
     * Almacena una nueva categoría en la base de datos.
     * POST /api/categories
     */
    public function store(Request $request)
    {
        // 1. Validar los datos de entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        // 2. Crear la categoría con un slug automático
        $category = Category::create([
            'name' => $validatedData['name'],
            'slug' => Str::slug($validatedData['name']),
        ]);

        // 3. Devolver la respuesta con el nuevo recurso creado
        return response()->json($category, 201);
    }

    /**
     * Muestra una categoría específica.
     * GET /api/categories/{id}
     */
    public function show(Category $category)
    {
        // Gracias al Route Model Binding de Laravel, no necesitamos buscarla.
        // Laravel lo hace automáticamente por nosotros.
        return $category;
    }

    /**
     * Actualiza una categoría existente.
     * PUT/PATCH /api/categories/{id}
     */
    public function update(Request $request, Category $category)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update([
            'name' => $validatedData['name'],
            'slug' => Str::slug($validatedData['name']),
        ]);

        return response()->json($category);
    }

    /**
     * Elimina una categoría.
     * DELETE /api/categories/{id}
     */
    public function destroy(Category $category)
    {
        $category->delete();

        // Devolvemos una respuesta vacía con código 204 (No Content)
        return response()->json(null, 204);
    }
}