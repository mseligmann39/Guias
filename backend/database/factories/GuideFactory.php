<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GuideFactory extends Factory
{
    public function definition(): array
    {
        $title = 'Guía completa de ' . $this->faker->words(3, true);

        return [
            // Hemos eliminado las líneas 'game_id' y 'user_id'.
            // Ahora, es responsabilidad del seeder proporcionar estos datos,
            // lo cual ya estás haciendo correctamente.
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $this->faker->paragraphs(10, true),
        ];
    }
}