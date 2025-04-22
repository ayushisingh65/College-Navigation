import React from 'react';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { Location } from '../types';
import RoomIcon from '@mui/icons-material/Room';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import { Box } from '@mui/material';

interface LocationCardProps {
  location: Location;
  onClick: (location: Location) => void;
  disabled?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick, disabled = false }) => {
  const getIcon = () => {
    switch (location.type) {
      case 'room':
        if (location.id.startsWith('hod_')) return <BusinessIcon sx={{ fontSize: 28 }} />;
        return <MeetingRoomIcon sx={{ fontSize: 28 }} />;
      case 'lab':
        return <ScienceIcon sx={{ fontSize: 28 }} />;
      case 'facility':
        if (location.id === 'library') return <LocalLibraryIcon sx={{ fontSize: 28 }} />;
        if (location.id === 'admin_office' || location.id === 'principal_office') return <BusinessIcon sx={{ fontSize: 28 }} />;
        return <RoomIcon sx={{ fontSize: 28 }} />;
      default:
        return <RoomIcon sx={{ fontSize: 28 }} />;
    }
  };

  const getGradient = () => {
    switch (location.type) {
      case 'room':
        if (location.id.startsWith('hod_')) return 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';
        return 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)';
      case 'lab':
        return 'linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)';
      case 'facility':
        if (location.id === 'library') return 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)';
        if (location.id === 'admin_office' || location.id === 'principal_office') return 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';
        return 'linear-gradient(135deg, #607D8B 0%, #90A4AE 100%)';
      default:
        return 'linear-gradient(135deg, #607D8B 0%, #90A4AE 100%)';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease-in-out',
        opacity: disabled ? 0.5 : 1,
        '&:hover': {
          transform: disabled ? 'none' : 'translateY(-4px)',
          boxShadow: disabled ? 'none' : '0 8px 24px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardActionArea 
        onClick={() => !disabled && onClick(location)}
        disabled={disabled}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ flex: 1, p: 0 }}>
          <Box
            sx={{
              background: getGradient(),
              p: 2,
              display: 'flex',
              alignItems: 'center',
              color: 'white',
            }}
          >
            {getIcon()}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                ml: 1,
                fontWeight: 500,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {location.name}
            </Typography>
          </Box>
          {location.description && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {location.description}
              </Typography>
              <Typography 
                variant="caption" 
                color="primary" 
                sx={{ 
                  display: 'block',
                  mt: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 500
                }}
              >
                Floor {location.floor === 0 ? 'Ground' : location.floor}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LocationCard; 