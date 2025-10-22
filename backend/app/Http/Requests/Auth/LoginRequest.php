<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Ya estaba correcto: espera 'email'
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // --- CORRECCIÓN CLAVE AQUÍ ---
        // Usamos directamente el campo 'email' validado
        $credentials = [
            'email' => $this->input('email'),
            'password' => $this->input('password'),
        ];

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            // Asociamos el error al campo 'email'
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'), // Mensaje genérico de credenciales incorrectas
            ]);
        }

        // --- FIN CORRECCIÓN ---

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        // --- CORRECCIÓN CLAVE AQUÍ ---
        // Asociamos el error de throttle al campo 'email'
        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
        // --- FIN CORRECCIÓN ---
    }

    public function throttleKey(): string
    {
        // Usamos el email (en minúsculas) y la IP para limitar intentos
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }
}