import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography, alpha } from '@mui/material';
import FloorIcon from '@mui/icons-material/Layers';
import ApartmentIcon from '@mui/icons-material/Apartment';

interface FloorSelectorProps {
  currentFloor: number;
  onFloorChange: (floor: number) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ currentFloor, onFloorChange }) => {
  const handleFloorChange = (
    event: React.MouseEvent<HTMLElement>,
    newFloor: number | null
  ) => {
    if (newFloor !== null) {
      onFloorChange(newFloor);
    }
  };

  return (
    <Box 
      sx={{ 
        mb: 4, 
        textAlign: 'center',
        position: 'relative'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 2
        }}
      >
        <ApartmentIcon sx={{ color: 'primary.main' }} />
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}
        >
          Select Floor
        </Typography>
      </Box>
      <ToggleButtonGroup
        value={currentFloor}
        exclusive
        onChange={handleFloorChange}
        aria-label="floor selection"
        sx={{
          background: (theme) => alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
          borderRadius: 3,
          p: 0.75,
          gap: 0.75,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: (theme) => alpha(theme.palette.divider, 0.1),
        }}
      >
        <ToggleButton 
          value={0} 
          aria-label="ground floor"
          sx={{ 
            minWidth: 90,
            borderRadius: '12px !important',
            px: 2,
            py: 1.5,
            border: 'none !important',
            transition: 'all 0.2s ease-in-out',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            },
            '&.Mui-selected': {
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
              color: 'white',
              transform: 'translateY(-1px)',
              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              }
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FloorIcon sx={{ fontSize: 20 }} />
            Ground
          </Box>
        </ToggleButton>
        {[1, 2, 3].map((floor) => (
          <ToggleButton
            key={floor}
            value={floor}
            aria-label={`floor ${floor}`}
            sx={{ 
              minWidth: 90,
              borderRadius: '12px !important',
              px: 2,
              py: 1.5,
              border: 'none !important',
              transition: 'all 0.2s ease-in-out',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
              },
              '&.Mui-selected': {
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                color: 'white',
                transform: 'translateY(-1px)',
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                }
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FloorIcon sx={{ fontSize: 20 }} />
              {floor}{floor === 1 ? 'st' : floor === 2 ? 'nd' : 'rd'}
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default FloorSelector; 