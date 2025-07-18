
import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface TransferMoneyProps {
  accounts: { id: string; name: string }[];
  onTransfer: (from: string, to: string, amount: number) => void;
}

const TransferMoney: React.FC<TransferMoneyProps> = ({ accounts, onTransfer }) => {
  const sortedAccounts = [...accounts].sort((a, b) => a.name.localeCompare(b.name));
  const [fromAccount, setFromAccount] = useState(accounts.find(acc => acc.id === 'CCP')?.id || sortedAccounts[0]?.id || '');
  const [toAccount, setToAccount] = useState(sortedAccounts[1]?.id || '');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTransfer(fromAccount, toAccount, parseFloat(amount));
    setAmount('');
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h3" component="h2" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <ArrowForward sx={{ mr: 1 }} />
          Effectuer un virement
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel id="from-account-label">De</InputLabel>
                <Select
                  labelId="from-account-label"
                  id="fromAccount"
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  label="De"
                >
                  {sortedAccounts.map(acc => <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel id="to-account-label">À</InputLabel>
                <Select
                  labelId="to-account-label"
                  id="toAccount"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  label="À"
                >
                  {sortedAccounts.map(acc => <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                label="Montant"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                fullWidth
              />
            </Grid>
            <Grid size={12}>
              <Button type="submit" variant="contained" color="secondary" fullWidth>
                Transférer
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransferMoney;
