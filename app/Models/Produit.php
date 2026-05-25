<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{

    use HasFactory;

    protected $table = 'produits';

    protected $fillable = [
        'nom',
        'prix',
        'stock',
        'description',
        'image',
        'statut',
        'categorie_id',
    ];

    protected $casts = [
        'prix'  => 'decimal:2',
        'stock' => 'integer',
    ];

    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
    }

    public function lignesCommande()
    {
        return $this->hasMany(LigneCommande::class, 'produit_id');
    }

    public function paniers()
    {
        return $this->hasMany(Panier::class, 'produit_id');
    }

    public function favoris()
    {
        return $this->hasMany(Favori::class, 'produit_id');
    }
}
