<?php

use App\Models\Bargain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Container\Attributes\Auth;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\BargainController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InstallmentController;
use App\Http\Controllers\Api\SubscriptionController;

// Public Routes
Route::post('/login',[AuthController::class,'login']);
Route::post('/register',[AuthController::class,'register']);

// Protected Routes
Route::middleware(['auth:sanctum', 'bargain'])->group(function () {

    // Auth Routes
    Route::post('/logout',[AuthController::class,'logout']);
    Route::get('/me',[AuthController::class,'me']);

    // Dashboard Routes
    Route::get('/dashboard',[DashboardController::class,'index']);
    Route::get('dashboard/monthly-report', [DashboardController::class, 'monthlyReport']);
    Route::get('dashboard/yearly-report', [DashboardController::class, 'yearlyReport']);

    // Bargain Routes(Super Admin Only)
    Route::apiResource('bargains', BargainController::class);

    // Vehicles
    Route::apiResource('vehicles', VehicleController::class);
    Route::get('vehicles/available/list', [VehicleController::class, 'available']);

    // Customers
    Route::apiResource('customers', CustomerController::class);

    // Purchases
    Route::apiResource('purchases', PurchaseController::class);

    // Sales
    Route::apiResource('sales', SaleController::class);

    // Installments
    Route::get('installments', [InstallmentController::class, 'index']);
    Route::get('installments/{id}', [InstallmentController::class, 'show']);
    Route::put('installments/{id}/pay', [InstallmentController::class, 'payInstallment']);
    Route::get('installments/overdue/list', [InstallmentController::class, 'overdue']);

    // Payments
    Route::apiResource('payments', PaymentController::class);

    // Subscriptions (Super Admin Only)
    Route::apiResource('subscriptions', SubscriptionController::class);
});
