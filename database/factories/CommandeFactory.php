<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommandeFactory extends Factory
{
    public function definition(): array
    {
        $villes = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'];

        return [
            'utilisateur_id'   => User::where('role', 'utilisateur')->inRandomOrder()->first()?->id,
            'adresse'          => fake()->buildingNumber() . ', Rue ' . fake()->lastName() . ', ' . fake()->randomElement($villes),
            'total'            => fake()->randomFloat(2, 100, 10000),
            'statut'           => fake()->randomElement(['en_attente', 'en_traitement', 'expediee', 'livree', 'annulee']),
            'methode_paiement' => fake()->randomElement(['paiement_livraison', 'carte', 'virement_bancaire', 'paypal']),
        ];
    }
}
