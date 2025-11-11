<?php

// database/migrations/xxxx_xx_xx_xxxxxx_drop_achievements_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Primero eliminamos la clave foránea en 'guides' si aún existe
        // (La migración original la creaba en 'achievements', así que esto es más seguro)
        Schema::table('guides', function (Blueprint $table) {
            // Revisamos si la columna existe antes de intentar borrar la FK
            if (Schema::hasColumn('guides', 'achievement_id')) {
                $table->dropForeign(['achievement_id']);
                $table->dropColumn('achievement_id');
            }
        });

        // Ahora borramos la tabla
        Schema::dropIfExists('achievements');
    }

    public function down(): void
    {
        // Lo dejamos vacío. No queremos "re-crear" la tabla en un rollback.
        // O, mejor, la recreamos para que la migración sea reversible.
         Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->foreignId('guide_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description');
            $table->string('icon_url')->nullable();
            $table->timestamps();
        });
    }
};