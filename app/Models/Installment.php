<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    use HasFactory;

    protected $fillable = [
        'bargain_id',
        'installment_number',
        'amount',
        'due_date',
        'paid_amount',
        'status',
        'paid_date',
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_date' => 'date',
        'amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

    // Relationships
    public function bargain()
    {
        return $this->belongsTo(Bargain::class);
    }

    public function installmentable()
    {
        return $this->morphTo();
    }

    public function payments()
    {
        return $this->morphMany(Payment::class, 'paymentable');
    }
}
