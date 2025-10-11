<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Achievement>
 */
class AchievementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            // game_id se asigna en el seeder
            'name' => $this->faker->words(4, true),
            'description' => $this->faker->sentence(10),
            'icon_url' => $this->faker->imageUrl(64,64, 'achievement'),
        ];
    }
}
