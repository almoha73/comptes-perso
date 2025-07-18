import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  InputAdornment
} from '@mui/material';

interface Account {
  id: string;
  name: string;
  balance: number;
}

interface AddAccountModalProps {
  open: boolean;
  accounts: Account[];
  onClose: () => void;
  onConfirm: (newAccount: { id: string; name: string; balance: number }) => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  open,
  accounts,
  onClose,
  onConfirm
}) => {
  const [accountId, setAccountId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [initialBalance, setInitialBalance] = useState('0');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    setError('');
    
    // Validation
    if (!accountId.trim()) {
      setError('L\'ID du compte est requis');
      return;
    }
    
    if (!accountName.trim()) {
      setError('Le nom du compte est requis');
      return;
    }
    
    // Vérifier l'unicité de l'ID
    if (accounts.some(acc => acc.id === accountId.trim())) {
      setError(`Un compte avec l'ID "${accountId}" existe déjà`);
      return;
    }
    
    // Vérifier l'unicité du nom
    if (accounts.some(acc => acc.name === accountName.trim())) {
      setError(`Un compte avec le nom "${accountName}" existe déjà`);
      return;
    }
    
    // Valider le solde
    const balance = parseFloat(initialBalance);
    if (isNaN(balance)) {
      setError('Le solde initial doit être un nombre valide');
      return;
    }

    try {
      onConfirm({
        id: accountId.trim(),
        name: accountName.trim(),
        balance: balance
      });
      
      // Reset form
      setAccountId('');
      setAccountName('');
      setInitialBalance('0');
      setError('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
    }
  };

  const handleClose = () => {
    setAccountId('');
    setAccountName('');
    setInitialBalance('0');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Créer un nouveau compte
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
          
          <TextField
            label="ID du compte"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value.toUpperCase())}
            placeholder="ex: REVOLUT, PAYPAL, etc."
            helperText="Identifiant unique du compte (lettres et chiffres uniquement)"
            fullWidth
            inputProps={{ pattern: '[A-Z0-9]+' }}
          />
          
          <TextField
            label="Nom du compte"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="ex: Compte Revolut, PayPal, etc."
            helperText="Nom complet du compte qui sera affiché"
            fullWidth
          />
          
          <TextField
            label="Solde initial"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            type="number"
            inputProps={{ step: '0.01' }}
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            }}
            helperText="Solde actuel du compte"
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          disabled={!accountId.trim() || !accountName.trim()}
        >
          Créer le compte
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccountModal;