<?php
// ─── app/Notifications/SupportReponseNotification.php ────────────────────────
namespace App\Notifications;
 
use App\Models\TicketSupport;
use Illuminate\Notifications\Notification;
 
class SupportReponseNotification extends Notification
{
    public function __construct(public TicketSupport $ticket) {}
 
    public function via(object $notifiable): array
    {
        return ['database'];
    }
 
    public function toDatabase(object $notifiable): array
    {
        return [
            'type'      => 'support',
            'text'      => "Nouvelle réponse à votre ticket: \"{$this->ticket->sujet}\"",
            'ticket_id' => $this->ticket->id,
        ];
    }
}
 