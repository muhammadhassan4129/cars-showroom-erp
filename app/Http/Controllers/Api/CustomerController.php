<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    private function getBargainId(Request $request)
    {
        $user = $request->user();
        return $user->hasRole('super_admin') ? null : $user->bargain_id;
    }

    public function index(Request $request)
    {
        $query = Customer::with(['bargain']);

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $customers = $query->paginate(15);

        return response()->json($customers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'cnic' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'type' => 'required|in:buyer,seller,both',
        ]);

        $user = $request->user();
        $validated['bargain_id'] = $user->hasRole('super_admin')
            ? $request->bargain_id
            : $user->bargain_id;

        $customer = Customer::create($validated);

        return response()->json([
            'message' => 'Customer created successfully',
            'customer' => $customer
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $query = Customer::with(['bargain', 'purchases', 'sales']);

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        $customer = $query->findOrFail($id);

        return response()->json($customer);
    }

    public function update(Request $request, $id)
    {
        $query = Customer::query();

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        $customer = $query->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'cnic' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'type' => 'sometimes|required|in:buyer,seller,both',
        ]);

        $customer->update($validated);

        return response()->json([
            'message' => 'Customer updated successfully',
            'customer' => $customer
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $query = Customer::query();

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        $customer = $query->findOrFail($id);
        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully'
        ]);
    }
}
