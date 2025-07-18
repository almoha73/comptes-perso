import React, { useState } from 'react';
import { PencilSquare, Trash3, Calendar, CashCoin, Receipt } from 'react-bootstrap-icons';
import type { Transaction, Account } from '../types';
import EditTransactionModal from './EditTransactionModal';

interface TransactionHistoryProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: string[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  accounts,
  categories,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : accountId;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'expense' ? '-' : '+';
    const color = type === 'expense' ? 'text-danger' : 'text-success';
    return <span className={color}>{sign}{amount.toFixed(2)} €</span>;
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = (transaction: Transaction) => {
    onEditTransaction(transaction);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
  };

  const handleDelete = (transactionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      onDeleteTransaction(transactionId);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const accountMatch = filterAccount === 'all' || transaction.accountId === filterAccount;
    const typeMatch = filterType === 'all' || transaction.type === filterType;
    return accountMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="glass-form">
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 pb-0">
        <div className="d-flex align-items-center">
          <Receipt className="me-2" size={24} />
          <h2 className="glass-section-title mb-0">Historique des transactions</h2>
        </div>
        <span className="glass-badge">{sortedTransactions.length} transactions</span>
      </div>
      
      <div className="p-4">
        {/* Filtres */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="glass-label">Filtrer par compte :</label>
            <select 
              className="form-select glass-input"
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
            >
              <option value="all">Tous les comptes</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="glass-label">Filtrer par type :</label>
            <select 
              className="form-select glass-input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="income">Revenus</option>
              <option value="expense">Dépenses</option>
            </select>
          </div>
        </div>

        {/* Liste des transactions */}
        {sortedTransactions.length === 0 ? (
          <div className="text-center text-muted py-4">
            <CashCoin size={48} className="mb-2" />
            <p>Aucune transaction trouvée</p>
          </div>
        ) : (
          <>
            {/* Version desktop - Tableau */}
            <div className="d-none d-md-block">
              <div className="table-responsive" style={{borderRadius: '12px', overflow: 'hidden'}}>
                <table className="table table-hover" style={{margin: 0, background: 'rgba(255, 255, 255, 0.05)'}}>
                  <thead style={{background: 'rgba(255, 255, 255, 0.1)'}}>
                    <tr>
                      <th style={{color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)', fontWeight: '600'}}>
                        <Calendar className="me-1" />Date
                      </th>
                      <th style={{color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)', fontWeight: '600'}}>Compte</th>
                      <th style={{color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)', fontWeight: '600'}}>Catégorie</th>
                      <th style={{color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)', fontWeight: '600'}}>Description</th>
                      <th style={{color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)', fontWeight: '600'}}>Montant</th>
                      <th style={{color: 'white', borderColor: 'rgba(255, 255, 255, 0.1)', fontWeight: '600'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                {sortedTransactions.map(transaction => (
                  <tr key={transaction.id} style={{borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                    <td style={{color: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)'}}>{formatDate(transaction.date)}</td>
                    <td style={{borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                      <small style={{color: 'rgba(255, 255, 255, 0.7)'}}>{getAccountName(transaction.accountId)}</small>
                    </td>
                    <td style={{borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                      <span className="glass-badge">{transaction.category}</span>
                    </td>
                    <td style={{color: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)'}}>{transaction.description}</td>
                    <td style={{borderColor: 'rgba(255, 255, 255, 0.1)'}}>{formatAmount(transaction.amount, transaction.type)}</td>
                    <td style={{borderColor: 'rgba(255, 255, 255, 0.1)'}}>
                      <div className="d-flex gap-1">
                        <button
                          className="glass-btn glass-btn-primary"
                          style={{padding: '6px 10px'}}
                          onClick={() => handleEdit(transaction)}
                          title="Modifier"
                        >
                          <PencilSquare size={14} />
                        </button>
                        <button
                          className="glass-btn glass-btn-warning"
                          style={{padding: '6px 10px'}}
                          onClick={() => handleDelete(transaction.id)}
                          title="Supprimer"
                        >
                          <Trash3 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Version mobile - Cartes */}
        <div className="d-md-none">
          {sortedTransactions.map(transaction => (
            <div key={transaction.id} className="glass-card mb-3 fade-in-up">
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="glass-balance mb-1">{formatAmount(transaction.amount, transaction.type)}</h6>
                    <small style={{color: 'rgba(255, 255, 255, 0.7)'}}>{formatDate(transaction.date)}</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="glass-btn glass-btn-primary"
                      style={{padding: '8px 12px'}}
                      onClick={() => handleEdit(transaction)}
                      title="Modifier"
                    >
                      <PencilSquare size={16} />
                    </button>
                    <button
                      className="glass-btn glass-btn-warning"
                      style={{padding: '8px 12px'}}
                      onClick={() => handleDelete(transaction.id)}
                      title="Supprimer"
                    >
                      <Trash3 size={16} />
                    </button>
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <small className="glass-label" style={{fontSize: '0.75rem', marginBottom: '0.25rem'}}>Compte</small>
                    <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem'}}>{getAccountName(transaction.accountId)}</div>
                  </div>
                  <div className="col-6">
                    <small className="glass-label" style={{fontSize: '0.75rem', marginBottom: '0.25rem'}}>Catégorie</small>
                    <div><span className="glass-badge" style={{fontSize: '0.8rem', padding: '4px 8px'}}>{transaction.category}</span></div>
                  </div>
                  <div className="col-12 mt-2">
                    <small className="glass-label" style={{fontSize: '0.75rem', marginBottom: '0.25rem'}}>Description</small>
                    <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem'}}>{transaction.description}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
        )}
      </div>
      
      <EditTransactionModal
        transaction={editingTransaction}
        accounts={accounts}
        categories={categories}
        onSave={handleSaveEdit}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TransactionHistory;