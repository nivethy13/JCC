import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import lockscreenImage from '../img/Lockscreen.jpg';

const HomePage = () => {
  const [featuredHalls, setFeaturedHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedHalls = async () => {
      try {
        // In a real app, you would fetch this from your API
        // const response = await axios.get('/api/halls/featured/');
        
        // Mock data for demonstration
        const mockHalls = [
          {
            id: 1,
            name: "Grand Hall",
            description: "Our largest hall perfect for weddings and large cultural events",
            capacity: 500,
            image: "/img/Lockscreen.jpg",
            is_featured: true
          },
          {
            id: 2,
            name: "Royal Hall",
            description: "Elegant space for medium-sized gatherings and ceremonies",
            capacity: 250,
            image: "/hall2.jpg",
            is_featured: true
          },
          {
            id: 3,
            name: "Heritage Hall",
            description: "Intimate setting for traditional performances and small events",
            capacity: 100,
            image: "/hall3.jpg",
            is_featured: true
          }
        ];
        
        setFeaturedHalls(mockHalls);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHalls();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error loading featured halls: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Banner */}
      <Box sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${lockscreenImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        mb: 4
      }}>
        <Typography variant="h2" component="h1" sx={{ 
          fontWeight: 'bold',
          mb: 2,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Jaffna Cultural Centre
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Preserving Tradition Through Celebrations
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/booking')}
          sx={{
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            }
          }}
        >
          Book Now
        </Button>
      </Box>

      {/* Featured Halls */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" sx={{ 
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center'
        }}>
          Our Featured Halls
        </Typography>

        <Grid container spacing={4}>
          {featuredHalls.map((hall) => (
            <Grid item key={hall.id} xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  image={hall.image}
                  alt={hall.name}
                  height="200"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {hall.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Capacity: {hall.capacity} people
                  </Typography>
                  <Typography variant="body1">
                    {hall.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/halls/${hall.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    sx={{ ml: 2 }}
                    onClick={() => navigate(`/booking?hall=${hall.id}`)}
                  >
                    Book Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Links */}
        <Box sx={{ 
          mt: 8,
          display: 'flex',
          justifyContent: 'center',
          gap: 4
        }}>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/about')}
          >
            About Us
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/gallery')}
          >
            Our Gallery
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;