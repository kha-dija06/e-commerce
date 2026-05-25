<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register - Inscription
    public function register(Request $request)
    {
        // Validation
        $request->validate([
            'nom' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'mot_de_passe' => 'required|string|min:6',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'required|string|max:100',

        ]);

        // Création utilisateur
        $user = User::create([
            'name' => $request->nom,
            'email' => $request->email,
            'password' => Hash::make($request->mot_de_passe),
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
            'ville' => $request->ville,
            'role' => 'utilisateur',
            'statut' => 'actif'
        ]);

        // Création token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Réponse
        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->name,
                    'email' => $user->email,
                    'telephone' => $user->telephone,
                    'adresse' => $user->adresse,
                    'ville' => $user->ville,
                    'role' => $user->role,
                    'statut' => $user->statut
                ],
                'token' => $token
            ]
        ], 201);
    }

    // Login - Connexion
    public function login(Request $request)
    {
        // Validation
        $request->validate([
            'email' => 'required|email',
            'mot_de_passe' => 'required|string'
        ]);

        // Chercher l'utilisateur
        $user = User::where('email', $request->email)->first();

        // Vérifier mot de passe
        if (!$user || !Hash::check($request->mot_de_passe, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        // Vérifier si compte actif
        if ($user->statut !== 'actif') {
            return response()->json([
                'success' => false,
                'message' => 'Votre compte est désactivé'
            ], 403);
        }

        // Création token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Réponse
        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->name,
                    'email' => $user->email,
                    'telephone' => $user->telephone,
                    'adresse' => $user->adresse,
                    'ville' => $user->ville,
                    'role' => $user->role,
                    'statut' => $user->statut
                ],
                'token' => $token
            ]
        ]);
    }

    // Logout - Déconnexion
    public function logout(Request $request)
    {
        // Supprimer le token actuel
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    // Get Profile - Voir profil
    public function profile(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'nom' => $user->name,
                'email' => $user->email,
                'telephone' => $user->telephone,
                'adresse' => $user->adresse,
                'ville' => $user->ville,
                'role' => $user->role,
                'statut' => $user->statut,
                'date_creation' => $user->created_at
            ]
        ]);
    }

    // Update Profile - Modifier profil
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Validation
        $request->validate([
            'nom' => 'sometimes|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'required|string|max:100',
        ]);

        // Mise à jour
        if ($request->has('nom')) {
            $user->name = $request->nom;
        }
        if ($request->has('telephone')) {
            $user->telephone = $request->telephone;
        }
        if ($request->has('adresse')) {
            $user->adresse = $request->adresse;
        }
         if ($request->has('ville')) {
            $user->ville = $request->ville;
        }
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data' => [
                'id' => $user->id,
                'nom' => $user->name,
                'email' => $user->email,
                'telephone' => $user->telephone,
                'adresse' => $user->adresse,
                'ville' => $user->ville,
                'role' => $user->role,
                'statut' => $user->statut
            ]
        ]);
    }

    // Change Password - Changer mot de passe
    public function changePassword(Request $request)
    {
        $user = $request->user();

        // Validation
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed'
        ]);

        // Vérifier mot de passe actuel
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe actuel incorrect'
            ], 401);
        }

        // Changer mot de passe
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }
}