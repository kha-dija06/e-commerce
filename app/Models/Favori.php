<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favori extends Model
{
    use HasFactory;

    protected $table = 'favoris';

    protected $fillable = [
        'utilisateur_id',
        'produit_id',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
}
