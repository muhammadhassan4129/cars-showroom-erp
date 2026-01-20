import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import { vehicleAPI } from '../Services/api';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  InputAdornment,
  Grid,
    Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  DirectionsCar,
  AttachMoney,
  CheckCircle,
  Cancel,
  Pending,
} from '@mui/icons-material';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentVehicle, setCurrentVehicle] = useState({
    make: '',
    model: '',
    year: '',
    registration_number: '',
    chassis_number: '',
    engine_number: '',
    color: '',
    mileage: '',
    status: 'available',

    // name: '',
    // model: '',
    // registration: '',
    // chassis: '',
    // engine: '',
    // color: '',
    // condition: 'excellent',
    // purchase_price: '',
    // sale_price: '',
    // status: 'available',
  });

  // Fetch vehicles from API

    useEffect(() => {
      fetchVehicles();
    }, []);
  

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await vehicleAPI.getAll();
        // Laravel pagination and resource handling
        const resData = response.data?.data?.data || response.data?.data || response.data;
        console.log('Fetched vehicles:', resData);
        setVehicles(Array.isArray(resData) ? resData : []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        showSnackbar('Failed to load vehicles', 'error');
      } finally {
        setLoading(false);
      }
    };

      const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };


  // Open Add Dialog
  const handleAddClick = () => {
    setEditMode(false);
    setCurrentVehicle({
    make: '',
    model: '',
    year: '',
    registration_number: '',
    chassis_number: '',
    engine_number: '',
    color: '',
    mileage: '',
    status: 'available',

      // name: '',
      // model: '',
      // registration: '',
      // chassis: '',
      // engine: '',
      // color: '',
      // condition: 'excellent',
      // purchase_price: '',
      // sale_price: '',
      // status: 'available',
    });
    setOpenDialog(true);
  };

  // Open Edit Dialog
  const handleEditClick = (vehicle) => {
    setEditMode(true);
    setCurrentVehicle(vehicle);
    setOpenDialog(true);
  };

  // Handle Form Submit
  const handleSubmit = async () => {

    try {

      const payload = {
        make: currentVehicle.make,
        model: currentVehicle.model,
        year: currentVehicle.year,
        registration_number: currentVehicle.registration_number,
        chassis_number: currentVehicle.chassis_number,
        engine_number: currentVehicle.engine_number,
        color: currentVehicle.color,
        mileage: currentVehicle.mileage,
        status: currentVehicle.status,
      }

        if (editMode) {
          const response = await vehicleAPI.update(currentVehicle.id, payload);
          const updatedVehicle = response.data.data || response.data;
           setVehicles(prev => prev.map(c => c.id === currentVehicle.id ? updatedVehicle : c));
          showSnackbar('Vehicle updated successfully');
        } else {
          const response = await vehicleAPI.create(payload);
          const newVehicle = response.data.data || response.data;
          setVehicles(prev => [newVehicle, ...prev]);
          showSnackbar('Vehicle added successfully');
        }
      // Update existing vehicle
      setOpenDialog(false);

    } catch (error) {
      console.error('Error saving vehicle:', error);
      showSnackbar(error.response?.data?.message || 'Failed to save vehicle', 'error');
    }

  };

  // Delete Vehicle
// Delete Vehicle
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleAPI.delete(id); // API call
        setVehicles(prev => prev.filter(v => v.id !== id));
        showSnackbar('Vehicle deleted successfully');
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        showSnackbar('Failed to delete vehicle', 'error');
      }
    }
  };
  // Filter vehicles
// Filter vehicles
  const filteredVehicles = Array.isArray(vehicles) ? vehicles.filter(vehicle => {
    if (!vehicle) return false;

    const search = searchTerm.toLowerCase();
    
    // Naye fields ke mutabiq safe check
    const make = (vehicle.make || '').toLowerCase();
    const model = (vehicle.model || '').toString().toLowerCase(); // Model saal bhi ho sakta hai
    const regNo = (vehicle.registration_number || '').toLowerCase();

    const matchesSearch = make.includes(search) || 
                          model.includes(search) || 
                          regNo.includes(search);

    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) : [];

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      available: { color: 'success', icon: <CheckCircle />, label: 'Available' },
      sold: { color: 'error', icon: <Cancel />, label: 'Sold' },
      reserved: { color: 'warning', icon: <Pending />, label: 'Reserved' },
    };
    return config[status] || config.available;
  };

  // Get condition badge
  // const getConditionColor = (condition) => {
  //   const colors = {
  //     excellent: 'success',
  //     good: 'primary',
  //     fair: 'warning',
  //   };
  //   return colors[condition] || 'default';
  // };

    if (loading) {
      return (
        <DashboardLayout>
          <div className="flex justify-center items-center h-64"><CircularProgress /></div>
        </DashboardLayout>
      );
    }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vehicles</h1>
          <p className="text-gray-600 mt-1">Manage your vehicle inventory</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          style={{ backgroundColor: '#2563eb' }}
        >
          Add Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-800">{vehicles.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DirectionsCar className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === 'available').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sold</p>
              <p className="text-2xl font-bold text-red-600">
                {vehicles.filter(v => v.status === 'sold').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Cancel className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <TextField
            placeholder="Search by name, model, or registration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            className="flex-1 min-w-[300px]"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" className="min-w-[150px]">
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
              <MenuItem value="reserved">Reserved</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => {
          const statusConfig = getStatusBadge(vehicle.status);
          return (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              {/* Vehicle Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <DirectionsCar style={{ fontSize: 80 }} className="text-blue-600" />
              </div>

              {/* Vehicle Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{vehicle.model}</h3>
                    <p className="text-sm text-gray-500">Company: {vehicle.make}</p>
                  </div>
                  <Chip 
                    label={statusConfig.label}
                    color={statusConfig.color}
                    size="small"
                    icon={statusConfig.icon}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Registration:</span>
                    <span className="font-medium text-gray-800">{vehicle.registration_number}</span>
                  </div>
                   <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Chassis:</span>
                    <span className="font-medium text-gray-800">{vehicle.chassis_number}</span>
                  </div>
                   <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engine:</span>
                    <span className="font-medium text-gray-800">{vehicle.engine_number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium text-gray-800">{vehicle.color}</span>
                  </div>
                   <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-medium text-gray-800">{vehicle.mileage}</span>
                  </div>              
                </div>

                {/* Pricing */}
                {/* <div className="border-t pt-3 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Purchase Price:</span>
                    <span className="font-semibold text-green-600">
                      PKR {vehicle.purchase_price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sale Price:</span>
                    <span className="font-semibold text-blue-600">
                      PKR {vehicle.sale_price?.toLocaleString()}
                    </span>
                  </div>
                </div> */}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditClick(vehicle)}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(vehicle.id)}
                    fullWidth
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          No vehicles found
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Vehicle' : 'Add New Vehicle'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mt-2">
            <Grid item xs={12} md={6}>
              <TextField
                label="Company/Make"
                placeholder="toyota/honda"
                value={currentVehicle.make}
                onChange={(e) => setCurrentVehicle({...currentVehicle, make: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Model"
                placeholder="e.g., 2020"
                value={currentVehicle.model}
                onChange={(e) => setCurrentVehicle({...currentVehicle, model: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Year"
                placeholder="e.g., 2020"
                value={currentVehicle.year}
                onChange={(e) => setCurrentVehicle({...currentVehicle, year: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Registration Number"
                value={currentVehicle.registration_number}
                onChange={(e) => setCurrentVehicle({...currentVehicle, registration_number: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Chassis Number"
                value={currentVehicle.chassis_number}
                onChange={(e) => setCurrentVehicle({...currentVehicle, chassis_number: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Engine Number"
                value={currentVehicle.engine_number}
                onChange={(e) => setCurrentVehicle({...currentVehicle, engine_number: e.target.value})}
                required
                fullWidth
              />
            </Grid>
             <Grid item xs={12} md={6}>
              <TextField
                label="Color"
                value={currentVehicle.color}
                onChange={(e) => setCurrentVehicle({...currentVehicle, color: e.target.value})}
                required
                fullWidth
              />
            </Grid>
              <Grid item xs={12} md={6}>
              <TextField
                label="Mileage"
                value={currentVehicle.mileage}
                onChange={(e) => setCurrentVehicle({...currentVehicle, mileage: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={currentVehicle.condition}
                  label="Condition"
                  onChange={(e) => setCurrentVehicle({...currentVehicle, condition: e.target.value})}
                >
                  <MenuItem value="excellent">Excellent</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="fair">Fair</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentVehicle.status}
                  label="Status"
                  onChange={(e) => setCurrentVehicle({...currentVehicle, status: e.target.value})}
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                  <MenuItem value="reserved">Reserved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField
                label="Purchase Price (PKR)"
                type="number"
                value={currentVehicle.purchase_price}
                onChange={(e) => setCurrentVehicle({...currentVehicle, purchase_price: Number(e.target.value)})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Sale Price (PKR)"
                type="number"
                value={currentVehicle.sale_price}
                onChange={(e) => setCurrentVehicle({...currentVehicle, sale_price: Number(e.target.value)})}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                }}
              />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: '#2563eb' }}>
            {editMode ? 'Update' : 'Add'} Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Vehicles;