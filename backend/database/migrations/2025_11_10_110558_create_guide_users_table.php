<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guide_user', function (Blueprint $table) {
            // Nombre de tabla en singular 'guide_user' por convención
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('guide_id')->constrained()->onDelete('cascade');

            // --- Nuestros estados ---
            $table->boolean('is_favorite')->default(false);
            $table->enum('progress_status', ['todo', 'completed'])->nullable();
            // ------------------------

            $table->timestamps(); // Útil para saber cuándo lo añadió

            // Un usuario solo puede tener una entrada por guía
            $table->unique(['user_id', 'guide_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guide_users');
    }
};
