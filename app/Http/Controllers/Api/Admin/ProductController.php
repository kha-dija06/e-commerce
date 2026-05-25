<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // GET /api/admin/products
    public function index(Request $request)
    {
        $query = Produit::with('categorie');

        if ($request->search) {
            $query->where('nom', 'like', '%' . $request->search . '%');
        }

        if ($request->categorie_id) {
            $query->where('categorie_id', $request->categorie_id);
        }

        if ($request->statut && in_array($request->statut, ['disponible', 'rupture_stock', 'abandonne'])) {
            $query->where('statut', $request->statut);
        }

        $products = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $products
        ]);
    }

    // GET /api/admin/categories — pour le select
    public function categories()
    {
        $categories = Categorie::orderBy('nom')->get();
        return response()->json(['success' => true, 'data' => $categories]);
    }

    // POST /api/admin/products
    public function store(Request $request)
    {
        $request->validate([
            'nom'          => 'required|string|max:200',
            'prix'         => 'required|numeric|min:0',
            'stock'        => 'required|integer|min:0',
            'description'  => 'nullable|string',
            'categorie_id' => 'nullable|exists:categories,id',
            'statut'       => 'required|in:disponible,rupture_stock,abandonne',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('produits', 'public');
        }

        // Auto statut selon stock
        $statut = $request->statut;
        if ($request->stock == 0) {
            $statut = 'rupture_stock';
        }

        $product = Produit::create([
            'nom'          => $request->nom,
            'prix'         => $request->prix,
            'stock'        => $request->stock,
            'description'  => $request->description,
            'image'        => $imagePath,
            'statut'       => $statut,
            'categorie_id' => $request->categorie_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès',
            'data'    => $product->load('categorie')
        ], 201);
    }

    // PUT /api/admin/products/{id}
    public function update(Request $request, $id)
    {
        $product = Produit::findOrFail($id);

        $request->validate([
            'nom'          => 'sometimes|string|max:200',
            'prix'         => 'sometimes|numeric|min:0',
            'stock'        => 'sometimes|integer|min:0',
            'description'  => 'nullable|string',
            'categorie_id' => 'nullable|exists:categories,id',
            'statut'       => 'sometimes|in:disponible,rupture_stock,abandonne',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = $product->image;
        if ($request->hasFile('image')) {
            // Supprimer ancienne image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image')->store('produits', 'public');
        }

        $statut = $request->statut ?? $product->statut;
        if ($request->has('stock') && $request->stock == 0) {
            $statut = 'rupture_stock';
        }

        $product->update([
            'nom'          => $request->nom ?? $product->nom,
            'prix'         => $request->prix ?? $product->prix,
            'stock'        => $request->stock ?? $product->stock,
            'description'  => $request->description ?? $product->description,
            'image'        => $imagePath,
            'statut'       => $statut,
            'categorie_id' => $request->categorie_id ?? $product->categorie_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour',
            'data'    => $product->load('categorie')
        ]);
    }

    // DELETE /api/admin/products/{id}
    public function destroy($id)
    {
        $product = Produit::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé'
        ]);
    }
}
