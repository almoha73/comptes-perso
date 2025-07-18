import React, { useState } from 'react';
import { Typography, Grid, Card, CardContent, Box, Avatar, IconButton, Button } from '@mui/material';
import { 
  AccountBalance, 
  Savings, 
  Home, 
  BusinessCenter, 
  AccountBalanceWallet, 
  CreditCard,
  Delete,
  Add
} from '@mui/icons-material';
import DeleteAccountModal from './DeleteAccountModal';
import AddAccountModal from './AddAccountModal';

interface Account {
  id: string;
  name: string;
  balance: number;
}

interface AccountListProps {
  accounts: Account[];
  onDeleteAccount: (accountId: string, deleteOrTransferTransactions: 'delete' | 'transfer', targetAccountId?: string) => void;
  onAddAccount: (newAccount: { id: string; name: string; balance: number }) => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
  CCP: <AccountBalance />,
  JOINT: <AccountBalanceWallet />,
  LA: <Savings />,
  LDD: <Savings />,
  CEL: <Home />,
  PEL: <Home />,
  AV: <BusinessCenter />,
};

const AccountList: React.FC<AccountListProps> = ({ accounts, onDeleteAccount, onAddAccount }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (accountId: string, deleteOrTransferTransactions: 'delete' | 'transfer', targetAccountId?: string) => {
    onDeleteAccount(accountId, deleteOrTransferTransactions, targetAccountId);
    setDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleAddConfirm = (newAccount: { id: string; name: string; balance: number }) => {
    onAddAccount(newAccount);
    setAddModalOpen(false);
  };
  return (
    <Box component="section" sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          📊 Vue d'ensemble
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddClick}
          sx={{ minWidth: 'auto' }}
        >
          Ajouter un compte
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {accounts.map((account, index) => (
          <Grid key={account.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card 
              className="fade-in-up" 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  {iconMap[account.id] || <CreditCard />}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {account.name}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {account.balance.toFixed(2)} €
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleDeleteClick(account)}
                  size="small"
                  sx={{ 
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.lighter'
                    }
                  }}
                >
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <DeleteAccountModal
        open={deleteModalOpen}
        account={accountToDelete}
        accounts={accounts}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      
      <AddAccountModal
        open={addModalOpen}
        accounts={accounts}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleAddConfirm}
      />
    </Box>
  );
};

export default AccountList;