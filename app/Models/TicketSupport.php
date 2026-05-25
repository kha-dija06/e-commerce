<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketSupport extends Model
{
    use HasFactory;

    protected $table = 'tickets_support';

    protected $fillable = [
        'utilisateur_id',
        'commande_id',
        'sujet',
        'message',
        'statut',
        'priorite',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function commande()
    {
        return $this->belongsTo(Commande::class, 'commande_id');
    }

    public function reponses()
    {
        return $this->hasMany(ReponseSupport::class, 'ticket_id');
    }
}
