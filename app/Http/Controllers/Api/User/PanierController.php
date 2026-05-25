<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Panier;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PanierController extends Controller
{
    // GET /cart
    public function index()
    {
        $user = Auth::user();
        $paniers = Panier::with('produit.categorie')
            ->where('utilisateur_id', $user->id)
            ->get();

        $items = $paniers->map(function ($panier) {
            $p = $panier->produit;
            return [
                'id'       => $p->id,
                'name'     => $p->nom,
                'price'    => (float) $p->prix,
                'image'    => $p->image ? asset('storage/' . $p->image) : null,
                'category' => $p->categorie?->nom,
                'stock'    => $p->stock,
                'quantity' => $panier->quantite,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $items,
            'total'   => $items->sum(fn($i) => $i['price'] * $i['quantity']),
        ]);
    }

    // POST /cart
    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite'   => 'integer|min:1|max:99',
        ]);

        $user    = Auth::user();
        $produit = Produit::findOrFail($request->produit_id);
        $qty     = $request->quantite ?? 1;

        // Check si produit kayn deja f panier
        $panier = Panier::where('utilisateur_id', $user->id)
            ->where('produit_id', $produit->id)
            ->first();

        if ($panier) {
            // Kayn — zid quantite
            $newQty = $panier->quantite + $qty;
            if ($produit->stock < $newQty) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant'
                ], 422);
            }
            $panier->update(['quantite' => $newQty]);
        } else {
            // Mkaynch — check stock u créer
            if ($produit->stock < $qty) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant'
                ], 422);
            }
            $panier = Panier::create([
                'utilisateur_id' => $user->id,
                'produit_id'     => $produit->id,
                'quantite'       => $qty,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté au panier',
            'data'    => [
                'id'       => $produit->id,
                'name'     => $produit->nom,
                'price'    => (float) $produit->prix,
                'image'    => $produit->image ? asset('storage/' . $produit->image) : null,
                'category' => $produit->categorie?->nom,
                'stock'    => $produit->stock,
                'quantity' => $panier->quantite,
            ]
        ], 201);
    }

    // PUT /cart/{produit_id}
    public function update(Request $request, $produit_id)
    {
        $request->validate(['quantite' => 'required|integer|min:1|max:99']);

        $user    = Auth::user();
        $produit = Produit::findOrFail($produit_id);

        if ($produit->stock < $request->quantite) {
            return response()->json([
                'success' => false,
                'message' => 'Stock insuffisant'
            ], 422);
        }

        $panier = Panier::where('utilisateur_id', $user->id)
            ->where('produit_id', $produit_id)
            ->firstOrFail();

        $panier->update(['quantite' => $request->quantite]);

        return response()->json(['success' => true, 'message' => 'Quantité mise à jour']);
    }

    // DELETE /cart/{produit_id}
    public function destroy($produit_id)
    {
        Panier::where('utilisateur_id', Auth::id())
            ->where('produit_id', $produit_id)
            ->delete();

        return response()->json(['success' => true, 'message' => 'Produit supprimé du panier']);
    }

    // DELETE /cart/clear
    public function clear()
    {
        Panier::where('utilisateur_id', Auth::id())->delete();
        return response()->json(['success' => true, 'message' => 'Panier vidé']);
    }
}