import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Alert,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirect based on role
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <DirectionsCarIcon className="text-white" fontSize="large" />
            </div>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Vehicle Bargain ERP
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Sign in to your account
            </Typography>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Demo Credentials Info */}
          <Box className="mb-4 p-3 bg-blue-50 rounded-lg">
            <Typography variant="caption" className="font-semibold block mb-2 text-blue-800">
              Demo Credentials:
            </Typography>
            <Typography variant="caption" className="block text-blue-700">
              Super Admin: admin@erp.com / Admin@123
            </Typography>
            <Typography variant="caption" className="block text-blue-700 mt-1">
              Manager: (Create via Bargain Management)
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mb-4"
              margin="normal"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="mt-6"
              style={{ backgroundColor: loading ? '#94a3b8' : '#2563eb' }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} className="mr-2" style={{ color: 'white' }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;