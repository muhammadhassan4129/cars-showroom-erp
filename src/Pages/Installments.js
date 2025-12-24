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
  Alert,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  Search,
  Payment,
  CheckCircle,
  Pending,
  Warning,
  Person,
  DirectionsCar,
  CalendarToday,
  AttachMoney,
  Info,
  Receipt,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { dummyInstallments } from '../Utils/dummyData';

const Installments = () => {
  const [installments, setInstallments] = useState(dummyInstallments);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentData, setPaymentData] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    payment_amount: '',
    receipt_number: '',
    notes: '',
  });

  // Open Payment Dialog
  const handlePaymentClick = (installment) => {
    setSelectedInstallment(installment);
    setPaymentData({
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      payment_amount: installment.installment_amount,
      receipt_number: '',
      notes: '',
    });
    setOpenPaymentDialog(true);
  };

  // Submit Payment
  const handlePaymentSubmit = () => {
    setInstallments(installments.map(inst => 
      inst.id === selectedInstallment.id 
        ? { 
            ...inst, 
            status: 'paid', 
            payment_date: paymentData.payment_date,
            paid_amount: inst.paid_amount + Number(paymentData.payment_amount)
          }
        : inst
    ));
    setOpenPaymentDialog(false);
  };

  // Check if overdue
  const isOverdue = (dueDate, status) => {
    if (status === 'paid') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  // Filter installments
  const filteredInstallments = installments.filter(inst => {
    const matchesSearch = inst.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inst.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || inst.type === filterType;
    
    let matchesStatus = true;
    if (filterStatus === 'overdue') {
      matchesStatus = isOverdue(inst.due_date, inst.status);
    } else if (filterStatus !== 'all') {
      matchesStatus = inst.status === filterStatus;
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  // Separate by tab
  const pendingInstallments = filteredInstallments.filter(i => i.status === 'pending' || isOverdue(i.due_date, i.status));
  const paidInstallments = filteredInstallments.filter(i => i.status === 'paid');

  const displayInstallments = tabValue === 0 ? pendingInstallments : paidInstallments;

  // Get status config
  const getStatusConfig = (installment) => {
    if (installment.status === 'paid') {
      return { color: 'success', icon: <CheckCircle />, label: 'Paid' };
    }
    if (isOverdue(installment.due_date, installment.status)) {
      return { color: 'error', icon: <Warning />, label: 'Overdue' };
    }
    return { color: 'warning', icon: <Pending />, label: 'Pending' };
  };

  // Calculate stats
  const totalPending = installments.filter(i => i.status === 'pending' || isOverdue(i.due_date, i.status))
    .reduce((sum, i) => sum + i.installment_amount, 0);
  const totalPaid = installments.filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.installment_amount, 0);
  const overdueCount = installments.filter(i => isOverdue(i.due_date, i.status)).length;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Installments</h1>
        <p className="text-gray-600 mt-1">Track and manage payment installments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Installments</p>
              <p className="text-2xl font-bold text-gray-800">{installments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-orange-600">
                {(totalPending / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Collected Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {(totalPaid / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Warning className="text-red-600" />
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
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              label="Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="purchase">Purchase</MenuItem>
              <MenuItem value="sale">Sale</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" className="min-w-[150px]">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab 
              label={`Pending (${pendingInstallments.length})`} 
              icon={<Pending />}
              iconPosition="start"
            />
            <Tab 
              label={`Paid (${paidInstallments.length})`}
              icon={<CheckCircle />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Installments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Installment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayInstallments.map((installment) => {
                const statusConfig = getStatusConfig(installment);
                return (
                  <tr key={installment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Chip 
                        label={installment.type.toUpperCase()}
                        color={installment.type === 'sale' ? 'success' : 'primary'}
                        size="small"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Person className="text-gray-400" fontSize="small" />
                        <span className="font-medium text-gray-900">{installment.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DirectionsCar className="text-gray-400" fontSize="small" />
                        <span className="text-gray-800">{installment.vehicle_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        #{installment.installment_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      PKR {installment.installment_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <CalendarToday fontSize="small" className="text-gray-400" />
                        <span className={isOverdue(installment.due_date, installment.status) ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                          {new Date(installment.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Chip 
                        label={statusConfig.label}
                        color={statusConfig.color}
                        size="small"
                        icon={statusConfig.icon}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {installment.status !== 'paid' && (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<Payment />}
                            onClick={() => handlePaymentClick(installment)}
                          >
                            Collect
                          </Button>
                        )}
                        {installment.status === 'paid' && (
                          <IconButton size="small" color="primary">
                            <Info fontSize="small" />
                          </IconButton>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {displayInstallments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No installments found
            </div>
          )}
        </div>
      </div>

      {/* Payment Collection Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Collect Payment</DialogTitle>
        <DialogContent>
          {selectedInstallment && (
            <>
              <Alert severity="info" className="mb-4 mt-2">
                <div className="space-y-1">
                  <p><strong>Customer:</strong> {selectedInstallment.customer_name}</p>
                  <p><strong>Vehicle:</strong> {selectedInstallment.vehicle_name}</p>
                  <p><strong>Installment:</strong> #{selectedInstallment.installment_number}</p>
                  <p><strong>Amount Due:</strong> PKR {selectedInstallment.installment_amount.toLocaleString()}</p>
                </div>
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Payment Amount"
                    type="number"
                    value={paymentData.payment_amount}
                    onChange={(e) => setPaymentData({...paymentData, payment_amount: e.target.value})}
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
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
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
            Collect Payment
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Installments;