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
    Schema::create('tickets_support', function (Blueprint $table) {
        $table->id();
        $table->foreignId('utilisateur_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('commande_id')->nullable()->constrained('commandes')->nullOnDelete();
        $table->string('sujet', 200);
        $table->text('message');
        $table->enum('statut', ['ouvert', 'en_cours', 'en_attente', 'resolu', 'ferme'])->default('ouvert');
        $table->enum('priorite', ['basse', 'moyenne', 'haute', 'urgente'])->default('moyenne');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets_support');
    }
};
