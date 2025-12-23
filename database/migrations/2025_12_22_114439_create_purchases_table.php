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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bargain_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade'); // Seller
            $table->decimal('original_price', 12, 2);
            $table->decimal('bargain_price', 12, 2); // Negotiated price
            $table->decimal('commission_amount', 12, 2);
            $table->decimal('net_amount', 12, 2); // After commission
            $table->enum('payment_type', ['cash', 'installment']);
            $table->integer('installment_months')->nullable(); // 3, 4, 5
            $table->date('purchase_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
