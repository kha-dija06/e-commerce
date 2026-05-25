<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('paniers', function (Blueprint $table) {
        $table->id();
        $table->foreignId('utilisateur_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('produit_id')->constrained('produits')->cascadeOnDelete();
        $table->integer('quantite');
        $table->timestamps();
        $table->unique(['utilisateur_id', 'produit_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paniers');
    }
};
