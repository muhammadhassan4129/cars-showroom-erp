<?php

namespace App;

enum InstallmentStatusEnum:string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case OVERDUE = 'overdue';

    public static function labels(): array
    {
        return [
            self::PENDING->name => 'Pending',
            self::PAID->name => 'Paid',
            self::OVERDUE->name => 'Overdue'
        ];
    }
}
