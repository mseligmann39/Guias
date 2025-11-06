<?php

namespace App\Console\Commands; // <-- ¡LA CORRECCIÓN ESTÁ AQUÍ!

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Game;
use App\Models\Category;
use Illuminate\Support\Str;
class ImportGames extends Command
{
    protected $signature = 'import:games';

    protected $description = 'Importa juegos desde la API de RAWG';

    public function handle()
    {
        // Obtenemos la API key de RAWG
        $apiKey = config('services.rawg.api_key');

        // Verificamos si la API key ha sido configurada en .env y config/services.php
        if (!$apiKey) {
            // Si no hay API key, creamos datos de prueba con factories para evitar
            // que la aplicación quede sin juegos en desarrollo/local.
            $this->warn('RAWG API key no configurada. Creando datos de prueba con factories...');

            // Crear algunas categorías
            $categories = \App\Models\Category::factory(8)->create();

            // Crear juegos falsos y asignarles categorías aleatorias
            $games = \App\Models\Game::factory(30)->create()->each(function ($game) use ($categories) {
                $game->categories()->sync($categories->random(rand(1, 3))->pluck('id')->toArray());
            });

            $this->info('Datos de prueba creados.');
            return 0;
        }

        $this->info("Importando 50 juegos desde RAWG...");

        // Obtenemos la respuesta de la API de RAWG
        $response = Http::get("https://api.rawg.io/api/games", [
            'key' => $apiKey,
            'page_size' => 50,
        ]);

        // Verificamos si la respuesta fue exitosa
        if ($response->failed()) {
            $this->error('Error al contactar la API de RAWG. Verifica tu API key o la conexión.');
            return 1;
        }

        // Obtenemos la lista de juegos
        $gamesData = $response->json()['results'];

      /*   dd($gamesData); */

        // Iteramos sobre cada juego
        foreach ($gamesData as $gameData) {
            // Obtenemos los detalles del juego
            $detailsResponse = Http::get("https://api.rawg.io/api/games/{$gameData['slug']}", ['key' => $apiKey]);

            // Verificamos si la respuesta fue exitosa
            if ($detailsResponse->failed()) {
                $this->warn("No se pudieron obtener los detalles para: " . $gameData['name']);
                $description = 'No description available.';
            } else {
                $description = $detailsResponse->json()['description_raw'] ?? 'No description available.';
            }

            // Actualizamos o creamos el juego en la base de datos
            $game = Game::updateOrCreate(
                ['slug' => $gameData['slug']],
                [
                    'title' => $gameData['name'],
                    'description' => strip_tags($description), // Limpiamos posible HTML
                    'release_date' => $gameData['released'],
                    'cover_image_url' => $gameData['background_image'],
                ]
            );

            // Obtenemos los ID de las categorías
            $categoryIds = [];
            if (!empty($gameData['genres'])) {
                // Iteramos sobre cada género
                foreach ($gameData['genres'] as $genreData) {
                    // Obtenemos o creamos la categoría
                    $category = Category::firstOrCreate(
                        ['slug' => $genreData['slug']],
                        ['name' => $genreData['name']]
                    );
                    // Agregamos el ID de la categoría a la lista
                    $categoryIds[] = $category->id;
                }
            }

            // Sincronizamos las categorías con el juego
            $game->categories()->sync($categoryIds);
            $this->line("Juego importado: " . $game->title);
        }

        $this->info("¡Importación completada con éxito!");
        return 0;
    }
}
