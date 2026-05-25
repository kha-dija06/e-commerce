<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
 
class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Admin principal (credentials fixes) ────────────
        User::create([
            'name'              => 'Admin Principal',
            'email'             => 'admin@monapp.com',
            'email_verified_at' => now(),
            'password'          => Hash::make('Admin1234!'),
            'telephone'         => '+212600000001',
            'adresse'           => '1 Avenue Mohammed V, Rabat',
            'ville'             => 'rabat',
            'role'              => 'administrateur',
            'statut'            => 'actif',
        ]);
 
        // ── 2. User test (credentials fixes) ─────────────────
        User::create([
            'name'              => 'Utilisateur Test',
            'email'             => 'user@monapp.com',
            'email_verified_at' => now(),
            'password'          => Hash::make('User1234!'),
            'telephone'         => '+212600000002',
            'adresse'           => '25 Rue Hassan II, Casablanca',
            'ville'             => 'Casablanca',
            'role'              => 'utilisateur',
            'statut'            => 'actif',
        ]);
 
        // ── 3. Users aléatoires avec la factory ──────────────
        User::factory()->count(10)->create();                  // 10 users actifs
        User::factory()->count(3)->admin()->create();          // 3 admins
        User::factory()->count(3)->inactif()->create();        // 3 inactifs
        User::factory()->count(2)->banni()->create();          // 2 bannis
    }
}
 
