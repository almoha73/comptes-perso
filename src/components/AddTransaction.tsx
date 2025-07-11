
import React, { useState } from 'react';

import { PlusCircleFill } from 'react-bootstrap-icons';

interface AddTransactionProps {
  accounts: { id: string; name: string }[];
  categories: string[];
  onAddTransaction: (transaction: any) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ accounts, categories, onAddTransaction }) => {
  const sortedCategories = [...categories].sort();
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [category, setCategory] = useState(categories[0] || '');
  const [type, setType] = useState('expense');

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
    <div className="card mt-4">
      <div className="card-header">
        <h2 className="d-flex align-items-center"><PlusCircleFill className="me-2"/> Ajouter une transaction</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Montant</label>
            <input type="number" className="form-control" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="account" className="form-label">Compte</label>
            <select className="form-select" id="account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Catégorie</label>
            <select className="form-select" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {sortedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Type</label>
            <select className="form-select" id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Dépense</option>
              <option value="income">Revenu</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
