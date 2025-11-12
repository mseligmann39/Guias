<?php

namespace Database\Factories;

use App\Models\Guide; // Asegúrate de que importe Guide
use App\Models\User;  // Para el user_id
use App\Models\Game;  // Para el game_id
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GuideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = 'Guía de ' . $this->faker->words(3, true);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            
            // Asignamos un User y Game válidos.
            // El seeder puede sobrescribir esto si es necesario.
            'user_id' => User::factory(), 
            'game_id' => Game::factory(),
            
            // 'content' ya no existe
        ];
    }

    /**
     * Configura el modelo después de que ha sido creado.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Guide $guide) {
            // Después de crear la guía, crea 3 secciones de ejemplo
            
            // Sección 1: Texto
            $guide->sections()->create([
                'order' => 0,
                'type' => 'text',
                'content' => $this->faker->paragraphs(3, true),
                'image_path' => null,
            ]);

            // Sección 2: Imagen (Falsa)
            $guide->sections()->create([
                'order' => 1,
                'type' => 'image',
                'content' => null,
                'image_path' => 'guides_images/placeholder.jpg', // Un placeholder
            ]);

            // Sección 3: Texto de nuevo
            $guide->sections()->create([
                'order' => 2,
                'type' => 'text',
                'content' => $this->faker->paragraphs(2, true),
                'image_path' => null,
            ]);
        });
    }
}