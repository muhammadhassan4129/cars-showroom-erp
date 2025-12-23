<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehicle extends Model
{
     use HasFactory;

    protected $fillable = [
        'bargain_id',
        'make',
        'model',
        'year',
        'registration_number',
        'chassis_number',
        'engine_number',
        'color',
        'mileage',
        'status',
    ];

    public function bargain()
    {
        return $this->belongsTo(Bargain::class);
    }

    public function purchase()
    {
        return $this->hasOne(Purchase::class);
    }
    public function sale()
    {
        return $this->hasOne(Sale::class);
    }
}
