<?php
 
namespace Database\Factories;
 
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
 
class UserFactory extends Factory
{
    public function definition(): array
    {
        // Villes marocaines pour les adresses
        $villes = [
            'Casablanca', 'Rabat', 'Salé', 'Marrakech',
            'Fès', 'Meknès', 'Agadir', 'Tanger', 'Oujda', 'Tétouan'
        ];
 
        return [
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => Hash::make('password'), // password par défaut
            'telephone'         => '+212' . fake()->numerify('6########'),
            'adresse'           => fake()->buildingNumber() . ', ' . fake()->streetName() . ', ' . fake()->randomElement($villes),
            'ville'              => fake()->city(),
            'role'              => 'utilisateur',
            'statut'            => 'actif',
            'remember_token'    => Str::random(10),
        ];
    }
 
    // ── States ───────────────────────────────────────────────
 
    // Factory::admin() → user administrateur
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'administrateur',
        ]);
    }
 
    // Factory::inactif() → user inactif
    public function inactif(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'inactif',
        ]);
    }
 
    // Factory::banni() → user banni
    public function banni(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'banni',
        ]);
    }
 
    // Factory::unverified() → email pas vérifié
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
// namespace Database\Factories;

// use App\Models\User;
// use Illuminate\Database\Eloquent\Factories\Factory;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Str;

// /**
//  * @extends Factory<User>
//  */
// class UserFactory extends Factory
// {
//     /**
//      * The current password being used by the factory.
//      */
//     protected static ?string $password;

//     /**
//      * Define the model's default state.
//      *
//      * @return array<string, mixed>
//      */
//     public function definition(): array
//     {
//         return [
//             'name' => fake()->name(),
//             'email' => fake()->unique()->safeEmail(),
//             'email_verified_at' => now(),
//             'password' => static::$password ??= Hash::make('password'),
//             'remember_token' => Str::random(10),
//         ];
//     }

//     /**
//      * Indicate that the model's email address should be unverified.
//      */
//     public function unverified(): static
//     {
//         return $this->state(fn (array $attributes) => [
//             'email_verified_at' => null,
//         ]);
//     }
// }
