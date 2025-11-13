<?php
// backend/app/Http/Controllers/Api/Admin/AdminUserController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request; // <-- 1. Importar Request
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Muestra una lista de todos los usuarios.
     */
    public function index(Request $request) // <-- 2. Aceptar Request $request
    {
        $query = User::query(); // <-- 3. Empezar con un constructor de consulta

        // 4. Añadir lógica de búsqueda
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            });
        }

        // 5. Paginar el resultado de la consulta
        $users = $query->orderBy('name', 'asc')
                       ->paginate($request->get('per_page', 50));

        return response()->json($users); // <-- 6. Devolver el JSON
    }

    /**
     * Elimina al usuario especificado.
     */
    public function destroy(User $user)
    {
        // Tu lógica es perfecta. ¡Bien hecho al prevenir 
        // que el admin se elimine a sí mismo!
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'No puedes eliminar tu propia cuenta de administrador.'], 403);
        }

        $user->delete();

        return response()->json(null, 204);
    }
}