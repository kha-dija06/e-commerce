<?php

namespace App\Models;
use App\Models\User;
use App\Models\LigneCommande;
use App\Models\Paiement;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $table = 'commandes';

    protected $fillable = [
        'utilisateur_id',
        'adresse',
        'total',
        'statut',
        'methode_paiement',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function lignes()
    {
        return $this->hasMany(LigneCommande::class, 'commande_id');
    }

    public function paiement()
    {
        return $this->hasOne(Paiement::class, 'commande_id');
    }
}
