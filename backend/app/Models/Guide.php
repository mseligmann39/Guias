<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guide extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'user_id',
        'title',
        'slug',
        'content',
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function getAverageRatingAttribute()
    {
        return round($this->ratings()->avg('rating'), 1);
    }

    public function getRatingCountAttribute()
    {
        return $this->ratings()->count();
    }
public function users()
{
    return $this->belongsToMany(User::class)
                ->withPivot('is_favorite', 'progress_status') // ¡Importante!
                ->withTimestamps();
}

public function sections(): HasMany
    {
        return $this->hasMany(GuideSection::class)->orderBy('order', 'asc');
    }
}