import React from 'react';
import { Bank, PiggyBank, House, Briefcase, Wallet, CashCoin } from 'react-bootstrap-icons';

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
    <section className="mb-4">
      <h2 className="mb-4 glass-section-title">
        📊 Vue d'ensemble
      </h2>
      <div className="row g-3">
        {accounts.map(account => (
          <div key={account.id} className="col-md-6 col-lg-4 fade-in-up">
            <div className="glass-card h-100 p-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="glass-icon">
                    {iconMap[account.id] || <CashCoin size={24} />}
                  </div>
                </div>
                <div>
                  <h5 className="mb-1 text-white" style={{ fontWeight: '600' }}>
                    {account.name}
                  </h5>
                  <p className="glass-balance mb-0">
                    {account.balance.toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccountList;