<?php



namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
 
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
 
    protected $table = 'users';
 
    protected $fillable = [
        'name',
        'email',
        'password',
        'telephone',
        'adresse',
        'ville',
        'role',
        'statut',
    ];
 
    protected $hidden = [
        'password',
        'remember_token',
    ];
 
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'role'              => 'string',
        'statut'            => 'string',
    ];
 
    // ── Helpers ──────────────────────────────────────────────
    public function isAdmin(): bool
    {
        return $this->role === 'administrateur';
    }
 
    public function isActive(): bool
    {
        return $this->statut === 'actif';
    }
    public function commandes()
    {
        return $this->hasMany(Commande::class, 'utilisateur_id');
    }

    public function panier()
    {
        return $this->hasMany(Panier::class, 'utilisateur_id');
    }

    public function favoris()
    {
        return $this->hasMany(Favori::class, 'utilisateur_id');
    }

    public function tickets()
    {
        return $this->hasMany(TicketSupport::class, 'utilisateur_id');
    }

    public function reponses()
    {
        return $this->hasMany(ReponseSupport::class, 'utilisateur_id');
    }
   
}


