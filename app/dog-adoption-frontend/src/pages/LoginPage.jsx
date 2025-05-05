import { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PawIcon from '@mui/icons-material/Pets';
import './LoginPage.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ name, email }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      navigate('/search');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5, border: '3px solid #ccc', padding: 3, borderRadius: 4}}>
      <Typography variant="h5" align="center" gutterBottom>
      Find your paw-some best friend!!
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Please enter your details to continue.
      </Typography>

      {error && (
        <Box sx={{ mb: 2, color: 'error.main', textAlign: 'center' }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      <TextField
        fullWidth
        label="Name"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        required
        autoFocus
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        required
        type="email"
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleLogin}
        disabled={loading}
        sx={{
          mb: 2,
          backgroundColor: '#4e342e' ,
          '&:hover': {
            backgroundColor: '#3e2723',
          }          
        }}
        startIcon={<PawIcon />}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
      </Button>

    </Container>
  );
}

export default LoginPage;
