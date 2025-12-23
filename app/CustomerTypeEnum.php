<?php

namespace App;

enum CustomerTypeEnum:
{
    case BUYER = 'buyer';
    case SELLER = 'seller';
    case BOTH = 'both';
}
