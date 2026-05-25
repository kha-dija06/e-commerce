<?php
// ─── app/Notifications/CommandeStatutNotification.php ────────────────────────
namespace App\Notifications;
 
use App\Models\Commande;
use Illuminate\Notifications\Notification;
 
class CommandeStatutNotification extends Notification
{
    public function __construct(public Commande $commande) {}
 
    public function via(object $notifiable): array
    {
        return ['database']; // ✅ kaykhzen f table notifications
    }
 
    public function toDatabase(object $notifiable): array
    {
        $text = match($this->commande->statut) {
            'en_traitement' => "Votre commande #{$this->commande->id} est en cours de traitement",
            'expediee'      => "Votre commande #{$this->commande->id} a été expédiée 🚚",
            'livree'        => "Votre commande #{$this->commande->id} a été livrée ✅",
            'annulee'       => "Votre commande #{$this->commande->id} a été annulée ❌",
            default         => "Commande #{$this->commande->id} reçue, en attente de traitement",
        };
 
        return [
            'type'       => 'order',
            'text'       => $text,
            'commande_id'=> $this->commande->id,
            'statut'     => $this->commande->statut,
        ];
    }
}