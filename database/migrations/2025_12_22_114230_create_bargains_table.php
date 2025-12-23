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
        Schema::create('bargains', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('address')->nullable();
            $table->decimal('purchase_commission_rate', 5, 2)->default(0);
            $table->enum('purchase_commission_type', ['fixed', 'percentage'])->default('percentage');
            $table->decimal('sale_commission_rate', 5, 2)->default(0);
            $table->enum('sale_commission_type', ['fixed', 'percentage'])->default('percentage');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bargains');
    }
};
