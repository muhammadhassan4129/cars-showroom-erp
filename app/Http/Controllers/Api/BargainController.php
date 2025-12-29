<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bargain;
use Illuminate\Http\Request;

class BargainController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:super_admin');
    }

    public function index()
    {
        $bargains = Bargain::with(['users', 'activeSubscription'])->paginate(15);

        return response()->json($bargains);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:bargains,email',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'purchase_commission_rate' => 'required|numeric|min:0',
            'purchase_commission_type' => 'required|in:fixed,percentage',
            'sale_commission_rate' => 'required|numeric|min:0',
            'sale_commission_type' => 'required|in:fixed,percentage',
        ]);

        $bargain = Bargain::create($validated);

        return response()->json([
            'message' => 'Bargain created successfully',
            'bargain' => $bargain
        ], 201);
    }

    public function show($id)
    {
        $bargain = Bargain::with([
            'users',
            'vehicles',
            'customers',
            'purchases',
            'sales',
            'subscriptions'
        ])->findOrFail($id);

        return response()->json($bargain);
    }

    public function update(Request $request, $id)
    {
        $bargain = Bargain::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:bargains,email,' . $id,
            'phone' => 'sometimes|required|string|max:20',
            'address' => 'nullable|string',
            'purchase_commission_rate' => 'sometimes|required|numeric|min:0',
            'purchase_commission_type' => 'sometimes|required|in:fixed,percentage',
            'sale_commission_rate' => 'sometimes|required|numeric|min:0',
            'sale_commission_type' => 'sometimes|required|in:fixed,percentage',
            'is_active' => 'sometimes|boolean',
        ]);

        $bargain->update($validated);

        return response()->json([
            'message' => 'Bargain updated successfully',
            'bargain' => $bargain
        ]);
    }

    public function destroy($id)
    {
        $bargain = Bargain::findOrFail($id);
        $bargain->delete();

        return response()->json([
            'message' => 'Bargain deleted successfully'
        ]);
    }
}
