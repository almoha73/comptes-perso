import React from 'react';
import { Bank, PiggyBank, House, Briefcase, Heart, Wallet, CashCoin } from 'react-bootstrap-icons';

interface Account {
  id: string;
  name: string;
  balance: number;
}

interface AccountListProps {
  accounts: Account[];
}

const iconMap: { [key: string]: React.ReactNode } = {
  CCP: <Bank size={24} className="text-primary" />,
  JOINT: <Wallet size={24} className="text-info" />,
  LA: <PiggyBank size={24} className="text-success" />,
  LDD: <PiggyBank size={24} className="text-warning" />,
  CEL: <House size={24} className="text-danger" />,
  PEL: <House size={24} className="text-danger" />,
  AV: <Briefcase size={24} className="text-dark" />,
  REVOLUT: <CashCoin size={24} className="text-success" />,
  N26: <Bank size={24} className="text-secondary" />,
};

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  return (
    <div className="mb-4">
      <h2 className="mb-3">Vue d'ensemble</h2>
      <div className="row g-3">
        {accounts.map(account => (
          <div key={account.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className="me-3">
                  {iconMap[account.id] || <CashCoin size={24} />}
                </div>
                <div>
                  <h5 className="card-title mb-1">{account.name}</h5>
                  <p className="card-text fs-4 fw-bold text-success mb-0">{account.balance.toFixed(2)} €</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;