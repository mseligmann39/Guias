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
        // Crear usuario administrador
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example',
            'is_admin' => true
        ]);

        // Crear 10 usuarios generales
        User::factory(10)->create();

        // Crear 10 categorias
        $categories = Category::factory(10)->create();

        // Crear 10 juegos
        Game::factory(50)->create()->each(function ($game) use ($categories) {
            $game->categories()->attach($categories->random(rand(1, 3))->pluck('id')->toArray()
        );
        });

        // Crear 100 guias asignando un autor y un juego aleatorio para cada una
        Guide::factory(100)->create()->each(function ($guide) use ($users, $games) {
            $guide->user()->associate($users->random());
            $guide->game()->associate($games->random());
            $guide->save();
        });

        // Crear 200 logros asignando un juego aleatorio para cada uno
        Achievement::factory(200)->create()->each(function ($achievement) use ($games) {
            $achievement->game()->associate($games->random());
            $achievement->save();
        });


    }
}
