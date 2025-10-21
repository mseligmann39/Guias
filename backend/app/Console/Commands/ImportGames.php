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
        $apiKey = config('services.rawg.api_key');

        if (!$apiKey) {
            $this->error('La API Key de RAWG no está configurada. Añádela a .env y config/services.php');
            return 1;
        }

        $this->info("Importando 50 juegos desde RAWG...");

        $response = Http::get("https://api.rawg.io/api/games", [
            'key' => $apiKey,
            'page_size' => 50,
        ]);

        if ($response->failed()) {
            $this->error('Error al contactar la API de RAWG. Verifica tu API key o la conexión.');
            return 1;
        }

        $gamesData = $response->json()['results'];

      /*   dd($gamesData); */

        foreach ($gamesData as $gameData) {
            $detailsResponse = Http::get("https://api.rawg.io/api/games/{$gameData['slug']}", ['key' => $apiKey]);

            if ($detailsResponse->failed()) {
                $this->warn("No se pudieron obtener los detalles para: " . $gameData['name']);
                $description = 'No description available.';
            } else {
                $description = $detailsResponse->json()['description_raw'] ?? 'No description available.';
            }

            $game = Game::updateOrCreate(
                ['slug' => $gameData['slug']],
                [
                    'title' => $gameData['name'],
                    'description' => strip_tags($description), // Limpiamos posible HTML
                    'release_date' => $gameData['released'],
                    'cover_image_url' => $gameData['background_image'],
                ]
            );

            $categoryIds = [];
            if (!empty($gameData['genres'])) {
                foreach ($gameData['genres'] as $genreData) {
                    $category = Category::firstOrCreate(
                        ['slug' => $genreData['slug']],
                        ['name' => $genreData['name']]
                    );
                    $categoryIds[] = $category->id;
                }
            }

            $game->categories()->sync($categoryIds);
            $this->line("Juego importado: " . $game->title);
        }

        $this->info("¡Importación completada con éxito!");
        return 0;
    }
}