<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory; // <-- ¡ESTA ES LA LÍNEA QUE FALTABA!

class GuideSection extends Model
{
    use HasFactory; // Ahora PHP sabe qué es esto

    protected $fillable = [
        'guide_id',
        'order',
        'type',
        'content',
        'image_path',
    ];

    // NUEVA RELACIÓN: Una sección pertenece a una guía
    public function guide(): BelongsTo
    {
        return $this->belongsTo(Guide::class);
    }
}