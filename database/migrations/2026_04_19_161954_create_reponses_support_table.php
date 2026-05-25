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
    Schema::create('reponses_support', function (Blueprint $table) {
        $table->id();
        $table->foreignId('ticket_id')->constrained('tickets_support')->cascadeOnDelete();
        $table->foreignId('utilisateur_id')->constrained('users')->cascadeOnDelete();
        $table->text('message');
        $table->timestamp('date_creation')->useCurrent();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reponses_support');
    }
};
