
import React, { useState } from 'react';

import { ArrowRightCircleFill } from 'react-bootstrap-icons';

interface TransferMoneyProps {
  accounts: { id: string; name: string }[];
  onTransfer: (from: string, to: string, amount: number) => void;
}

const TransferMoney: React.FC<TransferMoneyProps> = ({ accounts, onTransfer }) => {
  const sortedAccounts = [...accounts].sort((a, b) => a.name.localeCompare(b.name));
  const [fromAccount, setFromAccount] = useState(sortedAccounts[0]?.id || '');
  const [toAccount, setToAccount] = useState(sortedAccounts[1]?.id || '');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTransfer(fromAccount, toAccount, parseFloat(amount));
    setAmount('');
  };

  return (
    <div className="gradient-form mt-4 p-4">
      <div className="mb-4">
        <h2 className="d-flex align-items-center gradient-text-secondary" style={{ fontWeight: '700', fontSize: '1.5rem' }}>
          <ArrowRightCircleFill className="me-2" size={24}/> 
          🔄 Effectuer un virement
        </h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fromAccount" className="form-label gradient-text">📤 De</label>
            <select className="form-select gradient-input" id="fromAccount" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
              {sortedAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="toAccount" className="form-label gradient-text">📥 À</label>
            <select className="form-select gradient-input" id="toAccount" value={toAccount} onChange={(e) => setToAccount(e.target.value)}>
              {sortedAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="transferAmount" className="form-label gradient-text">💰 Montant</label>
            <input 
              type="number" 
              className="form-control gradient-input" 
              id="transferAmount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="0.00"
              required 
            />
          </div>
          <button type="submit" className="gradient-btn gradient-btn-warning px-4 py-2">
            🚀 Transférer
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferMoney;
