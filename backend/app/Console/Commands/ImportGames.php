<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\HTTP;
use App\Models\Game;
use App\Models\Category;
use Iluminate\Support\Str;

class ImportGames extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:games';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'add games from RAWG API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //obtener api el .env
        $apiKey = config('services.rawg.api_key');
        if (empty($apiKey)) {
            $this->error('No se ha proporcionado una clave de API en el archivo .env.');
            return;
        }

        // llamar a la api para obtener 50 juegos
        $response = Http::get("https://api.rawg.io/api/games", [
            'key' => $apiKey,
            'page_size' => 50,
        ]);
        if ($response->failed()) {
            $this->error('Error al obtener los juegos de la API: ' . $response->body());
            return;
        }
        
        $games = $response->json()['results'];
         // 5. Itera sobre los resultados y crea los juegos y categorías
        foreach ($games as $gameData) {
            // Usa updateOrCreate para no crear duplicados si ejecutas el comando varias veces
            $game = Game::updateOrCreate(
                ['slug' => $gameData['slug']],
                [
                    'title' => $gameData['name'],
                    'description' => "Descripción de " . $gameData['name'], // La API no siempre da una descripción.
                    'release_date' => $gameData['released'],
                    'cover_image_url' => $gameData['background_image'],
                ]
            );

            $categoryIds = [];
            foreach ($gameData['genres'] as $genreData) {
                // Usa firstOrCreate para las categorías (que en la API se llaman "genres")
                $category = Category::firstOrCreate(
                    ['slug' => $genreData['slug']],
                    ['name' => $genreData['name']]
                );
                $categoryIds[] = $category->id;
            }

            // 6. Sincroniza las categorías con el juego
            $game->categories()->sync($categoryIds);

            $this->line("Juego importado: " . $game->title);
        }

        $this->info("¡Importación completada!");
    }
}