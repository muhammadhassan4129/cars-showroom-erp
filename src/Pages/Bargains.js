import React, { useState, useEffect } from 'react';
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
  Alert,
  Divider,
  CircularProgress,
  Snackbar,
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
  Lock,
  PersonAdd,
  Subscriptions,
} from '@mui/icons-material';
import { bargainAPI } from '../Services/api';

const Bargains = () => {
  const [bargains, setBargains] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBargain, setSelectedBargain] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [currentBargain, setCurrentBargain] = useState({
    name: '',
    bargain_email: '',
    phone: '',
    address: '',
    commission_type: 'percentage',
    commission_rate: 0,
    subscription_plan: 'monthly',
    subscription_fee: 5000,
    subscription_start: new Date().toISOString().split('T')[0],
    subscription_end: '',
    status: 'active',
    user_name: '',
    user_email: '',
    password: '',
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

  // Fetch all bargains on component mount
  useEffect(() => {
    fetchBargains();
  }, []);

  // Fetch bargains from API
 const fetchBargains = async () => {
  try {
    // Agar pehle se data hai (refresh case), toh loading screen na dikhayein
    if (bargains.length === 0) setLoading(true);
    
    const response = await bargainAPI.getAll();
    let finalData = [];

    if (response.data?.data?.data) finalData = response.data.data.data;
    else if (response.data?.data) finalData = response.data.data;
    else if (Array.isArray(response.data)) finalData = response.data;

    setBargains(finalData);
  } catch (error) {
    showSnackbar('Failed to load bargains', 'error');
  } finally {
    setLoading(false);
  }
};

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Open Add Dialog
  const handleAddClick = () => {
    setEditMode(false);
    const startDate = new Date().toISOString().split('T')[0];
    setCurrentBargain({
      name: '',
      bargain_email: '',
      phone: '',
      address: '',
      purchase_commission_rate: 4,
      purchase_commission_type: 'percentage',
      sale_commission_rate: 3,
      sale_commission_type: 'percentage',
      subscription_plan: 'monthly',
      subscription_fee: 5000,
      subscription_start: startDate,
      subscription_end: calculateEndDate(startDate, 'monthly'),
      status: 'active',
      user_name: '',
      user_email: '',
      password: '',
    });
    setOpenDialog(true);
  };

  // Open Edit Dialog
  const handleEditClick = (bargain) => {
    setEditMode(true);
    setCurrentBargain({
      id: bargain.id,
      name: bargain.name || '',
      bargain_email: bargain.bargain_email || bargain.email || '',
      phone: bargain.phone || '',
      address: bargain.address || '',
      commission_rate: bargain.commission_rate || 0,
      commission_type: bargain.commission_type || 'percentage',
      subscription_plan: bargain.subscription_plan || 'monthly',
      subscription_fee: bargain.subscription_fee || 5000,
      subscription_start: bargain.subscription_start || new Date().toISOString().split('T')[0],
      subscription_end: bargain.subscription_end || '',
      status: bargain.status || 'active',
      user_name: bargain.user_name || bargain.manager_name || '',
      user_email: bargain.user_email || bargain.email || '',
      password: '', // Don't show password in edit mode
    });
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

  // Handle Form Submit (Create or Update)
const handleSubmit = async () => {
  try {
    const durationMap = {
      'monthly': 1,
      'quarterly': 3,
      'yearly': 12
    };

    const payload = {
      name: currentBargain.name,
      bargain_email: currentBargain.bargain_email,
      phone: currentBargain.phone,
      address: currentBargain.address,
      commission_type: currentBargain.commission_type,
      commission_rate: Number(currentBargain.commission_rate),
      user_name: currentBargain.user_name,
      user_email: currentBargain.user_email,
      subscription_start_date: currentBargain.subscription_start,
      subscription_duration_months: durationMap[currentBargain.subscription_plan],
      subscription_amount: Number(currentBargain.subscription_fee),
      status: currentBargain.status,
    };

    if (currentBargain.password && currentBargain.password.trim() !== '') {
      payload.password = currentBargain.password;
    }

    if (editMode) {
      // API call for update
      await bargainAPI.update(currentBargain.id, payload);
      showSnackbar('Bargain updated successfully!', 'success');
    } else {
      // API call for create
      await bargainAPI.create(payload);
      showSnackbar('Bargain created successfully!', 'success');
    }

    // 1. Dialog band karein
    setOpenDialog(false);

    // 2. Refresh data from server (Yeh relationships ko sahi load karega)
    // Isse 'undefined' wala masla foran hal ho jayega
    await fetchBargains();

  } catch (error) {
    console.error('Error saving bargain:', error);
    const errorMessage = error.response?.data?.message || 'Failed to save bargain';
    showSnackbar(errorMessage, 'error');
  }
};

// Delete Bargain
const handleDelete = async (id) => {
  if (window.confirm('Are you sure? This will delete all data for this bargain!')) {
    try {
      await bargainAPI.delete(id);
        setBargains(bargains.filter(b => b.id !== id));
        showSnackbar('Bargain deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting bargain:', error);
        showSnackbar('Failed to delete bargain', 'error');
      }
    }
  };

  // Toggle Status
  const handleToggleStatus = async (id) => {
    try {
      const response = await bargainAPI.toggleStatus(id);
      
      // Update local state
      setBargains(bargains.map(b => 
        b.id === id ? response.data.data : b
      ));
      
      showSnackbar('Status updated successfully!', 'success');
    } catch (error) {
      console.error('Error toggling status:', error);
      showSnackbar('Failed to update status', 'error');
    }
  };

  // Filter bargains
  const filteredBargains = Array.isArray(bargains) 
    ? bargains.filter(bargain => {
        if (!bargain) return false;
        
        const search = searchTerm.toLowerCase();
        const name = (bargain.name || '').toLowerCase();
        const manager = (bargain.user_name || bargain.manager_name || '').toLowerCase();
        const address = (bargain.address || '').toLowerCase();

        const matchesSearch = name.includes(search) || 
                              manager.includes(search) || 
                              address.includes(search);
        const matchesStatus = filterStatus === 'all' || bargain.status === filterStatus;
        
        return matchesSearch && matchesStatus;
      }) 
    : [];

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
  const totalRevenue = bargains.reduce((sum, b) => sum + (b.commission_earned || 0), 0);
  const monthlySubscription = activeBargains * 5000;

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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
            placeholder="Search by name, manager, or address..."
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
                      <p className="text-sm text-gray-500">{bargain.address}</p>
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
                    <span className="text-gray-700">{bargain.user_name || bargain.manager_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="text-gray-400" fontSize="small" />
                    <span className="text-gray-700">{bargain.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Email className="text-gray-400" fontSize="small" />
                    <span className="text-gray-700">{bargain.bargain_email || bargain.email}</span>
                  </div>
                </div>

                {/* Commission Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-blue-600">Purchase Rate</p>
                    <p className="text-sm font-bold text-blue-700">
                      {bargain.purchase_commission_type === 'percentage' 
                        ? `${bargain.purchase_commission_rate}%`
                        : `PKR ${bargain.purchase_commission_rate}`
                      }
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs text-green-600">Sale Rate</p>
                    <p className="text-sm font-bold text-green-700">
                      {bargain.sale_commission_type === 'percentage' 
                        ? `${bargain.sale_commission_rate}%`
                        : `PKR ${bargain.sale_commission_rate}`
                      }
                    </p>
                  </div>
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
            {/* Bargain Information Section */}
            <Grid item xs={12}>
              <div className="flex items-center gap-2 mb-2">
                <Business className="text-blue-600" />
                <h3 className="font-semibold text-gray-800">Bargain Information</h3>
              </div>
              <Divider />
            </Grid>

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
                label="Bargain Email"
                value={currentBargain.bargain_email}
                onChange={(e) => setCurrentBargain({...currentBargain, bargain_email: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                type="tel"
                value={currentBargain.phone}
                onChange={(e) => setCurrentBargain({...currentBargain, phone: e.target.value})}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Address"
                value={currentBargain.address}
                onChange={(e) => setCurrentBargain({...currentBargain, address: e.target.value})}
                required
                fullWidth
              />
            </Grid>

            {/* Commission Section */}
            <Grid item xs={12} className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AttachMoney className="text-purple-600" />
                <h3 className="font-semibold text-gray-800">Commission Details</h3>
              </div>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Commission Type</InputLabel>
                <Select
                  value={currentBargain.commission_type}
                  label="Commission Type"
                  onChange={(e) => setCurrentBargain({...currentBargain, commission_type: e.target.value})}
                >
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Commission Rate"
                type="number"
                value={currentBargain.commission_rate}
                onChange={(e) => setCurrentBargain({...currentBargain, commission_rate: e.target.value})}
                required
                fullWidth
              />
            </Grid>

            {/* Subscription Section */}
            <Grid item xs={12} className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AttachMoney className="text-purple-600" />
                <h3 className="font-semibold text-gray-800">Subscription Details</h3>
              </div>
              <Divider />
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

            {/* User Account Section */}
            <Grid item xs={12} className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <PersonAdd className="text-green-600" />
                <h3 className="font-semibold text-gray-800">Manager Login Account</h3>
              </div>
              <Divider />
              <Alert severity="info" className="mt-2">
                {editMode 
                  ? "Leave password empty to keep the current password unchanged."
                  : "This account will be created for the manager to access the system."
                }
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Login Username (Full Name)"
                value={currentBargain.user_name}
                onChange={(e) => setCurrentBargain({...currentBargain, user_name: e.target.value})}
                required={!editMode}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Login Email"
                type="email"
                value={currentBargain.user_email}
                onChange={(e) => setCurrentBargain({...currentBargain, user_email: e.target.value})}
                required={!editMode}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label={editMode ? "New Password (Optional)" : "Set Password"}
                type="password"
                value={currentBargain.password}
                onChange={(e) => setCurrentBargain({...currentBargain, password: e.target.value})}
                required={!editMode}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                helperText={editMode ? "Leave empty to keep current password" : "Minimum 8 characters"}
              />
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
            {editMode ? 'Update' : 'Create'} Bargain
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
                  <p className="font-semibold">{selectedBargain.user_name || selectedBargain.manager_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold">{selectedBargain.bargain_email || selectedBargain.email}</p>
                  <p className="font-semibold">{selectedBargain.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{selectedBargain.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Commission Rates</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-blue-600">Purchase</p>
                      <p className="text-lg font-bold text-blue-700">
                        {selectedBargain.purchase_commission_type === 'percentage' 
                          ? `${selectedBargain.purchase_commission_rate}%`
                          : `PKR ${selectedBargain.purchase_commission_rate}`
                        }
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs text-green-600">Sale</p>
                      <p className="text-lg font-bold text-green-700">
                        {selectedBargain.sale_commission_type === 'percentage' 
                          ? `${selectedBargain.sale_commission_rate}%`
                          : `PKR ${selectedBargain.sale_commission_rate}`
                        }
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