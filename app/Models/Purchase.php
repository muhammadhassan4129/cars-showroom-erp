<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Purchase extends Model
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
        'purchase_date',
        'notes',
    ];

    protected $casts = [
        'purchase_date' => 'datetime',
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
