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
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  ShoppingCart,
  Person,
  DirectionsCar,
  Payment,
  AccountBalance,
  Info,
  CheckCircle,
  Pending,
} from '@mui/icons-material';
import { dummyPurchases, dummyCustomers, commissionSettings } from '../Utils/dummyData';

const Purchases = () => {
  const [purchases, setPurchases] = useState(dummyPurchases);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPurchase, setCurrentPurchase] = useState({
    customer_id: '',
    vehicle_name: '',
    purchase_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
    payment_type: 'cash',
    installment_months: 3,
    down_payment: '',
    notes: '',
  });

  // Calculate commission and installments
  const calculateFinancials = () => {
    const price = Number(currentPurchase.purchase_price) || 0;
    
    // Calculate commission
    let commission = 0;
    if (commissionSettings.purchase_type === 'percentage') {
      commission = (price * commissionSettings.purchase_value) / 100;
    } else {
      commission = commissionSettings.purchase_value;
    }

    const net_amount = price - commission;

    // Calculate installments if applicable
    let down_payment = 0;
    let monthly_amount = 0;

    if (currentPurchase.payment_type === 'installment') {
      down_payment = Number(currentPurchase.down_payment) || 0;
      const remaining = net_amount - down_payment;
      monthly_amount = remaining / currentPurchase.installment_months;
    }

    return {
      commission: Math.round(commission),
      net_amount: Math.round(net_amount),
      down_payment: Math.round(down_payment),
      monthly_amount: Math.round(monthly_amount),
    };
  };

  const financials = calculateFinancials();

  // Open Add Dialog
  const handleAddClick = () => {
    setCurrentPurchase({
      customer_id: '',
      vehicle_name: '',
      purchase_price: '',
      purchase_date: new Date().toISOString().split('T')[0],
      payment_type: 'cash',
      installment_months: 3,
      down_payment: '',
      notes: '',
    });
    setOpenDialog(true);
  };

  // Handle Form Submit
  const handleSubmit = () => {
    const customer = dummyCustomers.find(c => c.id === Number(currentPurchase.customer_id));
    
    const newPurchase = {
      id: purchases.length + 1,
      ...currentPurchase,
      customer_name: customer?.name || 'Unknown',
      commission: financials.commission,
      net_amount: financials.net_amount,
      status: currentPurchase.payment_type === 'cash' ? 'completed' : 'active',
      created_at: currentPurchase.purchase_date,
    };

    if (currentPurchase.payment_type === 'installment') {
      newPurchase.down_payment = financials.down_payment;
      newPurchase.monthly_amount = financials.monthly_amount;
    }

    setPurchases([newPurchase, ...purchases]);
    setOpenDialog(false);
  };

  // Delete Purchase
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      setPurchases(purchases.filter(p => p.id !== id));
    }
  };

  // Filter purchases
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          purchase.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || purchase.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      completed: { color: 'success', icon: <CheckCircle />, label: 'Completed' },
      active: { color: 'primary', icon: <Pending />, label: 'Active' },
    };
    return config[status] || config.active;
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
          <p className="text-gray-600 mt-1">Manage vehicle purchases from customers</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          style={{ backgroundColor: '#2563eb' }}
        >
          New Purchase
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-800">{purchases.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {(purchases.reduce((sum, p) => sum + p.purchase_price, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <AccountBalance className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Commission Earned</p>
              <p className="text-2xl font-bold text-purple-600">
                {(purchases.reduce((sum, p) => sum + p.commission, 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Payment className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-2xl font-bold text-orange-600">
                {purchases.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Pending className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <TextField
            placeholder="Search by customer or vehicle..."
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
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="active">Active</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => {
                const statusConfig = getStatusConfig(purchase.status);
                return (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Person className="text-gray-400" fontSize="small" />
                        <span className="font-medium text-gray-900">{purchase.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DirectionsCar className="text-gray-400" fontSize="small" />
                        <span className="text-gray-800">{purchase.vehicle_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      PKR {purchase.purchase_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-purple-600">
                      PKR {purchase.commission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Chip 
                        label={purchase.payment_type === 'cash' ? 'Cash' : `${purchase.installment_months} Months`}
                        color={purchase.payment_type === 'cash' ? 'success' : 'warning'}
                        size="small"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Chip 
                        label={statusConfig.label}
                        color={statusConfig.color}
                        size="small"
                        icon={statusConfig.icon}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <IconButton size="small" color="primary">
                          <Info fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(purchase.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredPurchases.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No purchases found
            </div>
          )}
        </div>
      </div>

      {/* Add Purchase Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Purchase</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            {/* Customer Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Customer (Seller)</InputLabel>
                <Select
                  value={currentPurchase.customer_id}
                  label="Select Customer (Seller)"
                  onChange={(e) => setCurrentPurchase({...currentPurchase, customer_id: e.target.value})}
                >
                  {dummyCustomers.filter(c => c.type === 'seller' || c.type === 'both').map(customer => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Vehicle Details */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Vehicle Name"
                placeholder="e.g., Honda Civic 2020"
                value={currentPurchase.vehicle_name}
                onChange={(e) => setCurrentPurchase({...currentPurchase, vehicle_name: e.target.value})}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Purchase Date"
                type="date"
                value={currentPurchase.purchase_date}
                onChange={(e) => setCurrentPurchase({...currentPurchase, purchase_date: e.target.value})}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Purchase Price */}
            <Grid item xs={12}>
              <TextField
                label="Purchase Price"
                type="number"
                value={currentPurchase.purchase_price}
                onChange={(e) => setCurrentPurchase({...currentPurchase, purchase_price: e.target.value})}
                required
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                }}
              />
            </Grid>

            {/* Commission Display */}
            {currentPurchase.purchase_price && (
              <Grid item xs={12}>
                <Alert severity="info" icon={<Info />}>
                  <div className="space-y-1">
                    <p><strong>Commission ({commissionSettings.purchase_value}%):</strong> PKR {financials.commission.toLocaleString()}</p>
                    <p><strong>Net Amount (After Commission):</strong> PKR {financials.net_amount.toLocaleString()}</p>
                  </div>
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Payment Type */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Payment Type</FormLabel>
                <RadioGroup
                  row
                  value={currentPurchase.payment_type}
                  onChange={(e) => setCurrentPurchase({...currentPurchase, payment_type: e.target.value})}
                >
                  <FormControlLabel value="cash" control={<Radio />} label="Cash Payment" />
                  <FormControlLabel value="installment" control={<Radio />} label="Installment" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Installment Details */}
            {currentPurchase.payment_type === 'installment' && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Installment Period</InputLabel>
                    <Select
                      value={currentPurchase.installment_months}
                      label="Installment Period"
                      onChange={(e) => setCurrentPurchase({...currentPurchase, installment_months: e.target.value})}
                    >
                      <MenuItem value={3}>3 Months</MenuItem>
                      <MenuItem value={4}>4 Months</MenuItem>
                      <MenuItem value={5}>5 Months</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Down Payment"
                    type="number"
                    value={currentPurchase.down_payment}
                    onChange={(e) => setCurrentPurchase({...currentPurchase, down_payment: e.target.value})}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                    }}
                  />
                </Grid>

                {currentPurchase.down_payment && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      <div className="space-y-1">
                        <p><strong>Down Payment:</strong> PKR {financials.down_payment.toLocaleString()}</p>
                        <p><strong>Monthly Installment:</strong> PKR {financials.monthly_amount.toLocaleString()} × {currentPurchase.installment_months} months</p>
                        <p><strong>Total Remaining:</strong> PKR {(financials.monthly_amount * currentPurchase.installment_months).toLocaleString()}</p>
                      </div>
                    </Alert>
                  </Grid>
                )}
              </>
            )}

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                label="Notes (Optional)"
                value={currentPurchase.notes}
                onChange={(e) => setCurrentPurchase({...currentPurchase, notes: e.target.value})}
                fullWidth
                multiline
                rows={2}
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
            disabled={!currentPurchase.customer_id || !currentPurchase.vehicle_name || !currentPurchase.purchase_price}
          >
            Save Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Purchases;