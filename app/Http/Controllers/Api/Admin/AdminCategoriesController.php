<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminCategoriesController extends Controller
{
    // GET /api/admin/categories
    public function index(Request $request)
    {
        $query = Categorie::withCount('produits');

        if ($request->filled('search')) {
            $query->where('nom', 'like', '%' . $request->search . '%');
        }

        $categories = $query->orderBy('nom')->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $categories,
        ]);
    }

    // POST /api/admin/categories
    public function store(Request $request)
    {
        $request->validate([
            'nom'   => 'required|string|max:200|unique:categories,nom',
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
            $imagePath = basename($imagePath);
        }

        $categorie = Categorie::create([
            'nom'   => $request->nom,
            'image' => $imagePath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Catégorie créée avec succès',
            'data'    => $categorie->loadCount('produits'),
        ], 201);
    }

    // PUT /api/admin/categories/{id}
    public function update(Request $request, $id)
    {
        $categorie = Categorie::findOrFail($id);

        $request->validate([
            'nom'   => 'required|string|max:200|unique:categories,nom,' . $id,
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Supp ancienne image
            if ($categorie->image) {
                Storage::disk('public')->delete('categories/' . $categorie->image);
            }
            $imagePath = $request->file('image')->store('categories', 'public');
            $categorie->image = basename($imagePath);
        }

        $categorie->nom = $request->nom;
        $categorie->save();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie mise à jour',
            'data'    => $categorie->loadCount('produits'),
        ]);
    }

    // DELETE /api/admin/categories/{id}
    public function destroy($id)
    {
        $categorie = Categorie::withCount('produits')->findOrFail($id);

        if ($categorie->produits_count > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une catégorie qui contient des produits.',
            ], 422);
        }

        if ($categorie->image) {
            Storage::disk('public')->delete('categories/' . $categorie->image);
        }

        $categorie->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée',
        ]);
    }
}