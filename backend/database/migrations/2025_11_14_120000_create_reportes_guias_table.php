<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reportes_guias', function (Blueprint $table) {
            $table->id();
            // FK to guides table
            $table->foreignId('guide_id')->constrained('guides')->onDelete('cascade');
            // usuario_id is nullable (reports can be anonymous)
            $table->foreignId('usuario_id')->nullable()->constrained('users')->onDelete('set null');

            $table->enum('razon', [
                'contenido_inapropiado',
                'guia_falsa',
                'juego_equivocado',
                'otro',
            ]);

            $table->text('detalle_opcional')->nullable();

            $table->enum('estado', ['pendiente', 'revisado', 'ignorado'])->default('pendiente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes_guias');
    }
};
