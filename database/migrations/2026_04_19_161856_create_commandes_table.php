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
    Schema::create('commandes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('utilisateur_id')->constrained('users')->cascadeOnDelete();
        $table->text('adresse');
        $table->decimal('total', 10, 2);
        $table->enum('statut', ['en_attente', 'en_traitement', 'expediee', 'livree', 'annulee'])->default('en_attente');
        $table->enum('methode_paiement', ['paiement_livraison', 'carte', 'virement_bancaire', 'paypal']);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
