<?php

namespace App;

enum PurchasePaymentTypeEnum:string
{
    case CASH = 'cash';
    case INSTALLMENT = 'installment';

    public static function labels(): array
    {
        return [
            self::CASH->name => 'Cash',
            self::INSTALLMENT->name => 'Installment'
        ];
    }
}
