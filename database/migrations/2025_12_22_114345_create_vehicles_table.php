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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bargain_id')->constrained()->onDelete('cascade');
            $table->string('make'); // Company (Toyota, Honda)
            $table->string('model');
            $table->year('year');
            $table->string('registration_number')->unique();
            $table->string('chassis_number')->nullable();
            $table->string('engine_number')->nullable();
            $table->string('color')->nullable();
            $table->integer('mileage')->nullable();
            $table->string('status' )->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
