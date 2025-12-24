import React, { useState } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
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
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Business,
  Person,
  Phone,
  Email,
  LocationOn,
  CheckCircle,
  Cancel,
  TrendingUp,
  DirectionsCar,
  ShoppingCart,
  Sell,
  AttachMoney,
  Visibility,
} from '@mui/icons-material';
import { dummyBargains } from '../Utils/dummyData';

const Bargains = () => {
  const [bargains, setBargains] = useState(dummyBargains);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBargain, setSelectedBargain] = useState(null);
  const [currentBargain, setCurrentBargain] = useState({
    name: '',
    manager_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    subscription_plan: 'monthly',
    subscription_fee: 5000,
    subscription_start: new Date().toISOString().split('T')[0],
    subscription_end: '',
    status: 'active',
  });

  // Calculate subscription end date
  const calculateEndDate = (startDate, plan) => {
    const start = new Date(startDate);
    if (plan === 'monthly') {
      start.setMonth(start.getMonth() + 1);
    } else if (plan === 'quarterly') {
      start.setMonth(start.getMonth() + 3);
    } else if (plan === 'yearly') {
      start.setFullYear(start.getFullYear() + 1);
    }
    return start.toISOString().split('T')[0];
  };

  // Open Add Dialog
  const handleAddClick = () => {
    setEditMode(false);
    const startDate = new Date().toISOString().split('T')[0];
    setCurrentBargain({
      name: '',
      manager_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      subscription_plan: 'monthly',
      subscription_fee: 5000,
      subscription_start: startDate,
      subscription_end: calculateEndDate(startDate, 'monthly'),
      status: 'active',
    });
    setOpenDialog(true);
  };

  // Open Edit Dialog
  const handleEditClick = (bargain) => {
    setEditMode(true);
    setCurrentBargain(bargain);
    setOpenDialog(true);
  };

  // Open View Dialog
  const handleViewClick = (bargain) => {
    setSelectedBargain(bargain);
    setOpenViewDialog(true);
  };

  // Handle Plan Change
  const handlePlanChange = (plan) => {
    const fee = plan === 'monthly' ? 5000 : plan === 'quarterly' ? 13500 : 50000;
    const endDate = calculateEndDate(currentBargain.subscription_start, plan);
    setCurrentBargain({
      ...currentBargain,
      subscription_plan: plan,
      subscription_fee: fee,
      subscription_end: endDate,
    });
  };

  // Handle Start Date Change
  const handleStartDateChange = (date) => {
    const endDate = calculateEndDate(date, currentBargain.subscription_plan);
    setCurrentBargain({
      ...currentBargain,
      subscription_start: date,
      subscription_end: endDate,
    });
  };

  // Handle Form Submit
  const handleSubmit = () => {
    if (editMode) {
      setBargains(bargains.map(b => 
        b.id === currentBargain.id ? currentBargain : b
      ));
    } else {
      const newBargain = {
        ...currentBargain,
        id: bargains.length + 1,
        total_vehicles: 0,
        total_purchases: 0,
        total_sales: 0,
        commission_earned: 0,
        created_at: new Date().toISOString().split('T')[0],
      };
      setBargains([...bargains, newBargain]);
    }
    setOpenDialog(false);
  };

  // Delete Bargain
  const handleDelete = (id) => {
    if (window.confirm('Are you sure? This will delete all data for this bargain!')) {
      setBargains(bargains.filter(b => b.id !== id));
    }
  };

  // Toggle Status
  const handleToggleStatus = (id) => {
    setBargains(bargains.map(b => 
      b.id === id 
        ? { ...b, status: b.status === 'active' ? 'suspended' : 'active' }
        : b
    ));
  };

  // Filter bargains
  const filteredBargains = bargains.filter(bargain => {
    const matchesSearch = bargain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bargain.manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bargain.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bargain.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      active: { color: 'success', icon: <CheckCircle />, label: 'Active' },
      expired: { color: 'error', icon: <Cancel />, label: 'Expired' },
      suspended: { color: 'warning', icon: <Cancel />, label: 'Suspended' },
    };
    return config[status] || config.active;
  };

  // Calculate stats
  const totalBargains = bargains.length;
  const activeBargains = bargains.filter(b => b.status === 'active').length;
  const totalRevenue = bargains.reduce((sum, b) => sum + b.commission_earned, 0);
  const monthlySubscription = bargains.filter(b => b.status === 'active').length * 5000;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bargain Management</h1>
          <p className="text-gray-600 mt-1">Manage all bargain dealers and their subscriptions</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          style={{ backgroundColor: '#2563eb' }}
        >
          Add New Bargain
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bargains</p>
                <p className="text-2xl font-bold text-gray-800">{totalBargains}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Business className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Bargains</p>
                <p className="text-2xl font-bold text-green-600">{activeBargains}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Monthly Subscription</p>
                <p className="text-2xl font-bold text-purple-600">PKR {(monthlySubscription / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AttachMoney className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(totalRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <TextField
            placeholder="Search by name, manager, or city..."
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
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Bargains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBargains.map((bargain) => {
          const statusConfig = getStatusConfig(bargain.status);
          return (
            <Card key={bargain.id} className="hover:shadow-xl transition-shadow">
              <CardContent>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Business className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{bargain.name}</h3>
                      <p className="text-sm text-gray-500">{bargain.city}</p>
                    </div>
                  </div>
                  <Chip 
                    label={statusConfig.label}
                    color={statusConfig.color}
                    size="small"
                    icon={statusConfig.icon}
                  />
                </div>

                {/* Manager Info */}
                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2 text-sm">
                    <Person className="text-gray-400" fontSize="small" />
                    <span className="text-gray-700">{bargain.manager_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="text-gray-400" fontSize="small" />
                    <span className="text-gray-700">{bargain.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Email className="text-gray-400" fontSize="small" />
                    <span className="text-gray-700">{bargain.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <LocationOn className="text-gray-400" fontSize="small" />
                    <span className="text-gray-700">{bargain.address}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="flex items-center gap-1">
                      <DirectionsCar className="text-blue-600" fontSize="small" />
                      <span className="text-xs text-blue-600">Vehicles</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">{bargain.total_vehicles}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="text-green-600" fontSize="small" />
                      <span className="text-xs text-green-600">Purchases</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">{bargain.total_purchases}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="flex items-center gap-1">
                      <Sell className="text-purple-600" fontSize="small" />
                      <span className="text-xs text-purple-600">Sales</span>
                    </div>
                    <p className="text-lg font-bold text-purple-700">{bargain.total_sales}</p>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <div className="flex items-center gap-1">
                      <AttachMoney className="text-orange-600" fontSize="small" />
                      <span className="text-xs text-orange-600">Commission</span>
                    </div>
                    <p className="text-sm font-bold text-orange-700">
                      {(bargain.commission_earned / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                {/* Subscription Info */}
                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="text-xs text-gray-600 mb-1">Subscription</p>
                  <p className="font-semibold text-gray-800">
                    PKR {bargain.subscription_fee.toLocaleString()} / {bargain.subscription_plan}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Expires: {new Date(bargain.subscription_end).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewClick(bargain)}
                    fullWidth
                  >
                    View
                  </Button>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditClick(bargain)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color={bargain.status === 'active' ? 'warning' : 'success'}
                    onClick={() => handleToggleStatus(bargain.id)}
                  >
                    {bargain.status === 'active' ? <Cancel /> : <CheckCircle />}
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(bargain.id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBargains.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          No bargains found
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Bargain' : 'Add New Bargain'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mt-2">
            <Grid item xs={12} md={6}>
              <TextField
                label="Bargain Name"
                value={currentBargain.name}
                onChange={(e) => setCurrentBargain({...currentBargain, name: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Manager Name"
                value={currentBargain.manager_name}
                onChange={(e) => setCurrentBargain({...currentBargain, manager_name: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                value={currentBargain.email}
                onChange={(e) => setCurrentBargain({...currentBargain, email: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                value={currentBargain.phone}
                onChange={(e) => setCurrentBargain({...currentBargain, phone: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="Address"
                value={currentBargain.address}
                onChange={(e) => setCurrentBargain({...currentBargain, address: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="City"
                value={currentBargain.city}
                onChange={(e) => setCurrentBargain({...currentBargain, city: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Subscription Plan</InputLabel>
                <Select
                  value={currentBargain.subscription_plan}
                  label="Subscription Plan"
                  onChange={(e) => handlePlanChange(e.target.value)}
                >
                  <MenuItem value="monthly">Monthly - PKR 5,000</MenuItem>
                  <MenuItem value="quarterly">Quarterly - PKR 13,500</MenuItem>
                  <MenuItem value="yearly">Yearly - PKR 50,000</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Start Date"
                type="date"
                value={currentBargain.subscription_start}
                onChange={(e) => handleStartDateChange(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="End Date"
                type="date"
                value={currentBargain.subscription_end}
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentBargain.status}
                  label="Status"
                  onChange={(e) => setCurrentBargain({...currentBargain, status: e.target.value})}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            style={{ backgroundColor: '#2563eb' }}
          >
            {editMode ? 'Update' : 'Add'} Bargain
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        {selectedBargain && (
          <>
            <DialogTitle>{selectedBargain.name} - Details</DialogTitle>
            <DialogContent>
              <div className="space-y-4 mt-2">
                <div>
                  <p className="text-sm text-gray-600">Manager</p>
                  <p className="font-semibold">{selectedBargain.manager_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold">{selectedBargain.email}</p>
                  <p className="font-semibold">{selectedBargain.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{selectedBargain.address}, {selectedBargain.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subscription</p>
                  <p className="font-semibold">
                    PKR {selectedBargain.subscription_fee.toLocaleString()} / {selectedBargain.subscription_plan}
                  </p>
                  <p className="text-sm">
                    {new Date(selectedBargain.subscription_start).toLocaleDateString()} - {new Date(selectedBargain.subscription_end).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Performance</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-blue-600">Vehicles</p>
                      <p className="text-xl font-bold text-blue-700">{selectedBargain.total_vehicles}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs text-green-600">Purchases</p>
                      <p className="text-xl font-bold text-green-700">{selectedBargain.total_purchases}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-xs text-purple-600">Sales</p>
                      <p className="text-xl font-bold text-purple-700">{selectedBargain.total_sales}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="text-xs text-orange-600">Commission</p>
                      <p className="text-lg font-bold text-orange-700">
                        PKR {(selectedBargain.commission_earned / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default Bargains;