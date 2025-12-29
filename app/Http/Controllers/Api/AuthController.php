<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account is inactive. Please contact admin.'
            ], 403);
        }

        // Check subscription for non-super admins
        if (!$user->hasRole('super_admin') && $user->bargain) {
            $subscription = $user->bargain->activeSubscription;
            if (!$subscription || $subscription->end_date < now()) {
                return response()->json([
                    'message' => 'Subscription expired. Please renew to continue.'
                ], 403);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load(['bargain', 'roles']),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'bargain_id' => 'nullable|exists:bargains,id',
            'role' => 'required|in:bargain_manager,staff',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'bargain_id' => $request->bargain_id,
        ]);

        $user->assignRole($request->role);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user->load(['bargain', 'roles']),
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load(['bargain', 'roles', 'permissions'])
        ]);
    }
}
