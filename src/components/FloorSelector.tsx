import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

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
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
        Select Floor
      </Typography>
      <ToggleButtonGroup
        value={currentFloor}
        exclusive
        onChange={handleFloorChange}
        aria-label="floor selection"
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 3,
          p: 0.5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <ToggleButton 
          value={0} 
          aria-label="ground floor"
          sx={{ 
            borderRadius: '16px !important',
            px: 3,
            py: 1,
            '&.Mui-selected': {
              background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              }
            }
          }}
        >
          Ground
        </ToggleButton>
        {[1, 2, 3].map((floor) => (
          <ToggleButton
            key={floor}
            value={floor}
            aria-label={`floor ${floor}`}
            sx={{ 
              borderRadius: '16px !important',
              px: 3,
              py: 1,
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                }
              }
            }}
          >
            {floor}{floor === 1 ? 'st' : floor === 2 ? 'nd' : 'rd'}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default FloorSelector; 