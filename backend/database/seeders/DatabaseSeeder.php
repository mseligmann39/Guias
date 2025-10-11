<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\Category;
use App\Models\Guide;
use App\Models\Achievement;

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

    $users = User::factory(10)->create();
    $categories = Category::factory(15)->create();

    // 2. Crea 50 juegos y, muy importante, guarda la colección resultante en la variable $games.
    $games = Game::factory(50)->create()->each(function ($game) use ($categories) {
        $game->categories()->attach(
            $categories->random(rand(1, 3))->pluck('id')->toArray()
        );
    });

    // 3. Itera para crear las guías, asignando las claves foráneas ANTES de guardarlas.
    // Usamos make() para crear las instancias en memoria sin guardarlas aún.
    Guide::factory(100)->make()->each(function ($guide) use ($users, $games) {
        $guide->user_id = $users->random()->id;
        $guide->game_id = $games->random()->id;
        $guide->save(); // Ahora guardamos la guía con sus relaciones ya asignadas.
    });

    // 4. Hacemos lo mismo para los logros.
    Achievement::factory(200)->make()->each(function ($achievement) use ($games) {
        $achievement->game_id = $games->random()->id;
        $achievement->save();
    });
}
}
