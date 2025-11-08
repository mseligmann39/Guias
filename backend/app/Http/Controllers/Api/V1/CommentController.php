<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Guide $guide)
    {
        $request->validate([
            'body' => 'required|string|min:3',
        ]);

        $comment = $guide->comments()->create([
            'user_id' => Auth::id(),
            'body' => $request->body,
        ]);

        // Devolvemos el comentario con la info del usuario
        $comment->load('user');

        return response()->json($comment, 201);
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comment = \App\Models\Comment::findOrFail($id);
        
        // Verificar que el usuario autenticado es el dueño del comentario
        if (Auth::id() !== $comment->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comentario eliminado correctamente'], 200);
    }
}