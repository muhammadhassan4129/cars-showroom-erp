import React, { useEffect, useState } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import { customerAPI } from '../Services/api';
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
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Phone,
  Email,
  LocationOn,
  Person,
  CreditCard,
  Business
} from '@mui/icons-material';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [currentCustomer, setCurrentCustomer] = useState({
    name: '',
    cnic: '',
    phone: '',
    email: '',
    address: '',
    type: 'buyer',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll();
      // Laravel pagination and resource handling
      const resData = response.data?.data?.data || response.data?.data || response.data;
      setCustomers(Array.isArray(resData) ? resData : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showSnackbar('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddClick = () => {
    setEditMode(false);
    setCurrentCustomer({
      name: '',
      cnic: '',
      phone: '',
      email: '',
      address: '',
      type: 'buyer',
    });
    setOpenDialog(true);
  };

  const handleEditClick = (customer) => {
    setEditMode(true);
    setCurrentCustomer({ ...customer });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: currentCustomer.name,
        cnic: currentCustomer.cnic,
        phone: currentCustomer.phone,
        email: currentCustomer.email,
        address: currentCustomer.address,
        type: currentCustomer.type,
      };

      if (editMode) {
        const response = await customerAPI.update(currentCustomer.id, payload);
        const updatedCustomer = response.data.data || response.data;
        setCustomers(prev => prev.map(c => c.id === currentCustomer.id ? updatedCustomer : c));
        showSnackbar('Customer updated successfully');
      } else {
        const response = await customerAPI.create(payload);
        const newData = response.data.data || response.data;
        
        // Add new customer to the beginning of the list
        setCustomers(prev => [newData, ...prev]);
        showSnackbar('Customer added successfully!');
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving customer:', error);
      showSnackbar(error.response?.data?.message || 'Failed to save customer', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        setCustomers(prev => prev.filter(c => c.id !== id));
        showSnackbar('Customer deleted successfully!');
      } catch (error) {
        showSnackbar('Failed to delete customer', 'error');
      }
    }
  };

  const filteredCustomers = Array.isArray(customers) ? customers.filter(customer => {
    if (!customer) return false;
    const search = searchTerm.toLowerCase();
    const name = (customer.name || '').toLowerCase();
    const phone = (customer.phone || '');
    const cnic = (customer.cnic || '');

    const matchesSearch = name.includes(search) || phone.includes(search) || cnic.includes(search);
    const matchesType = filterType === 'all' || (customer.type || '').toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesType;
  }) : [];

  const getTypeBadge = (type) => {
    const colors = {
      buyer: 'success',
      seller: 'primary',
      both: 'secondary',
    };
    return colors[(type || 'buyer').toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64"><CircularProgress /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick} style={{ backgroundColor: '#2563eb' }}>
          Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <TextField
            placeholder="Search by name, phone, or CNIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined" size="small" className="flex-1 min-w-[300px]"
            InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
          />
          <FormControl size="small" className="min-w-[150px]">
            <InputLabel>Filter by Type</InputLabel>
            <Select value={filterType} label="Filter by Type" onChange={(e) => setFilterType(e.target.value)}>
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Person className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <LocationOn style={{ fontSize: '16px' }} /> {customer.address || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <Phone style={{ fontSize: '16px' }} /> {customer.phone || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Email style={{ fontSize: '16px' }} /> {customer.email || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <CreditCard style={{ fontSize: '16px' }} /> {customer.cnic || 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Chip
                      label={(customer.type || 'buyer').toUpperCase()}
                      color={getTypeBadge(customer.type)}
                      size="small"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <IconButton size="small" onClick={() => handleEditClick(customer)} className="text-blue-600">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(customer.id)} className="text-red-600">
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-gray-500">No customers found</div>
          )}
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField label="Full Name" value={currentCustomer.name} onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })} required fullWidth />
            <TextField label="CNIC" placeholder="35202-1234567-8" value={currentCustomer.cnic} onChange={(e) => setCurrentCustomer({ ...currentCustomer, cnic: e.target.value })} required fullWidth />
            <TextField label="Phone Number" placeholder="0300-1234567" value={currentCustomer.phone} onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })} required fullWidth />
            <TextField label="Email" type="email" value={currentCustomer.email} onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })} fullWidth />
            <TextField label="Address" value={currentCustomer.address} onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })} required fullWidth multiline rows={2} className="md:col-span-2" />
            <FormControl fullWidth>
              <InputLabel>Customer Type</InputLabel>
              <Select value={currentCustomer.type} label="Customer Type" onChange={(e) => setCurrentCustomer({ ...currentCustomer, type: e.target.value })}>
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="seller">Seller</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: '#2563eb' }}>{editMode ? 'Update' : 'Add'} Customer</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Customers;