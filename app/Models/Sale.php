<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'bargain_id',
        'vehicle_id',
        'customer_id',
        'original_price',
        'bargain_price',
        'commission_amount',
        'net_amount',
        'payment_type',
        'installment_months',
        'sale_date',
        'notes',
    ];

    protected $casts = [
        'sale_date' => 'date',
        'original_price' => 'decimal:2',
        'bargain_price' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'net_amount' => 'decimal:2',
    ];

    // Relationships
    public function bargain()
    {
        return $this->belongsTo(Bargain::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function installments()
    {
        return $this->morphMany(Installment::class, 'installmentable');
    }

    public function commission()
    {
        return $this->morphOne(Commission::class, 'commissionable');
    }

    public function payments()
    {
        return $this->morphMany(Payment::class, 'paymentable');
    }
}
