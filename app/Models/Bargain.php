<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Bargain extends Model
{
    use HasFactory;
     protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'purchase_commission_rate',
        'purchase_commission_type',
        'sale_commission_rate',
        'sale_commission_type',
        'is_active',
     ];

     protected $casts = [
        'is_active' => 'boolean',
        'purchase_commission_rate' => 'decimal:2',
        'sale_commission_rate' => 'decimal:2',
     ];
        public function users()
        {
            return $this->hasMany(User::class);
        }

        public function vehicles()
        {
            return $this->hasMany(Vehicle::class);
        }

        public function customers()
        {
            return $this->hasMany(Customer::class);
        }
        public function purchases()
        {
            return $this->hasMany(Purchase::class);
        }
        public function sales()
        {
            return $this->hasMany(Sale::class);
        }

        public function subscriptions()
        {
            return $this->hasMany(Subscription::class);
        }

        public function activeSubscription()
        {
            return $this->hasOne(Subscription::class)->where('status', 'active')->latest();
        }


}
