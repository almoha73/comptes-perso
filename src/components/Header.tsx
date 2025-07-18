
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Upload, Download } from '@mui/icons-material';

interface HeaderProps {
  onLoad: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoad, onSave }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Column on extra-small, row on small and up
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 2,
      }}
    >
      <Typography variant="h6" component="div" sx={{ mb: { xs: 2, sm: 0 } }}>
        Gestion de Comptes Personnels
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row', // Always row for buttons
          gap: { xs: 1, sm: 2 }, // Gap between buttons
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button variant="contained" onClick={onLoad} startIcon={<Upload />}>
          Charger
        </Button>
        <Button variant="contained" color="primary" onClick={onSave} startIcon={<Download />}>
          Sauvegarder
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
