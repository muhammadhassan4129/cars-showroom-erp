<?php

namespace App;

enum PaymentMethodEnum
{
    case CASH;
    case BANK_TRANSFER;
    case CHEQUE;
    case ONLINE;
    public static function values(): array
    {
        return [
            self::CASH->name,
            self::BANK_TRANSFER->name,
            self::CHEQUE->name,
            self::ONLINE->name
        ];
    }

    public static function labels(): array
    {
        return [
            self::CASH->name => 'Cash',
            self::BANK_TRANSFER->name => 'Bank Transfer',
            self::CHEQUE->name => 'Cheque',
            self::ONLINE->name => 'Online'
        ];
    }
}
