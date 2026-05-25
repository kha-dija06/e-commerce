<?php

namespace Database\Seeders;

use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Paiement;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommandeSeeder extends Seeder
{
    public function run(): void
    {
        $users   = User::where('role', 'utilisateur')->get();
        $produits = Produit::where('statut', 'disponible')->get();

        if ($users->isEmpty() || $produits->isEmpty()) return;

        foreach ($users->take(5) as $user) {
            for ($i = 0; $i < rand(1, 3); $i++) {
                $commande = Commande::create([
                    'utilisateur_id'   => $user->id,
                    'adresse'          => $user->adresse ?? 'Casablanca, Maroc',
                    'total'            => 0,
                    'statut'           => fake()->randomElement(['en_attente', 'en_traitement', 'livree']),
                    'methode_paiement' => fake()->randomElement(['paiement_livraison', 'carte', 'paypal']),
                ]);

                $total = 0;
                $selectedProduits = $produits->random(rand(1, 3));

                foreach ($selectedProduits as $produit) {
                    $quantite = rand(1, 3);
                    $prix     = $produit->prix;
                    $total   += $prix * $quantite;

                    LigneCommande::create([
                        'commande_id' => $commande->id,
                        'produit_id'  => $produit->id,
                        'quantite'    => $quantite,
                        'prix'        => $prix,
                    ]);
                }

                $commande->update(['total' => $total]);

                Paiement::create([
                    'commande_id'      => $commande->id,
                    'methode_paiement' => $commande->methode_paiement,
                    'montant'          => $total,
                    'statut'           => $commande->statut === 'livree' ? 'complete' : 'en_attente',
                ]);
            }
        }
    }
}


