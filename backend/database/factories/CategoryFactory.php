<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    

public function definition(): array
{   
    // usamos faker para generar datos aleatorios
    $name = $this->faker->unique()->word();

    return [
        'name' => $name,
        'slug' => \Illuminate\Support\Str::slug($name),
    ];
}

}