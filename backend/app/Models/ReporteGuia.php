<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReporteGuia extends Model
{
    use HasFactory;

    protected $table = 'reportes_guias';

    protected $fillable = [
        'guide_id',
        'usuario_id',
        'razon',
        'detalle_opcional',
        'estado',
    ];

    /**
     * Relación al modelo Guide (guía reportada)
     */
    public function guia(): BelongsTo
    {
        return $this->belongsTo(Guide::class, 'guide_id');
    }

    /**
     * Usuario que realizó el reporte (opcional)
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
