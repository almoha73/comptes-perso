
import React, { useState } from 'react';

import { ArrowRightCircleFill } from 'react-bootstrap-icons';

interface TransferMoneyProps {
  accounts: { id: string; name: string }[];
  onTransfer: (from: string, to: string, amount: number) => void;
}

const TransferMoney: React.FC<TransferMoneyProps> = ({ accounts, onTransfer }) => {
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || '');
  const [toAccount, setToAccount] = useState(accounts[1]?.id || '');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTransfer(fromAccount, toAccount, parseFloat(amount));
    setAmount('');
  };

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h2 className="d-flex align-items-center"><ArrowRightCircleFill className="me-2"/> Effectuer un virement</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fromAccount" className="form-label">De</label>
            <select className="form-select" id="fromAccount" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="toAccount" className="form-label">À</label>
            <select className="form-select" id="toAccount" value={toAccount} onChange={(e) => setToAccount(e.target.value)}>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="transferAmount" className="form-label">Montant</label>
            <input type="number" className="form-control" id="transferAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Transférer</button>
        </form>
      </div>
    </div>
  );
};

export default TransferMoney;
