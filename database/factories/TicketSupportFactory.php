<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketSupportFactory extends Factory
{
    public function definition(): array
    {
        $sujets = [
            'Problème avec ma commande',
            'Retard de livraison',
            'Produit endommagé',
            'Demande de remboursement',
            'Question sur un produit',
            'Problème de paiement',
        ];

        return [
            'utilisateur_id' => User::where('role', 'utilisateur')->inRandomOrder()->first()?->id,
            'commande_id'    => null,
            'sujet'          => fake()->randomElement($sujets),
            'message'        => fake()->paragraph(2),
            'statut'         => fake()->randomElement(['ouvert', 'en_cours', 'resolu', 'ferme']),
            'priorite'       => fake()->randomElement(['basse', 'moyenne', 'haute', 'urgente']),
        ];
    }
}
