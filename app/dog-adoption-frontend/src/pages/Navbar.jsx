import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Paw from '@mui/icons-material/Pets';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4e342e' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/search')}>
        <Paw /> Fetch a Friend
        </Typography>
        <Box>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
