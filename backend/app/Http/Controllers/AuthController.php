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

        // Regenera la sesión del usuario
        $request->session()->regenerate();

        // Devuelve la respuesta en formato JSON
        return response()->json([
            'message' => 'Login correcto',
            'user' => Auth::user(),
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
        // Realiza el logout del usuario
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Devuelve la respuesta en formato JSON
        return response()->json(['message' => 'Logout correcto']);
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