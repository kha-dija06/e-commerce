<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Paiement;
use App\Models\Panier;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    // GET /orders
    public function index()
    {
        $commandes = Commande::with('lignes.produit')
            ->where('utilisateur_id', Auth::id())
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($c) {
                return [
                    'id'               => $c->id,
                    'statut'           => $c->statut,
                    'total'            => (float) $c->total,
                    'methode_paiement' => $c->methode_paiement,
                    'adresse'          => $c->adresse,
                    'date'             => $c->created_at,
                    'lignes'           => $c->lignes->map(fn($l) => [
                        'nom'      => $l->produit?->nom,
                        'image'    => $l->produit?->image ? asset('storage/' . $l->produit->image) : null,
                        'quantite' => $l->quantite,
                        'prix'     => (float) $l->prix,
                    ]),
                ];
            });

        return response()->json(['success' => true, 'data' => $commandes]);
    }

    // POST /orders
    public function store(Request $request)
    {
        $request->validate([
            'adresse'          => 'required|string|max:500',
            'methode_paiement' => 'required|in:paiement_livraison,carte,virement_bancaire,paypal',
            'telephone'        => 'required|string|max:20',
            'nom'              => 'required|string|max:100',
        ]);

        $user    = Auth::user();
        $paniers = Panier::with('produit')
            ->where('utilisateur_id', $user->id)
            ->get();

        if ($paniers->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Panier vide'
            ], 422);
        }

        // Vérifier stock
        foreach ($paniers as $panier) {
            if (!$panier->produit || $panier->produit->stock < $panier->quantite) {
                return response()->json([
                    'success' => false,
                    'message' => "Stock insuffisant pour: {$panier->produit?->nom}"
                ], 422);
            }
        }

        DB::beginTransaction();
        try {
            $total = $paniers->sum(fn($p) => $p->produit->prix * $p->quantite);

            $commande = Commande::create([
                'utilisateur_id'   => $user->id,
                'adresse'          => $request->adresse . ' | Tel: ' . $request->telephone . ' | Nom: ' . $request->nom,
                'total'            => $total,
                'statut'           => 'en_attente',
                'methode_paiement' => $request->methode_paiement,
            ]);

            foreach ($paniers as $panier) {
                LigneCommande::create([
                    'commande_id' => $commande->id,
                    'produit_id'  => $panier->produit_id,
                    'quantite'    => $panier->quantite,
                    'prix'        => $panier->produit->prix,
                ]);
                // Déduire stock
                $panier->produit->decrement('stock', $panier->quantite);
            }

            Paiement::create([
                'commande_id'      => $commande->id,
                'methode_paiement' => $request->methode_paiement,
                'montant'          => $total,
                'statut'           => $request->methode_paiement === 'paiement_livraison' ? 'en_attente' : 'en_attente',
            ]);

            // Vider panier
            Panier::where('utilisateur_id', $user->id)->delete();

            DB::commit();

            return response()->json([
                'success'    => true,
                'message'    => 'Commande créée avec succès',
                'commande_id' => $commande->id,
                'total'      => (float) $total,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
// PUT /orders/{id}/cancel
public function cancel($id)
{
    $commande = Commande::where('utilisateur_id', Auth::id())
        ->whereIn('statut', ['en_attente', 'en_traitement'])
        ->findOrFail($id);

    $commande->update(['statut' => 'annulee']);

    return response()->json([
        'success' => true,
        'message' => 'Commande annulée avec succès'
    ]);
}
    // GET /orders/{id}
    public function show($id)
    {
        $commande = Commande::with('lignes.produit', 'paiement')
            ->where('utilisateur_id', Auth::id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'               => $commande->id,
                'statut'           => $commande->statut,
                'total'            => (float) $commande->total,
                'methode_paiement' => $commande->methode_paiement,
                'adresse'          => $commande->adresse,
                'date'             => $commande->created_at,
                'lignes'           => $commande->lignes->map(fn($l) => [
                    'nom'      => $l->produit?->nom,
                    'image'    => $l->produit?->image ? asset('storage/' . $l->produit->image) : null,
                    'quantite' => $l->quantite,
                    'prix'     => (float) $l->prix,
                ]),
            ]
        ]);
    }
}
