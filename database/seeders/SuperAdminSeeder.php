<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
// use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
        'name' => 'Super Admin',
        'email' => 'admin@erp.com',
        'password' => Hash::make('Admin@123'),
        ]);
        $admin->assignRole('super_admin');
    }
}
