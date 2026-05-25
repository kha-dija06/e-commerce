<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'paiements';

    protected $fillable = [
        'commande_id',
        'methode_paiement',
        'identifiant_paiement',
        'montant',
        'statut',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class, 'commande_id');
    }
}
