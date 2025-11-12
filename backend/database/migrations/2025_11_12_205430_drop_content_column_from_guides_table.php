<?php
// backend/database/migrations/...drop_content_column_from_guides_table.php

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
        // En 'up', le decimos que BORRE la columna 'content'
        Schema::table('guides', function (Blueprint $table) {
            $table->dropColumn('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // En 'down', la volvemos a crear por si hacemos 'rollback'
        Schema::table('guides', function (Blueprint $table) {
            $table->text('content')->nullable();
        });
    }
};