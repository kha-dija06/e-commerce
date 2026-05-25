<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\TicketSupport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportUserController extends Controller
{
    // GET /support/tickets
    public function index()
    {
        $tickets = TicketSupport::with('reponses.utilisateur')
            ->where('utilisateur_id', Auth::id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($t) => [
                'id'       => $t->id,
                'sujet'    => $t->sujet,
                'message'  => $t->message,
                'statut'   => $t->statut,
                'priorite' => $t->priorite,
                'date'     => $t->created_at,
                'reponses' => $t->reponses->map(fn($r) => [
                    'id'      => $r->id,
                    'message' => $r->message,
                    'auteur'  => $r->utilisateur?->name,
                    'date'    => $r->created_at,
                ]),
            ]);

        return response()->json(['success' => true, 'data' => $tickets]);
    }

    // POST /support/tickets
    public function store(Request $request)
    {
        $request->validate([
            'sujet'   => 'required|string|max:200',
            'message' => 'required|string|max:2000',
        ]);

        $ticket = TicketSupport::create([
            'utilisateur_id' => Auth::id(),
            'sujet'          => $request->sujet,
            'message'        => $request->message,
            'statut'         => 'ouvert',
            'priorite'       => 'moyenne',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ticket créé avec succès',
            'data'    => [
                'id'       => $ticket->id,
                'sujet'    => $ticket->sujet,
                'statut'   => $ticket->statut,
                'date'     => $ticket->created_at,
                'reponses' => [],
            ]
        ], 201);
    }
}
