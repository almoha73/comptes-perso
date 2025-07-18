import React from 'react';
import { Typography, Grid, Card, CardContent, Box, Avatar } from '@mui/material';
import { 
  AccountBalance, 
  Savings, 
  Home, 
  BusinessCenter, 
  AccountBalanceWallet, 
  CreditCard 
} from '@mui/icons-material';

interface Account {
  id: string;
  name: string;
  balance: number;
}

interface AccountListProps {
  accounts: Account[];
}

const iconMap: { [key: string]: React.ReactNode } = {
  CCP: <AccountBalance />,
  JOINT: <AccountBalanceWallet />,
  LA: <Savings />,
  LDD: <Savings />,
  CEL: <Home />,
  PEL: <Home />,
  AV: <BusinessCenter />,
  REVOLUT: <CreditCard />,
  N26: <AccountBalance />,
};

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  return (
    <Box component="section" sx={{ mb: 4 }}>
      <Typography variant="h2" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        📊 Vue d'ensemble
      </Typography>
      
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
                <Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {account.name}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {account.balance.toFixed(2)} €
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AccountList;