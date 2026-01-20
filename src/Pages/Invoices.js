import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import { invoiceAPI, vehicleAPI, customerAPI } from '../Services/api';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Chip, Grid, Snackbar, CircularProgress, InputAdornment
} from '@mui/material';
import { Add, Edit, Delete, Receipt, Search, AttachMoney, CalendarToday, Note } from '@mui/icons-material';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterPaymentType, setFilterPaymentType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [currentInvoice, setCurrentInvoice] = useState({
    vehicle_id: '',
    buyer_id: '',
    seller_id: '',
    amount: '',
    commission_amount: '',
    payment_type: 'full',
    installment_months: 0,
    inv_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [invRes, vehRes, custRes] = await Promise.all([
        invoiceAPI.getAll(),
        vehicleAPI.getAll(),
        customerAPI.getAll()
      ]);

      setInvoices(invRes.data?.data?.data || invRes.data?.data || invRes.data || []);
      setVehicles(vehRes.data?.data?.data || vehRes.data?.data || vehRes.data || []);
      setCustomers(custRes.data?.data?.data || custRes.data?.data || custRes.data || []);
    } catch (error) {
      showSnackbar('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddClick = () => {
    setEditMode(false);
    setCurrentInvoice({
      vehicle_id: '', buyer_id: '', seller_id: '',
      amount: '', payment_type: 'full', installment_months: 0,
      inv_date: new Date().toISOString().split('T')[0], notes: ''
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      // Backend Payload Mapping
      const payload = {
        ...currentInvoice,
        amount: Number(currentInvoice.amount),
        installment_months: currentInvoice.payment_type === 'installment' ? Number(currentInvoice.installment_months) : 0
      };

      if (editMode) {
        const res = await invoiceAPI.update(currentInvoice.id, payload);
        setInvoices(prev => prev.map(inv => inv.id === currentInvoice.id ? (res.data.data || res.data) : inv));
        showSnackbar('Invoice updated successfully');
      } else {
        const res = await invoiceAPI.create(payload);
        setInvoices(prev => [res.data.data || res.data, ...prev]);
        showSnackbar('Invoice created successfully');
      }
      setOpenDialog(false);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving invoice', 'error');
    }
  };

    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this invoice?')) {
        try {
          await invoiceAPI.delete(id);
          setInvoices(prev => prev.filter(inv => inv.id !== id));
          showSnackbar('Invoice deleted successfully!');
        } catch (error) {
          showSnackbar('Failed to delete invoice', 'error');
        }
      }
    };

    // Filter Logic: Isse table mapping se pehle rakhein
const filteredInvoices = invoices.filter(inv => {
  const search = searchTerm.toLowerCase();
  
  // Safe string conversion for search
  const vehicleName = (inv.vehicle?.make + " " + inv.vehicle?.model || '').toLowerCase();
  const buyerName = (inv.buyer?.name || '').toLowerCase();
  const sellerName = (inv.seller?.name || '').toLowerCase();
  const invNum = (inv.invoice_number || '').toLowerCase();

  const matchesSearch = vehicleName.includes(search) || 
                        buyerName.includes(search) || 
                        sellerName.includes(search) || 
                        invNum.includes(search);

  const matchesType = filterPaymentType === 'all' || inv.payment_type === filterPaymentType;

  return matchesSearch && matchesType;
});

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage sales and purchase invoices</p>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick} className="bg-blue-600">
          Create Invoice
        </Button>
      </div>

        {/* Search & Filter Bar */}
<div className="bg-white rounded-lg shadow-md p-4 mb-6">
  <div className="flex gap-4 flex-wrap">
    <TextField
      placeholder="Search by vehicle, buyer, seller or INV#..."
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
    <FormControl size="small" className="min-w-[180px]">
      <InputLabel>Payment Method</InputLabel>
      <Select
        value={filterPaymentType}
        label="Payment Method"
        onChange={(e) => setFilterPaymentType(e.target.value)}
      >
        <MenuItem value="all">All Methods</MenuItem>
        <MenuItem value="cash">Cash</MenuItem>
        <MenuItem value="installment">Installment</MenuItem>
      </Select>
    </FormControl>
  </div>
  <div className="mt-2 text-xs text-gray-500 italic">
    Showing {filteredInvoices.length} results
  </div>
</div>

      {/* Invoice Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">INV Number</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Seller</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Buyer</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Commission</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total Amount</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Paid Amount</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Remaining Amount</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Payment Type</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Invoice Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  <div className="font-medium">{inv.invoice_number}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{inv.vehicle?.name || `ID: ${inv.vehicle_id}`}</td>
                 <td className="px-6 py-4 text-sm">
                  <div className="text-red-600">{inv.seller?.name || inv.seller_id}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-blue-600">{inv.buyer?.name || inv.buyer_id}</div>
                </td>
               
                <td className="px-6 py-4 text-sm font-bold">{inv.amount?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-bold ">{inv.commission_amount?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-bold text-green-600">{inv.net_amount?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-bold ">{inv.paid_amount?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-bold text-red-600">{inv.remaining_amount?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Chip label={inv.payment_type?.toUpperCase()} size="small" color={inv.payment_type === 'installment' ? 'secondary' : 'primary'} />
                </td>
                <td className="px-6 py-4 text-sm">{inv.inv_date}</td>
                <td className="px-6 py-4 text-center">
                  <IconButton onClick={() => { setEditMode(true); setCurrentInvoice(inv); setOpenDialog(true); }} color="primary"><Edit /></IconButton>
                  <IconButton className="text-red-600" onClick={() => handleDelete(inv.id)}><Delete /></IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Invoice' : 'New Invoice'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} className="mt-1">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle</InputLabel>
                <Select
                  value={currentInvoice.vehicle_id}
                  label="Vehicle"
                  onChange={(e) => setCurrentInvoice({...currentInvoice, vehicle_id: e.target.value})}
                >
                  {vehicles.map(v => (
                    <MenuItem key={v.id} value={v.id}>{v.make} {v.model} ({v.registration_number})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Buyer</InputLabel>
                <Select
                  value={currentInvoice.buyer_id}
                  label="Buyer"
                  onChange={(e) => setCurrentInvoice({...currentInvoice, buyer_id: e.target.value})}
                >
                  {customers.filter(c => c.type !== 'seller').map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Seller</InputLabel>
                <Select
                  value={currentInvoice.seller_id}
                  label="Seller"
                  onChange={(e) => setCurrentInvoice({...currentInvoice, seller_id: e.target.value})}
                >
                  {customers.filter(c => c.type !== 'buyer').map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Total Amount" type="number" fullWidth required
                value={currentInvoice.amount}
                onChange={(e) => setCurrentInvoice({...currentInvoice, amount: e.target.value})}
                InputProps={{ startAdornment: <InputAdornment position="start">PKR</InputAdornment> }}
              />
            </Grid>
             <Grid item xs={12} md={6}>
              <TextField
                label="Commission Amount" type="number" fullWidth required
                value={currentInvoice.commission_amount}
                onChange={(e) => setCurrentInvoice({...currentInvoice, commission_amount: e.target.value})}
                InputProps={{ startAdornment: <InputAdornment position="start">PKR</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={currentInvoice.payment_type}
                  label="Payment Type"
                  onChange={(e) => setCurrentInvoice({...currentInvoice, payment_type: e.target.value})}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="installment">Installment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {currentInvoice.payment_type === 'installment' && (
              <Grid item xs={12} md={3}>
                <TextField
                  label="Months" type="number" fullWidth
                  value={currentInvoice.installment_months}
                  onChange={(e) => setCurrentInvoice({...currentInvoice, installment_months: e.target.value})}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                label="Invoice Date" type="date" fullWidth required
                value={currentInvoice.inv_date}
                onChange={(e) => setCurrentInvoice({...currentInvoice, inv_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes" multiline rows={3} fullWidth
                value={currentInvoice.notes}
                onChange={(e) => setCurrentInvoice({...currentInvoice, notes: e.target.value})}
                placeholder="Details of the deal..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Save Invoice</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} message={snackbar.message} />
    </DashboardLayout>
  );
};

export default Invoices;