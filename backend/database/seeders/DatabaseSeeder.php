<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan; // <-- ¡IMPORTANTE! Importa la fachada Artisan.

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crea tu usuario administrador
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        $this->command->info('Importando datos de juegos reales desde la API de RAWG...');

        // --- CAMBIO CLAVE AQUÍ ---
        // Usamos la fachada Artisan para llamar al comando directamente.
        Artisan::call('import:games');
    }
}