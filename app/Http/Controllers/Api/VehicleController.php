<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    private function getBargainId(Request $request)
    {
        $user = $request->user();
        return $user->hasRole('super_admin') ? null : $user->bargain_id;
    }

    public function index(Request $request)
    {
        $query = Vehicle::with(['bargain', 'purchase', 'sale']);

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        $vehicles = $query->paginate(15);

        return response()->json($vehicles);
    }

    public function available(Request $request)
    {
        $query = Vehicle::where('status', 'available');

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        $vehicles = $query->get();

        return response()->json($vehicles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'registration_number' => 'required|string|unique:vehicles,registration_number',
            'chassis_number' => 'nullable|string',
            'engine_number' => 'nullable|string',
            'color' => 'nullable|string',
            'mileage' => 'nullable|integer|min:0',
        ]);

        $user = $request->user();
        $validated['bargain_id'] = $user->hasRole('super_admin')
            ? $request->bargain_id
            : $user->bargain_id;

        $vehicle = Vehicle::create($validated);

        return response()->json([
            'message' => 'Vehicle created successfully',
            'vehicle' => $vehicle
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $query = Vehicle::with(['bargain', 'purchase.customer', 'sale.customer']);

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        $vehicle = $query->findOrFail($id);

        return response()->json($vehicle);
    }

    public function update(Request $request, $id)
    {
        $query = Vehicle::query();

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        $vehicle = $query->findOrFail($id);

        $validated = $request->validate([
            'make' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'registration_number' => 'sometimes|required|string|unique:vehicles,registration_number,' . $id,
            'chassis_number' => 'nullable|string',
            'engine_number' => 'nullable|string',
            'color' => 'nullable|string',
            'mileage' => 'nullable|integer|min:0',
            'status' => 'sometimes|in:available,sold,reserved',
        ]);

        $vehicle->update($validated);

        return response()->json([
            'message' => 'Vehicle updated successfully',
            'vehicle' => $vehicle
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $query = Vehicle::query();

        $bargainId = $this->getBargainId($request);
        if ($bargainId) {
            $query->where('bargain_id', $bargainId);
        }

        $vehicle = $query->findOrFail($id);
        $vehicle->delete();

        return response()->json([
            'message' => 'Vehicle deleted successfully'
        ]);
    }
}
