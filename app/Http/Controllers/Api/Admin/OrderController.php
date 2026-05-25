<?php

// ─── app/Http/Controllers/Api/Admin/OrderController.php ──────────────────────
namespace App\Http\Controllers\Api\Admin;
 
use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Notifications\CommandeStatutNotification;
use Illuminate\Http\Request;
 
class OrderController extends Controller
{
    // GET /api/admin/orders
    public function index(Request $request)
    {
        $query = Commande::with(['utilisateur', 'lignes.produit']);
 
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('utilisateur', function ($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
 
        if ($request->filled('status')) {
            $dbStatut = $this->toDbStatus($request->status);
            if ($dbStatut) {
                $query->where('statut', $dbStatut);
            }
        }
 
        $query->orderBy('created_at', 'desc');
        $orders = $query->paginate($request->get('per_page', 10));
 
        $transformed = $orders->getCollection()->map(function ($order) {
            return $this->transformOrder($order);
        });
 
        return response()->json([
            'success'    => true,
            'data'       => $transformed,
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }
 
    // GET /api/admin/orders/{id}
    public function show($id)
    {
        $order = Commande::with(['utilisateur', 'lignes.produit'])
            ->findOrFail($id);
 
        return response()->json([
            'success' => true,
            'data'    => $this->transformOrder($order, true),
        ]);
    }
 
    // PUT /api/admin/orders/{id}/status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,en_attente,en_traitement,expediee,livree,annulee',
        ]);
 
        $dbStatut = $this->toDbStatus($request->status);
 
        if (!$dbStatut) {
            return response()->json([
                'success' => false,
                'message' => 'Statut invalide.',
            ], 422);
        }
 
        $order = Commande::with('utilisateur')->findOrFail($id);
 
        // ✅ Notify uniquement si statut a changé
        $statutChanged = $order->statut !== $dbStatut;
 
        $order->update(['statut' => $dbStatut]);
 
        // ✅ Envoyer notification au user si statut a changé
        if ($statutChanged && $order->utilisateur) {
            $order->utilisateur->notify(
                new CommandeStatutNotification($order->fresh())
            );
        }
 
        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour',
            'data'    => $this->transformOrder($order->fresh(['utilisateur', 'lignes.produit'])),
        ]);
    }
 
    // GET /api/admin/orders/export/csv
    public function export(Request $request)
    {
        $query = Commande::with(['utilisateur', 'lignes.produit']);
 
        if ($request->filled('status')) {
            $dbStatut = $this->toDbStatus($request->status);
            if ($dbStatut) {
                $query->where('statut', $dbStatut);
            }
        }
 
        $orders   = $query->latest()->get();
        $filename = 'commandes_' . date('Y-m-d_His') . '.csv';
 
        $handle = fopen('php://temp', 'w+');
        fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));
 
        fputcsv($handle, ['ID', 'Client', 'Email', 'Adresse', 'Date', 'Total (DH)', 'Statut', 'Paiement', 'Nb Produits']);
 
        foreach ($orders as $order) {
            fputcsv($handle, [
                $order->id,
                $order->utilisateur?->name ?? 'Client inconnu',
                $order->utilisateur?->email ?? '',
                $order->adresse,
                $order->created_at->format('d/m/Y H:i'),
                number_format((float) $order->total, 2),
                $order->statut,
                $order->methode_paiement,
                $order->lignes->sum('quantite'),
            ]);
        }
 
        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);
 
        return response($csvContent, 200)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
 
    // ─── Helpers ─────────────────────────────────────────────────────────────
 
    private function toDbStatus(string $status): ?string
    {
        $map = [
            'pending'       => 'en_attente',
            'processing'    => 'en_traitement',
            'shipped'       => 'expediee',
            'delivered'     => 'livree',
            'cancelled'     => 'annulee',
            'en_attente'    => 'en_attente',
            'en_traitement' => 'en_traitement',
            'expediee'      => 'expediee',
            'livree'        => 'livree',
            'annulee'       => 'annulee',
        ];
        return $map[$status] ?? null;
    }
 
    private function toFrontendStatus(string $status): string
    {
        $map = [
            'en_attente'    => 'pending',
            'en_traitement' => 'processing',
            'expediee'      => 'shipped',
            'livree'        => 'delivered',
            'annulee'       => 'cancelled',
        ];
        return $map[$status] ?? 'pending';
    }
 
    private function transformOrder(Commande $order, bool $withItems = false): array
    {
        $data = [
            'id'               => $order->id,
            'customer'         => $order->utilisateur?->name ?? 'Client inconnu',
            'email'            => $order->utilisateur?->email ?? '',
            'address'          => $order->adresse,
            'date'             => $order->created_at->format('d/m/Y'),
            'total'            => (float) $order->total,
            'status'           => $this->toFrontendStatus($order->statut),
            'methode_paiement' => $order->methode_paiement,
            'items_count'      => $order->lignes ? $order->lignes->sum('quantite') : 0,
        ];
 
        if ($withItems) {
            $data['items'] = $order->lignes
                ? $order->lignes->map(fn($ligne) => [
                    'name'     => $ligne->produit?->nom ?? 'Produit inconnu',
                    'quantity' => $ligne->quantite,
                    'price'    => (float) $ligne->prix,
                ])
                : [];
        }
 
        return $data;
    }
}

// namespace App\Http\Controllers\Api\Admin;

// use App\Http\Controllers\Controller;
// use App\Models\Commande;
// use Illuminate\Http\Request;
// use App\Notifications\CommandeStatutNotification;

// class OrderController extends Controller
// {
//     // GET /api/admin/orders
//     public function index(Request $request)
//     {
//         $query = Commande::with(['utilisateur', 'lignes.produit']);

//         if ($request->filled('search')) {
//             $search = $request->search;
//             $query->where(function ($q) use ($search) {
//                 $q->where('id', 'like', "%{$search}%")
//                   ->orWhereHas('utilisateur', function ($sub) use ($search) {
//                       $sub->where('name', 'like', "%{$search}%")
//                           ->orWhere('email', 'like', "%{$search}%");
//                   });
//             });
//         }

//         if ($request->filled('status')) {
//             $dbStatut = $this->toDbStatus($request->status);
//             if ($dbStatut) {
//                 $query->where('statut', $dbStatut);
//             }
//         }

//         $query->orderBy('created_at', 'desc');
//         $orders = $query->paginate($request->get('per_page', 10));

//         $transformed = $orders->getCollection()->map(function ($order) {
//             return $this->transformOrder($order);
//         });

//         return response()->json([
//             'success'    => true,
//             'data'       => $transformed,
//             'pagination' => [
//                 'current_page' => $orders->currentPage(),
//                 'last_page'    => $orders->lastPage(),
//                 'per_page'     => $orders->perPage(),
//                 'total'        => $orders->total(),
//             ],
//         ]);
//     }

//     // GET /api/admin/orders/{id}
//     public function show($id)
//     {
//         $order = Commande::with(['utilisateur', 'lignes.produit'])
//             ->findOrFail($id);

//         return response()->json([
//             'success' => true,
//             'data'    => $this->transformOrder($order, true),
//         ]);
//     }

//     // PUT /api/admin/orders/{id}/status
//     public function updateStatus(Request $request, $id)
//     {
//         $request->validate([
//             'status' => 'required|in:pending,processing,shipped,delivered,cancelled,en_attente,en_traitement,expediee,livree,annulee',
//         ]);

//         $dbStatut = $this->toDbStatus($request->status);

//         if (!$dbStatut) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Statut invalide.',
//             ], 422);
//         }

//         $order = Commande::findOrFail($id);
//         $order->update(['statut' => $dbStatut]);

//         return response()->json([
//             'success' => true,
//             'message' => 'Statut mis à jour',
//             'data'    => $this->transformOrder($order->fresh(['utilisateur', 'lignes.produit'])),
//         ]);
//     }

//     // GET /api/admin/orders/export/csv
//     public function export(Request $request)
//     {
//         $query = Commande::with(['utilisateur', 'lignes.produit']);

//         if ($request->filled('status')) {
//             $dbStatut = $this->toDbStatus($request->status);
//             if ($dbStatut) {
//                 $query->where('statut', $dbStatut);
//             }
//         }

//         $orders   = $query->latest()->get();
//         $filename = 'commandes_' . date('Y-m-d_His') . '.csv';

//         $handle = fopen('php://temp', 'w+');

//         // UTF-8 BOM for Excel
//         fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

//         fputcsv($handle, [
//             'ID',
//             'Client',
//             'Email',
//             'Adresse',
//             'Date',
//             'Total (DH)',
//             'Statut',
//             'Paiement',
//             'Nb Produits',
//         ]);

//         foreach ($orders as $order) {
//             fputcsv($handle, [
//                 $order->id,
//                 $order->utilisateur?->name ?? 'Client inconnu',
//                 $order->utilisateur?->email ?? '',
//                 $order->adresse,
//                 $order->created_at->format('d/m/Y H:i'),
//                 number_format((float) $order->total, 2),
//                 $order->statut,
//                 $order->methode_paiement,
//                 $order->lignes->sum('quantite'),
//             ]);
//         }

//         rewind($handle);
//         $csvContent = stream_get_contents($handle);
//         fclose($handle);

//         return response($csvContent, 200)
//             ->header('Content-Type', 'text/csv; charset=UTF-8')
//             ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
//     }

//     // ─── Private Helpers ────────────────────────────────────────────────────────

//     /**
//      * Convert frontend or DB status string → DB status string.
//      * Accepts both English (frontend) and French (DB) values.
//      */
//     private function toDbStatus(string $status): ?string
//     {
//         $map = [
//             // Frontend → DB
//             'pending'       => 'en_attente',
//             'processing'    => 'en_traitement',
//             'shipped'       => 'expediee',
//             'delivered'     => 'livree',
//             'cancelled'     => 'annulee',
//             // DB passthrough (in case frontend sends DB value directly)
//             'en_attente'    => 'en_attente',
//             'en_traitement' => 'en_traitement',
//             'expediee'      => 'expediee',
//             'livree'        => 'livree',
//             'annulee'       => 'annulee',
//         ];

//         return $map[$status] ?? null;
//     }

//     /**
//      * Map DB status → frontend English status.
//      */
//     private function toFrontendStatus(string $status): string
//     {
//         $map = [
//             'en_attente'    => 'pending',
//             'en_traitement' => 'processing',
//             'expediee'      => 'shipped',
//             'livree'        => 'delivered',
//             'annulee'       => 'cancelled',
//         ];

//         return $map[$status] ?? 'pending';
//     }

//     /**
//      * Transform a Commande model into a frontend-friendly array.
//      */
//     private function transformOrder(Commande $order, bool $withItems = false): array
//     {
//         $data = [
//             'id'               => $order->id,
//             'customer'         => $order->utilisateur?->name ?? 'Client inconnu',
//             'email'            => $order->utilisateur?->email ?? '',
//             'address'          => $order->adresse,
//             'date'             => $order->created_at->format('d/m/Y'),
//             'total'            => (float) $order->total,
//             'status'           => $this->toFrontendStatus($order->statut),
//             'methode_paiement' => $order->methode_paiement,
//             'items_count'      => $order->lignes
//                                     ? $order->lignes->sum('quantite')
//                                     : 0,
//         ];

//         if ($withItems) {
//             $data['items'] = $order->lignes
//                 ? $order->lignes->map(function ($ligne) {
//                     return [
//                         'name'     => $ligne->produit?->nom ?? 'Produit inconnu',
//                         'quantity' => $ligne->quantite,
//                         'price'    => (float) $ligne->prix,
//                     ];
//                 })
//                 : [];
//         }

//         return $data;
//     }
// }