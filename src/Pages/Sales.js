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
  Delete,
  Search,
  Sell,
  Person,
  DirectionsCar,
  Payment,
  AccountBalance,
  Info,
  CheckCircle,
  Pending,
  TrendingUp,
} from '@mui/icons-material';
import { dummySales, dummyCustomers, dummyVehicles, commissionSettings } from '../Utils/dummyData';

const Sales = () => {
  const [sales, setSales] = useState(dummySales);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentSale, setCurrentSale] = useState({
    customer_id: '',
    vehicle_id: '',
    sale_price: '',
    sale_date: new Date().toISOString().split('T')[0],
    payment_type: 'cash',
    installment_months: 3,
    down_payment: '',
    notes: '',
  });

  // Get available vehicles (not sold)
  const availableVehicles = dummyVehicles.filter(v => v.status === 'available');

  // Calculate commission and installments
  const calculateFinancials = () => {
    const price = Number(currentSale.sale_price) || 0;
    
    // Calculate commission (for sales)
    let commission = 0;
    if (commissionSettings.sale_type === 'percentage') {
      commission = (price * commissionSettings.sale_value) / 100;
    } else {
      commission = commissionSettings.sale_value;
    }

    const net_amount = price - commission;

    // Calculate installments if applicable
    let down_payment = 0;
    let monthly_amount = 0;

    if (currentSale.payment_type === 'installment') {
      down_payment = Number(currentSale.down_payment) || 0;
      const remaining = net_amount - down_payment;
      monthly_amount = remaining / currentSale.installment_months;
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
    setCurrentSale({
      customer_id: '',
      vehicle_id: '',
      sale_price: '',
      sale_date: new Date().toISOString().split('T')[0],
      payment_type: 'cash',
      installment_months: 3,
      down_payment: '',
      notes: '',
    });
    setOpenDialog(true);
  };

  // Handle Vehicle Selection (Auto-fill price)
  const handleVehicleChange = (vehicleId) => {
    const vehicle = dummyVehicles.find(v => v.id === Number(vehicleId));
    setCurrentSale({
      ...currentSale,
      vehicle_id: vehicleId,
      sale_price: vehicle?.sale_price || '',
    });
  };

  // Handle Form Submit
  const handleSubmit = () => {
    const customer = dummyCustomers.find(c => c.id === Number(currentSale.customer_id));
    const vehicle = dummyVehicles.find(v => v.id === Number(currentSale.vehicle_id));
    
    const newSale = {
      id: sales.length + 1,
      ...currentSale,
      customer_name: customer?.name || 'Unknown',
      vehicle_name: vehicle?.name + ' ' + vehicle?.model || 'Unknown Vehicle',
      commission: financials.commission,
      net_amount: financials.net_amount,
      status: currentSale.payment_type === 'cash' ? 'completed' : 'active',
      created_at: currentSale.sale_date,
    };

    if (currentSale.payment_type === 'installment') {
      newSale.down_payment = financials.down_payment;
      newSale.monthly_amount = financials.monthly_amount;
    }

    setSales([newSale, ...sales]);
    setOpenDialog(false);
  };

  // Delete Sale
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      setSales(sales.filter(s => s.id !== id));
    }
  };

  // Filter sales
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
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

  // Calculate total profit (sale commission - purchase commission)
  const totalProfit = sales.reduce((sum, s) => sum + s.commission, 0);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
          <p className="text-gray-600 mt-1">Manage vehicle sales to customers</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          style={{ backgroundColor: '#2563eb' }}
        >
          New Sale
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sell className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {(sales.reduce((sum, s) => sum + s.sale_price, 0) / 1000000).toFixed(1)}M
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
              <p className="text-2xl font-bold text-blue-600">
                {(totalProfit / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Sales</p>
              <p className="text-2xl font-bold text-orange-600">
                {sales.filter(s => s.status === 'active').length}
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

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((sale) => {
                const statusConfig = getStatusConfig(sale.status);
                return (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Person className="text-gray-400" fontSize="small" />
                        <span className="font-medium text-gray-900">{sale.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DirectionsCar className="text-gray-400" fontSize="small" />
                        <span className="text-gray-800">{sale.vehicle_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      PKR {sale.sale_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      PKR {sale.commission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      PKR {sale.net_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Chip 
                        label={sale.payment_type === 'cash' ? 'Cash' : `${sale.installment_months} Months`}
                        color={sale.payment_type === 'cash' ? 'success' : 'warning'}
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
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <IconButton size="small" color="primary">
                          <Info fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(sale.id)}
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

          {filteredSales.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No sales found
            </div>
          )}
        </div>
      </div>

      {/* Add Sale Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Sale</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            {/* Customer Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Customer (Buyer)</InputLabel>
                <Select
                  value={currentSale.customer_id}
                  label="Select Customer (Buyer)"
                  onChange={(e) => setCurrentSale({...currentSale, customer_id: e.target.value})}
                >
                  {dummyCustomers.filter(c => c.type === 'buyer' || c.type === 'both').map(customer => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Vehicle Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Vehicle</InputLabel>
                <Select
                  value={currentSale.vehicle_id}
                  label="Select Vehicle"
                  onChange={(e) => handleVehicleChange(e.target.value)}
                >
                  {availableVehicles.map(vehicle => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} {vehicle.model} - {vehicle.registration} (PKR {vehicle.sale_price.toLocaleString()})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {availableVehicles.length === 0 && (
                <Alert severity="warning" className="mt-2">
                  No available vehicles for sale. Please add vehicles first.
                </Alert>
              )}
            </Grid>

            {/* Sale Price & Date */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Sale Price"
                type="number"
                value={currentSale.sale_price}
                onChange={(e) => setCurrentSale({...currentSale, sale_price: e.target.value})}
                required
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Sale Date"
                type="date"
                value={currentSale.sale_date}
                onChange={(e) => setCurrentSale({...currentSale, sale_date: e.target.value})}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Commission Display */}
            {currentSale.sale_price && (
              <Grid item xs={12}>
                <Alert severity="info" icon={<Info />}>
                  <div className="space-y-1">
                    <p><strong>Commission ({commissionSettings.sale_value}%):</strong> PKR {financials.commission.toLocaleString()}</p>
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
                  value={currentSale.payment_type}
                  onChange={(e) => setCurrentSale({...currentSale, payment_type: e.target.value})}
                >
                  <FormControlLabel value="cash" control={<Radio />} label="Cash Payment" />
                  <FormControlLabel value="installment" control={<Radio />} label="Installment" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Installment Details */}
            {currentSale.payment_type === 'installment' && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Installment Period</InputLabel>
                    <Select
                      value={currentSale.installment_months}
                      label="Installment Period"
                      onChange={(e) => setCurrentSale({...currentSale, installment_months: e.target.value})}
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
                    value={currentSale.down_payment}
                    onChange={(e) => setCurrentSale({...currentSale, down_payment: e.target.value})}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                    }}
                  />
                </Grid>

                {currentSale.down_payment && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      <div className="space-y-1">
                        <p><strong>Down Payment:</strong> PKR {financials.down_payment.toLocaleString()}</p>
                        <p><strong>Monthly Installment:</strong> PKR {financials.monthly_amount.toLocaleString()} × {currentSale.installment_months} months</p>
                        <p><strong>Total Remaining:</strong> PKR {(financials.monthly_amount * currentSale.installment_months).toLocaleString()}</p>
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
                value={currentSale.notes}
                onChange={(e) => setCurrentSale({...currentSale, notes: e.target.value})}
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
            disabled={!currentSale.customer_id || !currentSale.vehicle_id || !currentSale.sale_price}
          >
            Save Sale
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Sales;