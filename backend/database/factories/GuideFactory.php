<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guide>
 */
class GuideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(6);
        return [
            // user_id y game_id se crearan automaticamente por Eloquent
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $this->faker->paragraph(5),
            
        ];
    }
}
