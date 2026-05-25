<?php


namespace Database\Seeders;
 
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;


// class DatabaseSeeder extends Seeder
// {
//     use WithoutModelEvents;

//     /**
//      * Seed the application's database.
//      */
//     public function run(): void
//     {
//         // User::factory(10)->create();

//         User::factory()->create([
//             'name' => 'Test User',
//             'email' => 'test@example.com',
//         ]);
//     }
// }


// namespace Database\Seeders;

// use Illuminate\Database\Seeder;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Hash;

// class DatabaseSeeder extends Seeder
// {
//     public function run()
//     {
//         // Admin
//         DB::table('users')->insert([
//             'name' => 'Administrateur',
//             'email' => 'admin@moroccoart.ma',
//             'password' => Hash::make('Admin@123'),
//             'telephone' => '+212600000000',
//             'adresse' => 'Casablanca, Maroc',
//             'role' => 'administrateur',
//             'statut' => 'actif'
//         ]);

//         // Utilisateur test
//         DB::table('users')->insert([
//             'name' => 'Khadija',
//             'email' => 'bbbbb12@gmail.com',
//             'password' => Hash::make('User@123'),
//             'telephone' => '+212612345678',
//             'adresse' => 'Rabat, Maroc',
//             'role' => 'utilisateur',
//             'statut' => 'actif'
//         ]);

//         // Catégories
//         // $categories = [
//         //     'Électronique', 'Mode & Vêtements', 'Maison & Jardin',
//         //     'Beauté & Santé', 'Sport & Loisirs', 'Produits du terroir marocain'
//         // ];
        
//         // foreach ($categories as $cat) {
//         //     DB::table('CATEGORIES')->insert(['nom' => $cat]);
//         // }
//     }
// }

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
       
         $this->call([

            UserSeeder::class,
        
       
            CommandeSeeder::class,
            TicketSupportSeeder::class,
        ]);
    }
}