import React, { useState, useMemo } from 'react';
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
  IconButton,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  Grid
} from '@mui/material';
import {
  History,
  Edit,
  Delete,
  Search,
  NavigateBefore,
  NavigateNext,
  Receipt,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import type { Transaction, Account } from '../types';

interface AdvancedTransactionHistoryProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: string[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const AdvancedTransactionHistory: React.FC<AdvancedTransactionHistoryProps> = ({
  transactions,
  accounts,
  categories,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const itemsPerPage = 10;

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAccount = !selectedAccount || transaction.accountId === selectedAccount;
        const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
        const matchesType = !selectedType || transaction.type === selectedType;
        
        return matchesSearch && matchesAccount && matchesCategory && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, selectedAccount, selectedCategory, selectedType]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getAccountName = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId)?.name || accountId;
  };

  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = `${amount.toFixed(2)} €`;
    return type === 'expense' ? `-${formattedAmount}` : `+${formattedAmount}`;
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction({ ...transaction });
  };

  const handleSaveEdit = () => {
    if (editingTransaction) {
      onEditTransaction(editingTransaction);
      setEditingTransaction(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card sx={{ mb: 1 }}>
      <CardContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {transaction.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, my: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={transaction.category} 
                size="small" 
                variant="outlined"
              />
              <Chip 
                label={getAccountName(transaction.accountId)} 
                size="small" 
                color="primary"
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: transaction.type === 'expense' ? 'error.main' : 'success.main',
                fontWeight: 600,
                minWidth: 'fit-content'
              }}
            >
              {formatAmount(transaction.amount, transaction.type)}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={() => handleEdit(transaction)}
                color="primary"
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onDeleteTransaction(transaction.id)}
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const EditDialog = () => {
    if (!editingTransaction) return null;

    return (
      <Card sx={{ mt: 2, border: 2, borderColor: 'primary.main' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Modifier la transaction
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Montant"
                type="number"
                fullWidth
                value={editingTransaction.amount}
                onChange={(e) => setEditingTransaction({
                  ...editingTransaction,
                  amount: parseFloat(e.target.value)
                })}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={editingTransaction.type}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    type: e.target.value as 'income' | 'expense'
                  })}
                  label="Type"
                >
                  <MenuItem value="expense">Dépense</MenuItem>
                  <MenuItem value="income">Revenu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={editingTransaction.category}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    category: e.target.value
                  })}
                  label="Catégorie"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={editingTransaction.date}
                onChange={(e) => setEditingTransaction({
                  ...editingTransaction,
                  date: e.target.value
                })}
                slotProps={{
                  inputLabel: { shrink: true }
                }}
              />
            </Grid>
            
            <Grid size={12}>
              <TextField
                label="Description"
                fullWidth
                value={editingTransaction.description}
                onChange={(e) => setEditingTransaction({
                  ...editingTransaction,
                  description: e.target.value
                })}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancelEdit} variant="outlined">
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} variant="contained">
              Sauvegarder
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <History /> Historique des transactions
        </Typography>

        {/* Filtres */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Rechercher"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: { startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }
              }}
            />
          </Grid>
          
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Compte</InputLabel>
              <Select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                label="Compte"
              >
                <MenuItem value="">Tous les comptes</MenuItem>
                {accounts.map(acc => (
                  <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Catégorie"
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Type"
              >
                <MenuItem value="">Tous les types</MenuItem>
                <MenuItem value="income">Revenus</MenuItem>
                <MenuItem value="expense">Dépenses</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Statistiques rapides */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<Receipt />}
            label={`${filteredTransactions.length} transactions`}
            color="primary"
            variant="outlined"
          />
          <Chip 
            icon={<TrendingUp />}
            label={`+${filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)} €`}
            color="success"
            variant="outlined"
          />
          <Chip 
            icon={<TrendingDown />}
            label={`-${filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)} €`}
            color="error"
            variant="outlined"
          />
        </Box>

        {/* Liste des transactions */}
        <Box>
          {paginatedTransactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
          
          {paginatedTransactions.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Aucune transaction trouvée
              </Typography>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 3 }}>
            <IconButton 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <NavigateBefore />
            </IconButton>
            
            <Typography variant="body2">
              Page {currentPage} sur {totalPages}
            </Typography>
            
            <IconButton 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <NavigateNext />
            </IconButton>
          </Box>
        )}

        {/* Dialog d'édition */}
        <EditDialog />
      </CardContent>
    </Card>
  );
};

export default AdvancedTransactionHistory;