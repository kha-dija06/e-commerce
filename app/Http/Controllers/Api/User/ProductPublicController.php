<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Http\Request;

class ProductPublicController extends Controller
{
    // GET /api/produits - visiteur + user
    public function index(Request $request)
    {
        $query = Produit::with('categorie')
            ->whereIn('statut', ['disponible', 'rupture_stock']); // ✅ exclut seulement abandonne

        if ($request->filled('search')) {
            $query->where('nom', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('categorie_id')) {
            $query->where('categorie_id', $request->categorie_id);
        }

        $query->orderBy('created_at', 'desc');
        $produits = $query->paginate($request->get('per_page', 8));

        return response()->json([
            'success' => true,
            'data'    => $produits->getCollection()->map(fn($p) => $this->transform($p)),
            'pagination' => [
                'current_page' => $produits->currentPage(),
                'last_page'    => $produits->lastPage(),
                'total'        => $produits->total(),
            ],
        ]);
    }

    // GET /api/produits/vedettes - home page visiteur
    public function vedettes()
    {
        $produits = Produit::with('categorie')
            ->whereIn('statut', ['disponible', 'rupture_stock']) // ✅
            ->where('stock', '>', 0)
            ->latest()
            ->take(8)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $produits->map(fn($p) => $this->transform($p)),
        ]);
    }

    // GET /api/categories - public
    public function categories()
    {
        $categories = Categorie::orderBy('nom')->get();
        return response()->json(['success' => true, 'data' => $categories]);
    }

    // GET /api/produits/{id}
    public function show($id)
    {
        $produit = Produit::with('categorie')
            ->whereIn('statut', ['disponible', 'rupture_stock']) // ✅
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $this->transform($produit),
        ]);
    }

    private function transform(Produit $p): array
    {
        $imageUrl = null;
        if ($p->image) {
            if (str_starts_with($p->image, 'http')) {
                $imageUrl = $p->image;
            } else {
                $imageUrl = env('APP_URL') . '/storage/' . $p->image;
            }
        }

        return [
            'id'          => $p->id,
            'nom'         => $p->nom,
            'prix'        => (float) $p->prix,
            'stock'       => $p->stock,
            'description' => $p->description,
            'image'       => $imageUrl,
            'statut'      => $p->statut,
            'categorie'   => $p->categorie ? [
                'id'  => $p->categorie->id,
                'nom' => $p->categorie->nom,
            ] : null,
        ];
    }
}