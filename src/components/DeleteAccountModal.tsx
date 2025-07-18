import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert
} from '@mui/material';

interface Account {
  id: string;
  name: string;
  balance: number;
}

interface DeleteAccountModalProps {
  open: boolean;
  account: Account | null;
  accounts: Account[];
  onClose: () => void;
  onConfirm: (accountId: string, deleteOrTransferTransactions: 'delete' | 'transfer', targetAccountId?: string) => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  open,
  account,
  accounts,
  onClose,
  onConfirm
}) => {
  const [transactionAction, setTransactionAction] = useState<'delete' | 'transfer'>('delete');
  const [targetAccountId, setTargetAccountId] = useState<string>('');

  const handleConfirm = () => {
    if (!account) return;
    
    if (transactionAction === 'transfer' && !targetAccountId) {
      return;
    }

    onConfirm(account.id, transactionAction, targetAccountId || undefined);
    onClose();
    setTransactionAction('delete');
    setTargetAccountId('');
  };

  const handleClose = () => {
    onClose();
    setTransactionAction('delete');
    setTargetAccountId('');
  };

  const availableAccounts = accounts.filter(acc => acc.id !== account?.id);

  if (!account) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Supprimer le compte "{account.name}"
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Cette action est irréversible et supprimera définitivement le compte.
        </Alert>

        <Typography variant="body1" gutterBottom>
          Solde actuel: <strong>{account.balance.toFixed(2)} €</strong>
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Que faire avec les transactions de ce compte ?
          </Typography>
          
          <RadioGroup
            value={transactionAction}
            onChange={(e) => setTransactionAction(e.target.value as 'delete' | 'transfer')}
          >
            <FormControlLabel 
              value="delete" 
              control={<Radio />} 
              label="Supprimer toutes les transactions" 
            />
            <FormControlLabel 
              value="transfer" 
              control={<Radio />} 
              label="Transférer les transactions vers un autre compte" 
            />
          </RadioGroup>

          {transactionAction === 'transfer' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Compte de destination</InputLabel>
              <Select
                value={targetAccountId}
                onChange={(e) => setTargetAccountId(e.target.value)}
                label="Compte de destination"
              >
                {availableAccounts.map((acc) => (
                  <MenuItem key={acc.id} value={acc.id}>
                    {acc.name} ({acc.balance.toFixed(2)} €)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="error"
          disabled={transactionAction === 'transfer' && !targetAccountId}
        >
          Supprimer le compte
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountModal;