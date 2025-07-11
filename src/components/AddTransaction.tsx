
import React, { useState } from 'react';

import { PlusCircleFill } from 'react-bootstrap-icons';

interface AddTransactionProps {
  accounts: { id: string; name: string }[];
  categories: string[];
  onAddTransaction: (transaction: any) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ accounts, categories, onAddTransaction }) => {
  const sortedCategories = [...categories].sort();
  const sortedAccounts = [...accounts].sort((a, b) => a.name.localeCompare(b.name));
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(sortedAccounts[0]?.id || '');
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
    <div className="gradient-form mt-4 p-4">
      <div className="mb-4">
        <h2 className="d-flex align-items-center gradient-text-secondary" style={{ fontWeight: '700', fontSize: '1.5rem' }}>
          <PlusCircleFill className="me-2" size={24}/> 
          ✨ Ajouter une transaction
        </h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label gradient-text">💰 Montant</label>
            <input 
              type="number" 
              className="form-control gradient-input" 
              id="amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="0.00"
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="account" className="form-label gradient-text">🏦 Compte</label>
            <select className="form-select gradient-input" id="account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {sortedAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label gradient-text">🏷️ Catégorie</label>
            <select className="form-select gradient-input" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {sortedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label gradient-text">📊 Type</label>
            <select className="form-select gradient-input" id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Dépense</option>
              <option value="income">Revenu</option>
            </select>
          </div>
          <button type="submit" className="gradient-btn gradient-btn-success px-4 py-2">
            ✨ Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
