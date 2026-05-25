<?php

namespace Database\Seeders;

use App\Models\TicketSupport;
use App\Models\ReponseSupport;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSupportSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'administrateur')->first();

        TicketSupport::factory()->count(10)->create()->each(function ($ticket) use ($admin) {
            if ($ticket->statut !== 'ouvert' && $admin) {
                ReponseSupport::create([
                    'ticket_id'      => $ticket->id,
                    'utilisateur_id' => $admin->id,
                    'message'        => 'Merci de votre message. Nous traitons votre demande dans les plus brefs délais.',
                ]);
            }
        });
    }
}


