import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { AccountBalance, AccountBalanceWallet, Savings, Home, Work, MonetizationOn } from '@mui/icons-material';

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
  AV: <Work />,
  REVOLUT: <MonetizationOn />,
  N26: <AccountBalance />,
};

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Vue d'ensemble
      </Typography>
      <Grid container spacing={3}>
        {accounts.map(account => (
          <Grid component="div" xs={12} sm={6} md={4} key={account.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid component="div">
                    <Avatar>
                      {iconMap[account.id] || <MonetizationOn />}
                    </Avatar>
                  </Grid>
                  <Grid component="div">
                    <Typography variant="h6" component="div">
                      {account.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {account.balance.toFixed(2)} €
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AccountList;