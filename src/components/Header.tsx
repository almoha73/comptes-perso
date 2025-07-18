
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { Upload, Download, Edit } from '@mui/icons-material';

interface HeaderProps {
  onLoad: () => void;
  onSave: () => void;
  onEdit: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoad, onSave, onEdit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static" sx={{ mb: 3, borderRadius: 2 }}>
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between', 
          py: 1,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 2 : 0
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontSize: isMobile ? '1.3rem' : '2rem',
            textAlign: isMobile ? 'center' : 'left',
            mb: 0
          }}
        >
          💰 {isMobile ? 'Comptes Perso' : 'Mes Comptes Perso'}
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            flexDirection: isMobile ? 'row' : 'row',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          <Button
            variant="outlined"
            startIcon={isMobile ? undefined : <Edit />}
            onClick={onEdit}
            size="small"
            sx={{ 
              flex: isMobile ? 1 : 'none',
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}
          >
            {isMobile ? 'Édit' : 'Éditer'}
          </Button>
          <Button
            variant="outlined"
            startIcon={isMobile ? undefined : <Upload />}
            onClick={onLoad}
            size="small"
            sx={{ 
              flex: isMobile ? 1 : 'none',
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}
          >
            {isMobile ? 'Load' : 'Charger'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={isMobile ? undefined : <Download />}
            onClick={onSave}
            size="small"
            sx={{ 
              flex: isMobile ? 1 : 'none',
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}
          >
            {isMobile ? 'Save' : 'Sauvegarder'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
