
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Box 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import type { Transaction, Account } from '../types';

interface AddTransactionProps {
  accounts: Account[];
  categories: string[];
  onAddTransaction: (transaction: Transaction) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ accounts, categories, onAddTransaction }) => {
  const sortedCategories = [...categories].sort();
  const sortedAccounts = [...accounts].sort((a, b) => a.name.localeCompare(b.name));
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(sortedAccounts[0]?.id || '');
  const [category, setCategory] = useState(categories[0] || '');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      accountId,
      category,
      type,
      description: description || `Transaction ${type === 'expense' ? 'de dépense' : 'de revenu'}`,
      date: new Date().toISOString().split('T')[0]
    });
    setAmount('');
    setDescription('');
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h3" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Add /> Ajouter une transaction
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Montant"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            fullWidth
            inputProps={{ step: "0.01" }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Compte</InputLabel>
            <Select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              label="Compte"
            >
              {sortedAccounts.map(acc => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Catégorie"
            >
              {sortedCategories.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              label="Type"
            >
              <MenuItem value="expense">Dépense</MenuItem>
              <MenuItem value="income">Revenu</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Description (optionnelle)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez cette transaction..."
            fullWidth
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="secondary"
            size="large"
            startIcon={<Add />}
            sx={{ mt: 1 }}
          >
            Ajouter
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddTransaction;
