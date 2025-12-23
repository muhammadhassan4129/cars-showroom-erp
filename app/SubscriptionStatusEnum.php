<?php

namespace App;

enum SubscriptionStatusEnum:string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case EXPIRED = 'expired';

    public static function labels(): array
    {
        return [
            self::ACTIVE->name => 'Active',
            self::INACTIVE->name => 'Inactive',
            self::EXPIRED->name => 'Expired'
        ];
    }
}
