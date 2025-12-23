<?php

namespace App;

enum VehicleStatusEnum:string
{
    case AVAILABLE = 'available';
    case SOLD = 'sold';
    case MAINTENANCE = 'maintenance';
    case RESERVED = 'reserved';

    public static function labels(): array
    {
        return [
            self::AVAILABLE->name => 'Available',
            self::SOLD->name => 'Sold',
            self::MAINTENANCE->name => 'Maintenance',
            self::RESERVED->name => 'Reserved'
        ];
    }
}
