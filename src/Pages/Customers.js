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
} from '@mui/icons-material';
import { dummyCustomers } from '../Utils/dummyData';

const Customers = () => {
  const [customers, setCustomers] = useState(dummyCustomers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentCustomer, setCurrentCustomer] = useState({
    name: '',
    cnic: '',
    phone: '',
    email: '',
    address: '',
    type: 'buyer',
  });

  // Open Add Dialog
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

  // Open Edit Dialog
  const handleEditClick = (customer) => {
    setEditMode(true);
    setCurrentCustomer(customer);
    setOpenDialog(true);
  };

  // Handle Form Submit
  const handleSubmit = () => {
    if (editMode) {
      // Update existing customer
      setCustomers(customers.map(c => 
        c.id === currentCustomer.id ? currentCustomer : c
      ));
    } else {
      // Add new customer
      const newCustomer = {
        ...currentCustomer,
        id: customers.length + 1,
        created_at: new Date().toISOString().split('T')[0],
      };
      setCustomers([...customers, newCustomer]);
    }
    setOpenDialog(false);
  };

  // Delete Customer
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.phone.includes(searchTerm) ||
                          customer.cnic.includes(searchTerm);
    const matchesType = filterType === 'all' || customer.type === filterType;
    return matchesSearch && matchesType;
  });

  // Get type badge color
  const getTypeBadge = (type) => {
    const colors = {
      buyer: 'success',
      seller: 'primary',
      both: 'secondary',
    };
    return colors[type] || 'default';
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          style={{ backgroundColor: '#2563eb' }}
        >
          Add Customer
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <TextField
            placeholder="Search by name, phone, or CNIC..."
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
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              label="Filter by Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  CNIC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
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
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <LocationOn fontSize="small" /> {customer.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <Phone fontSize="small" /> {customer.phone}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Email fontSize="small" /> {customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <CreditCard fontSize="small" /> {customer.cnic}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Chip 
                      label={customer.type.toUpperCase()} 
                      color={getTypeBadge(customer.type)}
                      size="small"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(customer)}
                        className="text-blue-600"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No customers found
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField
              label="Full Name"
              value={currentCustomer.name}
              onChange={(e) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="CNIC"
              placeholder="35202-1234567-8"
              value={currentCustomer.cnic}
              onChange={(e) => setCurrentCustomer({...currentCustomer, cnic: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Phone Number"
              placeholder="0300-1234567"
              value={currentCustomer.phone}
              onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={currentCustomer.email}
              onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
              fullWidth
            />
            <TextField
              label="Address"
              value={currentCustomer.address}
              onChange={(e) => setCurrentCustomer({...currentCustomer, address: e.target.value})}
              required
              fullWidth
              multiline
              rows={2}
              className="md:col-span-2"
            />
            <FormControl fullWidth>
              <InputLabel>Customer Type</InputLabel>
              <Select
                value={currentCustomer.type}
                label="Customer Type"
                onChange={(e) => setCurrentCustomer({...currentCustomer, type: e.target.value})}
              >
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="seller">Seller</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: '#2563eb' }}>
            {editMode ? 'Update' : 'Add'} Customer
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Customers;