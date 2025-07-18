
import React, { useState } from 'react';

import { PlusCircleFill } from 'react-bootstrap-icons';
import type { Transaction, Account } from '../types';

interface AddTransactionProps {
  accounts: Account[];
  categories: string[];
  onAddTransaction: (transaction: Transaction) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ accounts, categories, onAddTransaction }) => {
  const sortedCategories = [...categories].sort();
  const sortedAccounts = [...accounts].sort((a, b) => a.name.localeCompare(b.name));
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(sortedAccounts[0]?.id || '');
  const [category, setCategory] = useState(categories[0] || '');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      accountId,
      category,
      type,
      description: description || `Transaction ${type === 'expense' ? 'de dépense' : 'de revenu'}`,
      date: new Date().toISOString().split('T')[0]
    });
    setAmount('');
    setDescription('');
  };

  return (
    <div className="glass-form mt-4 p-4">
      <div className="mb-4">
        <h2 className="d-flex align-items-center text-white" style={{ fontWeight: '600', fontSize: '1.25rem' }}>
          <PlusCircleFill className="me-2" size={24}/> 
          Ajouter une transaction
        </h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label glass-label">Montant</label>
            <input 
              type="number" 
              className="form-control glass-input" 
              id="amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="0.00"
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="account" className="form-label glass-label">Compte</label>
            <select className="form-select glass-input" id="account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {sortedAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label glass-label">Catégorie</label>
            <select className="form-select glass-input" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {sortedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label glass-label">Type</label>
            <select className="form-select glass-input" id="type" value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
              <option value="expense">Dépense</option>
              <option value="income">Revenu</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label glass-label">Description (optionnelle)</label>
            <input 
              type="text" 
              className="form-control glass-input" 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Décrivez cette transaction..."
            />
          </div>
          <button type="submit" className="glass-btn glass-btn-success px-4 py-2">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
