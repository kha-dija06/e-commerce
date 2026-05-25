<?php


namespace App\Models;

use Illuminate\Notifications\DatabaseNotification;

/**
 * On étend DatabaseNotification (le model Laravel built-in)
 * au lieu de créer un model custom incompatible.
 * 
 * DatabaseNotification gère déjà:
 *   - $n->data['type'], $n->data['text'] (cast JSON automatique)
 *   - $n->read_at, $n->markAsRead()
 *   - la relation morphs vers User (Notifiable)
 */
class Notification extends DatabaseNotification
{
    // ✅ Helper — wach notification mqriya
    public function isRead(): bool
    {
        return $this->read_at !== null;
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Notification extends Model
// {
//     protected $table = 'notifications';

//     protected $fillable = [
//         'utilisateur_id',
//         'type',
//         'reference',
//         'text',
//         'read_at',
//     ];

//     protected $casts = [
//         'read_at' => 'datetime',
//     ];

//     public function utilisateur()
//     {
//         return $this->belongsTo(User::class, 'utilisateur_id');
//     }

//     // ✅ Helper — wach notification mqriya
//     public function isRead(): bool
//     {
//         return $this->read_at !== null;
//     }
// }