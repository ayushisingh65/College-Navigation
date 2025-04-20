import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import LocationCard from '../components/LocationCard';
import { locations } from '../data/locations';
import { Location } from '../types';
import ExploreIcon from '@mui/icons-material/Explore';
import NavigationIcon from '@mui/icons-material/Navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [startLocation, setStartLocation] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);

  useEffect(() => {
    const start = searchParams.get('start');
    if (start) {
      const isValidLocation = locations.some(loc => loc.id === start);
      if (isValidLocation) {
        setStartLocation(start);
      }
    }
  }, [searchParams]);

  const handleLocationSelect = (location: Location) => {
    if (location.id !== startLocation) {
      setSelectedDestination(location);
    }
  };

  const handleStartNavigation = () => {
    if (selectedDestination && startLocation) {
      const navigationPath = `/navigate?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(selectedDestination.id)}`;
      navigate(navigationPath, {
        state: { 
          startLocation,
          destinationLocation: selectedDestination
        }
      });
    }
  };

  const currentLocationObj = locations.find(loc => loc.id === startLocation);
  const currentLocation = currentLocationObj ? currentLocationObj.name : 'Unknown Location';

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, md: 4 },
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <ExploreIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Indoor Navigation
          </Typography>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            background: 'rgba(33, 150, 243, 0.1)',
            px: 3,
            py: 1.5,
            borderRadius: 3,
            mb: 2
          }}>
            <NavigationIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>
              {currentLocation}
            </Typography>
          </Box>
          {!currentLocationObj && (
            <Typography 
              color="error" 
              variant="body2"
              sx={{
                mt: 2,
                p: 1,
                borderRadius: 1,
                backgroundColor: 'rgba(244, 67, 54, 0.1)'
              }}
            >
              Please scan a valid QR code to start navigation
            </Typography>
          )}
        </Box>

        {!selectedDestination ? (
          <>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mb: 3,
                textAlign: 'center',
                color: 'text.primary'
              }}
            >
              Select Your Destination
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              justifyContent: 'center'
            }}>
              {locations.map((location) => (
                <Box 
                  key={location.id}
                  sx={{ 
                    width: { xs: '100%', sm: 'calc(50% - 12px)' },
                    opacity: location.id === startLocation ? 0.5 : 1,
                    pointerEvents: location.id === startLocation ? 'none' : 'auto',
                  }}
                >
                  <LocationCard
                    location={location}
                    onClick={handleLocationSelect}
                  />
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'text.primary' }}>
              Confirm Your Destination
            </Typography>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                my: 3, 
                borderRadius: 3,
                background: 'rgba(33, 150, 243, 0.1)',
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                From: {currentLocation}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                To: {selectedDestination.name}
              </Typography>
            </Paper>
            <Box sx={{ mt: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 2,
                justifyContent: 'center'
              }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleStartNavigation}
                  disabled={!currentLocationObj}
                  startIcon={<NavigationIcon />}
                  fullWidth={false}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Start Navigation
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedDestination(null)}
                  startIcon={<ArrowBackIcon />}
                  fullWidth={false}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Change Destination
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Home; 