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
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bargain_id')->constrained()->onDelete('cascade');
            $table->morphs('commissionable'); // purchase_id or sale_id
            $table->enum('type', ['purchase', 'sale']);
            $table->decimal('original_amount', 12, 2);
            $table->decimal('commission_rate', 5, 2);
            $table->enum('commission_type', ['fixed', 'percentage']);
            $table->decimal('commission_amount', 12, 2);
            $table->decimal('net_amount', 12, 2);
            $table->date('transaction_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
