<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Favori;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriController extends Controller
{
    // Get all favorites for authenticated user
    public function index()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }
            
            $favoris = Favori::with('produit.categorie')
                ->where('utilisateur_id', $user->id)
                ->get();
            
            $products = $favoris->map(function($favori) {
                $p = $favori->produit;
                return [
                    'id' => $p->id,
                    'nom' => $p->nom,
                    'prix' => (float) $p->prix,
                    'stock' => $p->stock,
                    'description' => $p->description,
                    'image' => $p->image ? asset('storage/' . $p->image) : null,
                    'statut' => $p->statut,
                    'categorie' => $p->categorie ? [
                        'id' => $p->categorie->id,
                        'nom' => $p->categorie->nom,
                    ] : null,
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $products,
                'count' => $products->count()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    // Add product to favorites
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }
            
            $request->validate([
                'produit_id' => 'required|exists:produits,id'
            ]);
            
            $exists = Favori::where('utilisateur_id', $user->id)
                ->where('produit_id', $request->produit_id)
                ->exists();
            
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product already in favorites'
                ], 409);
            }
            
            $favori = Favori::create([
                'utilisateur_id' => $user->id,
                'produit_id' => $request->produit_id
            ]);
            
            $produit = Produit::find($request->produit_id);
            
            return response()->json([
                'success' => true,
                'message' => 'Added to favorites',
                'data' => [
                    'id' => $produit->id,
                    'nom' => $produit->nom,
                    'prix' => (float) $produit->prix,
                    'image' => $produit->image ? asset('storage/' . $produit->image) : null,
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    // Remove product from favorites
    public function destroy($produit_id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }
            
            $favori = Favori::where('utilisateur_id', $user->id)
                ->where('produit_id', $produit_id)
                ->first();
            
            if ($favori) {
                $favori->delete();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Removed from favorites'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    // Check if product is favorite
    public function check($produit_id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }
            
            $isFavorite = Favori::where('utilisateur_id', $user->id)
                ->where('produit_id', $produit_id)
                ->exists();
            
            return response()->json([
                'success' => true,
                'is_favorite' => $isFavorite
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}