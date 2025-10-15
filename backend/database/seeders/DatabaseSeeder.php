<?php

namespace Database\Seeders;

use App\Models\Game; // <-- ¡IMPORTANTE! Importa el modelo Game.
use App\Models\Guide;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash; // Usa Hash en lugar de bcrypt()

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crea tu usuario administrador y guárdalo en una variable.
        $admin = User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin'), // Es mejor usar Hash::make()
            'is_admin' => true,
        ]);

        // 2. Crear 10 usuarios normales.
        $users = User::factory(100)->create();

        // 3. Llama a tu comando para importar los juegos.
        $this->command->info('Importando datos de juegos reales...');
        Artisan::call('import:games');

        // 4. ¡Aquí está la clave! Recupera todos los juegos de la base de datos.
        $games = Game::all();

        // 5. Ahora sí, crea las guías usando las variables que ya existen.
        if ($games->isNotEmpty()) { // Nos aseguramos de que hay juegos antes de crear guías

            Guide::factory(200)->make()->each(function ($guide) use ($users, $games) {
                $guide->user_id = $users->random()->id;
                $guide->game_id = $games->random()->id; // <-- Esto se ejecuta en CADA iteración
                $guide->save();
            });

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
