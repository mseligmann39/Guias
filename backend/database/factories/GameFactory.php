<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(3);
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $this->faker->paragraph(5),
            'release_date' => $this->faker->date(),
            'cover_image_url' => $this->faker->imageUrl(480,640, 'vidoegame'),
        ];
    }
}
