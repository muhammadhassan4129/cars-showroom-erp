<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

    protected $fillable = [
        'bargain_id',
        'type',
        'original_amount',
        'commission_rate',
        'commission_type',
        'commission_amount',
        'net_amount',
        'transaction_date',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'original_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'net_amount' => 'decimal:2',
    ];

    // Relationships
    public function bargain()
    {
        return $this->belongsTo(Bargain::class);
    }

    public function commissionable()
    {
        return $this->morphTo();
    }
}
