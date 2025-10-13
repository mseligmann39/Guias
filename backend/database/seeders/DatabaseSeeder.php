<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\Category;
use App\Models\Guide;
use App\Models\Achievement;
use App\Console\Commands\ImportGames;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
   public function run(): void
{
    // 1. Crea usuarios y categorías primero. Esto está bien.
    $admin = User::factory()->create([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'is_admin' => true,
    ]);
    
    $this->command->info('Importando datos de juegos reales desde la API de RAWG...');
        $this->call('import:games');
        $this->command->info('Datos de juegos reales importados con exito');
}
}
