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
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'login_id' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
   public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // 1. Determina si 'login_id' es un email o un username
        $loginValue = $this->input('login_id');
        // Usamos filter_var para validar si es un email. La columna 'name' es la de username.
        $loginField = filter_var($loginValue, FILTER_VALIDATE_EMAIL) ? 'email' : 'name';

        // 2. Prepara las credenciales dinámicamente
        $credentials = [
            $loginField => $loginValue,
            'password' => $this->input('password'),
        ];

        // 3. Intenta autenticar usando las credenciales preparadas
        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            // Si falla, lanzamos la excepción asociada al campo 'login_id'
            throw ValidationException::withMessages([
    // CORREGIDO:
    'login_id' => trans('auth.throttle', [ 
        'seconds' => $seconds,
        'minutes' => ceil($seconds / 60),
    ]),
]);
        }

        // 4. Si la autenticación es exitosa, limpiamos el limitador
        RateLimiter::clear($this->throttleKey());
    }
    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
    'login_id' => trans('auth.throttle', [ // <-- CORREGIDO
        'seconds' => $seconds,
        'minutes' => ceil($seconds / 60),
    ]),
]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }
}
