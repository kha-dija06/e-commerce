<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    use HasFactory;

    protected $table = 'lignes_commande';

    public $timestamps = false;  // ou true selon si vous voulez les timestamps

    protected $fillable = [
        'commande_id',
        'produit_id',
        'quantite',
        'prix',
    ];

    protected $casts = [
        'prix'     => 'decimal:2',
        'quantite' => 'integer',
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class, 'commande_id');
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
}
