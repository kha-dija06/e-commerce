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
    Schema::create('produits', function (Blueprint $table) {
        $table->id();
        $table->string('nom', 200);
        $table->decimal('prix', 10, 2);
        $table->integer('stock')->default(0);
        $table->text('description')->nullable();
        $table->string('image', 500)->nullable();
        $table->enum('statut', ['disponible', 'rupture_stock', 'abandonne'])->default('disponible');
        $table->foreignId('categorie_id')->nullable()->constrained('categories')->nullOnDelete();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
