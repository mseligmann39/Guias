<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class GuideUser extends Pivot
{
    use HasFactory;

    // Especificamos la tabla si el nombre no sigue la convención exacta
    protected $table = 'guide_user';

    // Permitimos asignación masiva
    protected $fillable = [
        'user_id',
        'guide_id',
        'is_favorite',
        'progress_status'
    ];
}