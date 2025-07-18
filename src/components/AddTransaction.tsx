
import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Box, Paper, Grid } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import type { Transaction } from '../types';

interface AddTransactionProps {
  accounts: { id: string; name: string }[];
  categories: string[];
  onAddTransaction: (transaction: Transaction) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ accounts, categories, onAddTransaction }) => {
  const sortedCategories = [...categories].sort();
  const sortedAccounts = [...accounts].sort((a, b) => a.name.localeCompare(b.name));
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(sortedAccounts[0]?.id || '');
  const [category, setCategory] = useState(categories[0] || '');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: new Date().toISOString(),
      amount: parseFloat(amount),
      accountId,
      category,
      type
    });
    setAmount('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AddCircleOutline sx={{ mr: 1 }} />
        Ajouter une transaction
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid component="div" xs={12}>
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
          <Grid component="div" xs={12}>
            <FormControl fullWidth>
              <InputLabel id="account-label">Compte</InputLabel>
              <Select
                labelId="account-label"
                id="account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                label="Compte"
              >
                {sortedAccounts.map(acc => <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" xs={12}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Catégorie</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Catégorie"
              >
                {sortedCategories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" xs={12}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
              >
                <MenuItem value="expense">Dépense</MenuItem>
                <MenuItem value="income">Revenu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid component="div" xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddTransaction;
