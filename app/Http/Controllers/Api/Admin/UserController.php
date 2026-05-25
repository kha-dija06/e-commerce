<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // ✅ Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('ville', 'like', '%' . $request->search . '%')
                  ->orWhere('telephone', 'like', '%' . $request->search . '%');
            });
        }

        // ✅ Filtrage par statut uniquement — role supprimé
        if ($request->statut && in_array($request->statut, ['actif', 'inactif', 'banni'])) {
            $query->where('statut', $request->statut);
        }

        // ✅ Afficher uniquement les utilisateurs — pas les admins
        $query->where('role', 'utilisateur');

        $users = $query->withCount('commandes')->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:6',
            'statut'    => 'required|in:actif,inactif,banni',
            'telephone' => 'nullable|string|max:20',
            'ville'     => 'nullable|string|max:70',
            'adresse'   => 'nullable|string',
        ]);

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'utilisateur', // ✅ toujours utilisateur
            'statut'    => $request->statut,
            'telephone' => $request->telephone,
            'ville'     => $request->ville,
            'adresse'   => $request->adresse,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès',
            'data'    => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'      => 'sometimes|string|max:100',
            'email'     => ['sometimes', 'email', Rule::unique('users')->ignore($id)],
            'statut'    => 'sometimes|in:actif,inactif,banni',
            'telephone' => 'nullable|string|max:20',
            'ville'     => 'nullable|string|max:70',
            'adresse'   => 'nullable|string',
        ]);

        $user->update($request->only([
            'name', 'email', 'statut', 'telephone', 'ville', 'adresse'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour',
            'data'    => $user
        ]);
    }

    public function updateStatut(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'statut' => 'required|in:actif,inactif,banni'
        ]);

        $user->update(['statut' => $request->statut]);

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour',
            'data'    => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé'
        ]);
    }
}


//  namespace App\Http\Controllers\Api\Admin;

// use App\Http\Controllers\Controller;
// use App\Models\User;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Validation\Rule;

// class UserController extends Controller
// {
//     // GET /api/admin/users
//     public function index(Request $request)
//     {
       
//         $query = User::query();
//  try {
        
//         // ... baqiya l-code
//         $users = $query->withCount('commandes')->latest()->paginate(15);
//         return response()->json(['success' => true, 'data' => $users]);
//     } catch (\Exception $e) {
//         return response()->json([
//             'error' => $e->getMessage(),
//             'file'  => $e->getFile(),
//             'line'  => $e->getLine(),
//         ], 500);
//     }
//         if ($request->search) {
//             $query->where(function($q) use ($request) {
//                 $q->where('name', 'like', '%' . $request->search . '%')
//                   ->orWhere('email', 'like', '%' . $request->search . '%');
//             });
//         }

//         if ($request->role) {
//             $query->where('role', $request->role);
//         }

//         if ($request->statut) {
//             $query->where('statut', $request->statut);
//         }

//         $users = $query->withCount('commandes')->latest()->paginate(15);
         
//         return response()->json([
//             'success' => true,
//             'data' => $users
//         ]);
        
//     }

//     // POST /api/admin/users
//     public function store(Request $request)
//     {
//         $request->validate([
//             'name'      => 'required|string|max:100',
//             'email'     => 'required|email|unique:users,email',
//             'password'  => 'required|string|min:6',
//             'role'      => 'required|in:utilisateur,administrateur',
//             'statut'    => 'required|in:actif,inactif,banni',
//             'telephone' => 'nullable|string|max:20',
//             'ville'     => 'nullable|string|max:70',
//             'adresse'   => 'nullable|string',
//         ]);

//         $user = User::create([
//             'name'      => $request->name,
//             'email'     => $request->email,
//             'password'  => Hash::make($request->password),
//             'role'      => $request->role,
//             'statut'    => $request->statut,
//             'telephone' => $request->telephone,
//             'ville'     => $request->ville,
//             'adresse'   => $request->adresse,
//         ]);

//         return response()->json([
//             'success' => true,
//             'message' => 'Utilisateur créé avec succès',
//             'data'    => $user
//         ], 201);
//     }

//     // PUT /api/admin/users/{id}
//     public function update(Request $request, $id)
//     {
//         $user = User::findOrFail($id);

//         $request->validate([
//             'name'   => 'sometimes|string|max:100',
//             'email'  => ['sometimes', 'email', Rule::unique('users')->ignore($id)],
//             'role'   => 'sometimes|in:utilisateur,administrateur',
//             'statut' => 'sometimes|in:actif,inactif,banni',
//         ]);

//         $user->update($request->only(['name', 'email', 'role', 'statut', 'telephone', 'ville', 'adresse']));

//         return response()->json([
//             'success' => true,
//             'message' => 'Utilisateur mis à jour',
//             'data'    => $user
//         ]);
//     }

//     // PATCH /api/admin/users/{id}/statut
//     public function updateStatut(Request $request, $id)
//     {
//         $user = User::findOrFail($id);

//         $request->validate([
//             'statut' => 'required|in:actif,inactif,banni'
//         ]);

//         $user->update(['statut' => $request->statut]);

//         return response()->json([
//             'success' => true,
//             'message' => 'Statut mis à jour',
//             'data'    => $user
//         ]);
//     }

//     // DELETE /api/admin/users/{id}
//     public function destroy($id)
//     {
//         $user = User::findOrFail($id);

//         // Protection — kan tdlq admin principal
//         if ($user->role === 'administrateur' && User::where('role', 'administrateur')->count() <= 1) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Impossible de supprimer le dernier administrateur'
//             ], 403);
//         }

//         $user->tokens()->delete();
//         $user->delete();

//         return response()->json([
//             'success' => true,
//             'message' => 'Utilisateur supprimé'
//         ]);
//     }
// } -->