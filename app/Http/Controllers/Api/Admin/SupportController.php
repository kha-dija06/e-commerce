<?php
// ─── app/Http/Controllers/Api/Admin/SupportController.php ────────────────────
namespace App\Http\Controllers\Api\Admin;
 
use App\Http\Controllers\Controller;
use App\Models\ReponseSupport;
use App\Models\TicketSupport;
use App\Notifications\SupportReponseNotification;
use Illuminate\Http\Request;
 
class SupportController extends Controller
{
    // GET /api/admin/support
    public function index(Request $request)
    {
        $query = TicketSupport::with(['utilisateur', 'reponses']);
 
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('sujet', 'like', '%' . $request->search . '%')
                  ->orWhereHas('utilisateur', function ($sub) use ($request) {
                      $sub->where('name',  'like', '%' . $request->search . '%')
                          ->orWhere('email', 'like', '%' . $request->search . '%');
                  });
            });
        }
 
        if ($request->statut && in_array($request->statut, ['ouvert', 'en_cours', 'en_attente', 'resolu', 'ferme'])) {
            $query->where('statut', $request->statut);
        }
 
        $tickets = $query->latest()->paginate(15);
 
        return response()->json([
            'success' => true,
            'data'    => $tickets,
        ]);
    }
 
    // GET /api/admin/support/stats
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'ouvert'     => TicketSupport::where('statut', 'ouvert')->count(),
                'en_attente' => TicketSupport::whereIn('statut', ['en_cours', 'en_attente'])->count(),
                'resolu'     => TicketSupport::whereIn('statut', ['resolu', 'ferme'])
                                    ->whereDate('updated_at', '>=', now()->subDay())
                                    ->count(),
            ],
        ]);
    }
 
    // GET /api/admin/support/{id}
    public function show($id)
    {
        $ticket = TicketSupport::with([
            'utilisateur',
            'commande',
            'reponses.utilisateur',
        ])->findOrFail($id);
 
        return response()->json([
            'success' => true,
            'data'    => $ticket,
        ]);
    }
 
    // PATCH /api/admin/support/{id}/statut
    public function updateStatut(Request $request, $id)
    {
        $ticket = TicketSupport::findOrFail($id);
 
        $request->validate([
            'statut' => 'required|in:ouvert,en_cours,en_attente,resolu,ferme',
        ]);
 
        $ticket->update(['statut' => $request->statut]);
 
        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour',
            'data'    => $ticket,
        ]);
    }
 
    // POST /api/admin/support/{id}/reponses
    public function repondre(Request $request, $id)
    {
        $ticket = TicketSupport::with('utilisateur')->findOrFail($id);
 
        $request->validate([
            'message' => 'required|string',
        ]);
 
        $reponse = ReponseSupport::create([
            'ticket_id'      => $ticket->id,
            'utilisateur_id' => $request->user()->id,
            'message'        => $request->message,
        ]);
 
        // ✅ Statut auto → en_cours ila kan ouvert
        if ($ticket->statut === 'ouvert') {
            $ticket->update(['statut' => 'en_cours']);
        }
 
        // ✅ Notification au user — nouvelle réponse admin
        if ($ticket->utilisateur) {
            $ticket->utilisateur->notify(
                new SupportReponseNotification($ticket)
            );
        }
 
        return response()->json([
            'success' => true,
            'message' => 'Réponse envoyée',
            'data'    => $reponse->load('utilisateur'),
        ], 201);
    }
 
    // DELETE /api/admin/support/{id}
    public function destroy($id)
    {
        TicketSupport::findOrFail($id)->delete();
 
        return response()->json([
            'success' => true,
            'message' => 'Ticket supprimé',
        ]);
    }
}
 

// namespace App\Http\Controllers\Api\Admin;

// use App\Http\Controllers\Controller;
// use App\Models\TicketSupport;
// use App\Models\ReponseSupport;
// use Illuminate\Http\Request;

// class SupportController extends Controller
// {
//     // GET /api/admin/support
//     public function index(Request $request)
//     {
//         $query = TicketSupport::with(['utilisateur', 'reponses']);

//         if ($request->search) {
//             $query->whereHas('utilisateur', function($q) use ($request) {
//                 $q->where('name', 'like', '%' . $request->search . '%')
//                   ->orWhere('email', 'like', '%' . $request->search . '%');
//             })->orWhere('sujet', 'like', '%' . $request->search . '%');
//         }

//         if ($request->statut && in_array($request->statut, ['ouvert', 'en_cours', 'en_attente', 'resolu', 'ferme'])) {
//             $query->where('statut', $request->statut);
//         }

//         $tickets = $query->latest()->paginate(15);

//         return response()->json([
//             'success' => true,
//             'data'    => $tickets
//         ]);
//     }

//     // GET /api/admin/support/stats
//     public function stats()
//     {
//         return response()->json([
//             'success' => true,
//             'data'    => [
//                 'ouvert'     => TicketSupport::where('statut', 'ouvert')->count(),
//                 'en_attente' => TicketSupport::whereIn('statut', ['en_cours', 'en_attente'])->count(),
//                 'resolu'     => TicketSupport::whereIn('statut', ['resolu', 'ferme'])
//                                 ->whereDate('updated_at', '>=', now()->subDay())
//                                 ->count(),
//             ]
//         ]);
//     }

//     // GET /api/admin/support/{id}
//     public function show($id)
//     {
//         $ticket = TicketSupport::with([
//             'utilisateur',
//             'commande',
//             'reponses.utilisateur'
//         ])->findOrFail($id);

//         return response()->json([
//             'success' => true,
//             'data'    => $ticket
//         ]);
//     }

//     // PATCH /api/admin/support/{id}/statut
//     public function updateStatut(Request $request, $id)
//     {
//         $ticket = TicketSupport::findOrFail($id);

//         $request->validate([
//             'statut' => 'required|in:ouvert,en_cours,en_attente,resolu,ferme'
//         ]);

//         $ticket->update(['statut' => $request->statut]);

//         return response()->json([
//             'success' => true,
//             'message' => 'Statut mis à jour',
//             'data'    => $ticket
//         ]);
//     }

//     // POST /api/admin/support/{id}/reponses
//     public function repondre(Request $request, $id)
//     {
//         $ticket = TicketSupport::findOrFail($id);

//         $request->validate([
//             'message' => 'required|string'
//         ]);

//         $reponse = ReponseSupport::create([
//             'ticket_id'      => $ticket->id,
//             'utilisateur_id' => $request->user()->id,
//             'message'        => $request->message,
//         ]);

//         // Auto — statut en_cours ila kan ouvert
//         if ($ticket->statut === 'ouvert') {
//             $ticket->update(['statut' => 'en_cours']);
//         }

//         return response()->json([
//             'success' => true,
//             'message' => 'Réponse envoyée',
//             'data'    => $reponse->load('utilisateur')
//         ], 201);
//     }

//     // DELETE /api/admin/support/{id}
//     public function destroy($id)
//     {
//         $ticket = TicketSupport::findOrFail($id);
//         $ticket->delete();

//         return response()->json([
//             'success' => true,
//             'message' => 'Ticket supprimé'
//         ]);
//     }
// }
