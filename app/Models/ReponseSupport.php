<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReponseSupport extends Model
{
    use HasFactory;

    protected $table = 'reponses_support';

    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'utilisateur_id',
        'message',
    ];

    public function ticket()
    {
        return $this->belongsTo(TicketSupport::class, 'ticket_id');
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
