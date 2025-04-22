import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Grid, Chip } from '@mui/material';
import LocationCard from '../components/LocationCard';
import FloorSelector from '../components/FloorSelector';
import SearchBar from '../components/SearchBar';
import { locations } from '../data/locations';
import { Location } from '../types';
import ExploreIcon from '@mui/icons-material/Explore';
import NavigationIcon from '@mui/icons-material/Navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import VoiceAssistant from '../components/VoiceAssistant';

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [startLocation, setStartLocation] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [arMode, setArMode] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const start = searchParams.get('start');
    if (start) {
      const location = locations.find(loc => loc.id === start);
      if (location) {
        setStartLocation(start);
        setCurrentFloor(location.floor);
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
      const navigationPath = `/navigate?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(selectedDestination.id)}&mode=${viewMode}${arMode ? '&ar=true' : ''}`;
      navigate(navigationPath, {
        state: { 
          startLocation,
          destinationLocation: selectedDestination,
          viewMode,
          arMode
        }
      });
    }
  };

  const handleSearchSelect = (location: Location | null) => {
    if (location && location.id !== startLocation) {
      setSelectedDestination(location);
      setCurrentFloor(location.floor);
    }
  };

  const currentLocationObj = locations.find(loc => loc.id === startLocation);
  const currentLocation = currentLocationObj ? currentLocationObj.name : 'Unknown Location';

  // Filter locations by floor
  const locationsOnFloor = locations.filter(loc => loc.floor === currentFloor);

  // Important destinations (facilities and HOD cabins)
  const importantDestinations = locations.filter(
    loc => loc.type === 'facility' || loc.id.startsWith('hod_')
  );

  const handleVoiceCommand = (action: { 
    type: string; 
    params?: { 
      destination?: string;
      arMode?: boolean;
      viewMode?: '2d' | '3d';
      floor?: number;
    } 
  }) => {
    switch (action.type) {
      case 'NAVIGATE':
        const destination = locations.find(loc => 
          loc.name.toLowerCase().includes(action.params?.destination?.toLowerCase() || '')
        );
        if (destination) {
          handleLocationSelect(destination);
          if (action.params?.viewMode) {
            setViewMode(action.params.viewMode);
          }
        }
        break;
      case 'START_NAVIGATION':
        if (selectedDestination) {
          handleStartNavigation();
        }
        break;
      case 'TOGGLE_AR':
        setArMode(action.params?.arMode || false);
        if (action.params?.viewMode) {
          setViewMode(action.params.viewMode);
        }
        break;
      case 'SWITCH_VIEW':
        if (action.params?.viewMode) {
          setViewMode(action.params.viewMode);
        }
        break;
      case 'CHANGE_FLOOR':
        if (action.params?.floor !== undefined) {
          setCurrentFloor(action.params.floor);
        }
        break;
      case 'SHOW_HELP':
        // You can implement help functionality here
        break;
      default:
        console.log('Unknown action:', action.type);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
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
        </Box>

        <SearchBar 
          locations={locations}
          onLocationSelect={handleSearchSelect}
        />

        <FloorSelector 
          currentFloor={currentFloor}
          onFloorChange={setCurrentFloor}
        />

        {!selectedDestination ? (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  textAlign: 'center',
                  color: 'text.primary',
                  mb: 3
                }}
              >
                Important Destinations
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  justifyContent: 'center'
                }}
              >
                {importantDestinations.map((location) => (
                  <Chip
                    key={location.id}
                    label={location.name}
                    onClick={() => handleLocationSelect(location)}
                    sx={{
                      borderRadius: 3,
                      py: 2.5,
                      backgroundColor: location.floor === currentFloor ? 'primary.main' : 'default',
                      color: location.floor === currentFloor ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: location.floor === currentFloor ? 'primary.dark' : 'default',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mb: 3,
                textAlign: 'center',
                color: 'text.primary'
              }}
            >
              Locations on Floor {currentFloor === 0 ? 'Ground' : `${currentFloor}${currentFloor === 1 ? 'st' : currentFloor === 2 ? 'nd' : 'rd'}`}
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3
            }}>
              {locationsOnFloor.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onClick={handleLocationSelect}
                  disabled={location.id === startLocation}
                />
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
                From: {currentLocation} (Floor {currentLocationObj?.floor === 0 ? 'Ground' : currentLocationObj?.floor})
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                To: {selectedDestination.name} (Floor {selectedDestination.floor === 0 ? 'Ground' : selectedDestination.floor})
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant={viewMode === '2d' ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setViewMode('2d')}
                >
                  2D View
                </Button>
                <Button
                  variant={viewMode === '3d' ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setViewMode('3d')}
                  startIcon={<ViewInArIcon />}
                >
                  3D View
                </Button>
              </Box>
            </Paper>
            
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
        )}
      </Paper>
      <VoiceAssistant onCommand={handleVoiceCommand} />
    </Container>
  );
};

export default Home; 