<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lignes_commande', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->cascadeOnDelete();
            $table->foreignId('produit_id')->constrained('produits')->cascadeOnDelete();
            $table->integer('quantite')->default(1);
            $table->decimal('prix', 10, 2);  // prix unitaire au moment de la commande
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lignes_commande');
    }
};
