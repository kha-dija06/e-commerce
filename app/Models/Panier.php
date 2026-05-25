<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Panier extends Model
{
    use HasFactory;

    protected $table = 'paniers';

    protected $fillable = [
        'utilisateur_id',
        'produit_id',
        'quantite',
    ];

    protected $casts = [
        'quantite' => 'integer',
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
