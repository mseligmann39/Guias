<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Guide;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crea tu usuario administrador
        $admin = User::factory()->create([
            'name' => 'admin.maxi.2001',
            'email' => 'admin.maxi.2001@example.com',
            'password' => Hash::make('admin.maxi.2001'),
            'is_admin' => true,
        ]);

        // 2. Crear usuarios normales
        $users = User::factory(100)->create();

        // 3. Importar juegos
        $this->command->info('Importando datos de juegos reales...');
        Artisan::call('import:games');
        $games = Game::all();

        // 4. Crear guías
        if ($games->isNotEmpty()) {

            // --- INICIO DE LA CORRECCIÓN ---
            // Usamos .create() para que se dispare el hook 'afterCreating'
            // y le pasamos funciones para los valores aleatorios.
            Guide::factory(200)->create([
                'user_id' => fn() => $users->random()->id,
                'game_id' => fn() => $games->random()->id,
            ]);
            // --- FIN DE LA CORRECCIÓN ---

            // Creamos también una guía con nuestro usuario admin
            Guide::factory()->create([
                'game_id' => $games->random()->id,
                'user_id' => $admin->id,
            ]);
        } else {
            $this->command->warn('No se encontraron juegos para asignar guías.');
        }
    }
}