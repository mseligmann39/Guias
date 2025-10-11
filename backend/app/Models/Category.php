<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug'];

    /**
     * The games that belong to the category.
     */
    public function games(): BelongsToMany
    {
        return $this->belongsToMany(Game::class, 'category_game');
    }
}