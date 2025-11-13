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
        Schema::create('guide_sections', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('guide_id')
                  ->constrained()
                  ->onDelete('cascade'); // Si se borra la guía, se borran sus secciones

            $table->unsignedInteger('order');
            $table->string('type')->default('text'); // 'text', 'image', 'video'
            $table->text('content')->nullable(); // Para el texto o la URL del video
            $table->string('image_path')->nullable(); // Para la imagen

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guide_sections');
    }
};