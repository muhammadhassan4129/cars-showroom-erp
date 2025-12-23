<?php

namespace App;

enum CustomerTypeEnum:string
{
    case BUYER = 'buyer';
    case SELLER = 'seller';
    case BOTH = 'both';

    public static function labels(): array
    {
        return [
            self::BUYER->name => 'Buyer',
            self::SELLER->name => 'Seller',
            self::BOTH->name => 'Both'
        ];
    }
}
