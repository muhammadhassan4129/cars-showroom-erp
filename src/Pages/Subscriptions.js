import React, { useState } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
} from '@mui/material';
import {
  Search,
  Payment,
  CheckCircle,
  Warning,
  Cancel,
  Visibility,
  AttachMoney,
  CalendarToday,
  TrendingUp,
  Business,
} from '@mui/icons-material';
import { dummyBargains } from '../Utils/dummyData';

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedBargain, setSelectedBargain] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer',
    receipt_number: '',
    notes: '',
  });

  // Check subscription status
  const getSubscriptionStatus = (bargain) => {
    const today = new Date();
    const endDate = new Date(bargain.subscription_end);
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (bargain.status === 'suspended') {
      return { status: 'suspended', daysLeft: 0, label: 'Suspended', color: 'default' };
    }
    if (daysLeft < 0) {
      return { status: 'expired', daysLeft, label: 'Expired', color: 'error' };
    }
    if (daysLeft <= 7) {
      return { status: 'expiring', daysLeft, label: `Expiring Soon (${daysLeft}d)`, color: 'warning' };
    }
    return { status: 'active', daysLeft, label: `Active (${daysLeft}d left)`, color: 'success' };
  };

  // Open Payment Dialog
  const handlePaymentClick = (bargain) => {
    setSelectedBargain(bargain);
    setPaymentData({
      amount: bargain.subscription_fee,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'bank_transfer',
      receipt_number: '',
      notes: '',
    });
    setOpenPaymentDialog(true);
  };

  // Handle Payment Submit
  const handlePaymentSubmit = () => {
    // In real app, this would save to backend and extend subscription
    alert('Payment recorded successfully! Subscription extended.');
    setOpenPaymentDialog(false);
  };

  // Filter bargains
  const filteredBargains = dummyBargains.filter(bargain => {
    const matchesSearch = bargain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bargain.manager_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const subStatus = getSubscriptionStatus(bargain);
    if (filterStatus === 'expiring') {
      return matchesSearch && (subStatus.status === 'expiring' || subStatus.status === 'expired');
    }
    return matchesSearch && subStatus.status === filterStatus;
  });

  // Calculate stats
  const totalSubscriptions = dummyBargains.length;
  const activeSubscriptions = dummyBargains.filter(b => {
    const status = getSubscriptionStatus(b);
    return status.status === 'active';
  }).length;
  const expiringSubscriptions = dummyBargains.filter(b => {
    const status = getSubscriptionStatus(b);
    return status.status === 'expiring' || status.status === 'expired';
  }).length;
  const monthlyRevenue = dummyBargains
    .filter(b => getSubscriptionStatus(b).status === 'active')
    .reduce((sum, b) => sum + b.subscription_fee, 0);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage bargain subscriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-800">{totalSubscriptions}</p>
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
                <p className="text-gray-500 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeSubscriptions}</p>
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
                <p className="text-gray-500 text-sm">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{expiringSubscriptions}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Warning className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  PKR {(monthlyRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <TextField
            placeholder="Search by bargain name or manager..."
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
              <MenuItem value="expiring">Expiring Soon</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bargain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBargains.map((bargain) => {
                  const subStatus = getSubscriptionStatus(bargain);
                  return (
                    <tr key={bargain.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{bargain.name}</p>
                          <p className="text-sm text-gray-500">{bargain.manager_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Chip 
                          label={bargain.subscription_plan.toUpperCase()}
                          color="primary"
                          size="small"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        PKR {bargain.subscription_fee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <CalendarToday fontSize="small" className="text-gray-400" />
                          {new Date(bargain.subscription_start).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <CalendarToday fontSize="small" className="text-gray-400" />
                          {new Date(bargain.subscription_end).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Chip 
                          label={subStatus.label}
                          color={subStatus.color}
                          size="small"
                          icon={
                            subStatus.status === 'active' ? <CheckCircle /> :
                            subStatus.status === 'expiring' ? <Warning /> : <Cancel />
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {(subStatus.status === 'expiring' || subStatus.status === 'expired') && (
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              startIcon={<Payment />}
                              onClick={() => handlePaymentClick(bargain)}
                            >
                              Renew
                            </Button>
                          )}
                          <IconButton size="small" color="primary">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredBargains.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No subscriptions found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Renew Subscription</DialogTitle>
        <DialogContent>
          {selectedBargain && (
            <>
              <Alert severity="info" className="mb-4 mt-2">
                <div className="space-y-1">
                  <p><strong>Bargain:</strong> {selectedBargain.name}</p>
                  <p><strong>Current Plan:</strong> {selectedBargain.subscription_plan}</p>
                  <p><strong>Subscription Fee:</strong> PKR {selectedBargain.subscription_fee.toLocaleString()}</p>
                </div>
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Payment Amount"
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Payment Date"
                    type="date"
                    value={paymentData.payment_date}
                    onChange={(e) => setPaymentData({...paymentData, payment_date: e.target.value})}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentData.payment_method}
                      label="Payment Method"
                      onChange={(e) => setPaymentData({...paymentData, payment_method: e.target.value})}
                    >
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="cheque">Cheque</MenuItem>
                      <MenuItem value="online">Online Payment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Receipt Number (Optional)"
                    value={paymentData.receipt_number}
                    onChange={(e) => setPaymentData({...paymentData, receipt_number: e.target.value})}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Notes (Optional)"
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePaymentSubmit} 
            variant="contained" 
            color="success"
            startIcon={<Payment />}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Subscriptions;