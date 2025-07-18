import React, { useState, useEffect } from 'react';
import { X, Receipt } from 'react-bootstrap-icons';
import type { Transaction, Account } from '../types';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  accounts: Account[];
  categories: string[];
  onSave: (transaction: Transaction) => void;
  onClose: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  accounts,
  categories,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Transaction>({
    id: '',
    date: '',
    accountId: '',
    category: '',
    description: '',
    amount: 0,
    type: 'expense'
  });

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Transaction, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!transaction) return null;

  return (
    <div className="modal show d-block" style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1050
    }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content glass-form" style={{border: 'none'}}>
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center">
              <Receipt className="me-2" size={24} />
              <h5 className="modal-title glass-section-title mb-0">Modifier la transaction</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                opacity: 0.8,
                fontSize: '1.2rem'
              }}
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="glass-label">Date</label>
                <input
                  type="date"
                  className="form-control glass-input"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label className="glass-label">Compte</label>
                <select
                  className="form-select glass-input"
                  value={formData.accountId}
                  onChange={(e) => handleChange('accountId', e.target.value)}
                  required
                >
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="glass-label">Catégorie</label>
                <select
                  className="form-select glass-input"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="glass-label">Type</label>
                <select
                  className="form-select glass-input"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                >
                  <option value="income">Revenu</option>
                  <option value="expense">Dépense</option>
                </select>
              </div>
              
              <div className="col-12">
                <label className="glass-label">Description</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-12">
                <label className="glass-label">Montant</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control glass-input"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
            
            <div className="modal-footer border-0 pt-4">
              <button
                type="button"
                className="glass-btn me-2"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="glass-btn glass-btn-success"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;