import React, { useState } from 'react';
import { TextField, Autocomplete, Box, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Location } from '../types';

interface SearchBarProps {
  locations: Location[];
  onLocationSelect: (location: Location | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ locations, onLocationSelect }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Box sx={{ mb: 4, width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Autocomplete
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          onLocationSelect(newValue);
        }}
        options={locations}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for a location..."
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              ),
              sx: {
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }
            }}
          />
        )}
        renderOption={(props, option) => (
          <Paper 
            component="li" 
            {...props}
            elevation={0}
            sx={{ 
              mb: 0.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
              <Box sx={{ ml: 1 }}>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {option.name}
                </Box>
                {option.description && (
                  <Box 
                    component="span" 
                    sx={{ 
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'text.secondary'
                    }}
                  >
                    {option.description}
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        )}
        PaperComponent={({ children }) => (
          <Paper 
            elevation={4}
            sx={{ 
              mt: 1,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {children}
          </Paper>
        )}
      />
    </Box>
  );
};

export default SearchBar; 