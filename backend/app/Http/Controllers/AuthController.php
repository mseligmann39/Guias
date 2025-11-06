<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
/**
 * Controlador para la autenticación de usuarios.
 */
class AuthController extends Controller
{
    /**
     * Realiza el login de un usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Valida los datos de la request
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Realiza el login con los datos de la request
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son válidas.'],
            ]);
        }

        $user = Auth::user();
        
        // Revoca tokens anteriores y crea uno nuevo
        $user->tokens()->delete();
        $token = $user->createToken('api-token')->plainTextToken;

        // Devuelve la respuesta en formato JSON con el token
        return response()->json([
            'message' => 'Login correcto',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Realiza el logout de un usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Revoca todos los tokens del usuario
            $user->tokens()->delete();

            return response()->json([
                'message' => 'Logout correcto',
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error during logout:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error durante el logout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Realiza el registro de un usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Valida los datos de la request
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:6'],
        ]);

        // Crea un nuevo usuario con los datos de la request
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Realiza el login del usuario recién creado
        Auth::login($user);
        $request->session()->regenerate();

        // Devuelve la respuesta en formato JSON
        return response()->json([
            'message' => 'Registro exitoso',
            'user' => $user,
        ]);
    }
}