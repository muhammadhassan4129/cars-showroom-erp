import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import { transactionAPI, invoiceAPI } from '../Services/api';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Grid, Snackbar, CircularProgress, InputAdornment, Chip
} from '@mui/material';
import { Add, Search, Paid, ReceiptLong, CloudUpload, Delete, Visibility } from '@mui/icons-material';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [currentTransaction, setCurrentTransaction] = useState({
    invoice_id: '',
    amount: '',
    payment_method: 'CASH',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: '',
    transaction_reference_file: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, invRes] = await Promise.all([
        transactionAPI.getAll(),
        invoiceAPI.getAll()
      ]);
      setTransactions(transRes.data?.data?.data || transRes.data?.data || transRes.data || []);
      setInvoices(invRes.data?.data?.data || invRes.data?.data || invRes.data || []);
    } catch (error) {
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Filter logic for searching
  const filteredTransactions = transactions.filter(t => 
    t.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.invoice_id?.toString().includes(searchTerm) ||
    t.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!currentTransaction.invoice_id || !currentTransaction.amount) {
        showSnackbar('Please fill required fields', 'error');
        return;
    }

    try {
      const formData = new FormData();
      formData.append('invoice_id', currentTransaction.invoice_id);
      formData.append('amount', currentTransaction.amount);
      formData.append('payment_method', currentTransaction.payment_method);
      formData.append('transaction_date', currentTransaction.transaction_date);
      formData.append('notes', currentTransaction.notes);
      
      if (currentTransaction.transaction_reference_file) {
        formData.append('transaction_reference_file', currentTransaction.transaction_reference_file);
      }

      const res = await transactionAPI.create(formData);
      setTransactions([res.data.data || res.data, ...transactions]);
      showSnackbar('Transaction added successfully');
      setOpenDialog(false);
      // Reset Form
      setCurrentTransaction({
        invoice_id: '', amount: '', payment_method: 'CASH',
        transaction_date: new Date().toISOString().split('T')[0],
        notes: '', transaction_reference_file: null
      });
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving transaction', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        setTransactions(transactions.filter(t => t.id !== id));
        showSnackbar('Transaction deleted');
      } catch (error) {
        showSnackbar('Delete failed', 'error');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-600 mt-1">Track all payments and receipts</p>
        </div>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setOpenDialog(true)}
          style={{ backgroundColor: '#10b981' }}
        >
          New Transaction
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <TextField
          placeholder="Search by Invoice ID or Method..."
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search className="mr-2 text-gray-400" /> }}
          className="bg-white"
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Proof</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
                <tr><td colSpan="7" className="text-center py-10"><CircularProgress /></td></tr>
            ) : filteredTransactions.map((trans) => (
              <tr key={trans.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm whitespace-nowrap">{trans.transaction_date}</td>
                <td className="px-6 py-4 text-sm font-medium text-blue-600">#{trans.invoice_id}</td>
                <td className="px-6 py-4 text-sm">
                    <Chip label={trans.payment_method} size="small" variant="outlined" color="primary" />
                </td>
                <td className="px-6 py-4 text-sm font-bold text-green-600 whitespace-nowrap">PKR {Number(trans.amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{trans.notes}</td>
                <td className="px-6 py-4 text-sm">
                  {trans.transaction_reference_file ? (
                    <Button 
                        size="small" 
                        startIcon={<Visibility />} 
                        onClick={() => window.open(trans.transaction_reference_file, '_blank')}
                    > View </Button>
                  ) : <span className="text-gray-400">No Proof</span>}
                </td>
                <td className="px-6 py-4 text-center">
                    <IconButton color="error" size="small" onClick={() => handleDelete(trans.id)}>
                        <Delete fontSize="small" />
                    </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} className="mt-1">
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Invoice</InputLabel>
                <Select
                  value={currentTransaction.invoice_id}
                  label="Select Invoice"
                  onChange={(e) => setCurrentTransaction({...currentTransaction, invoice_id: e.target.value})}
                >
                  {invoices.map(inv => (
                    <MenuItem key={inv.id} value={inv.id}>
                      INV-{inv.invoice_number || inv.id} ({inv.buyer?.name || 'N/A'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Amount" type="number" fullWidth required
                value={currentTransaction.amount}
                onChange={(e) => setCurrentTransaction({...currentTransaction, amount: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={currentTransaction.payment_method}
                  label="Payment Method"
                  onChange={(e) => setCurrentTransaction({...currentTransaction, payment_method: e.target.value})}
                >
                  <MenuItem value="cash">CASH</MenuItem>
                  <MenuItem value="online">ONLINE</MenuItem>
                  <MenuItem value="cheque">CHEQUE</MenuItem>
                  <MenuItem value="bank_transfer">BANK TRANSFER</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Transaction Date" type="date" fullWidth required
                value={currentTransaction.transaction_date}
                onChange={(e) => setCurrentTransaction({...currentTransaction, transaction_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUpload />}
                color={currentTransaction.transaction_reference_file ? "success" : "primary"}
              >
                {currentTransaction.transaction_reference_file ? currentTransaction.transaction_reference_file.name : "Upload Proof (Image/PDF)"}
                <input
                  type="file"
                  hidden
                  onChange={(e) => setCurrentTransaction({...currentTransaction, transaction_reference_file: e.target.files[0]})}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes" multiline rows={2} fullWidth
                value={currentTransaction.notes}
                // FIXED LINE 193: Changed currentInvoice to currentTransaction
                onChange={(e) => setCurrentTransaction({...currentTransaction, notes: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" style={{backgroundColor: '#10b981'}}>Submit Payment</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} message={snackbar.message} />
    </DashboardLayout>
  );
};

export default Transactions;