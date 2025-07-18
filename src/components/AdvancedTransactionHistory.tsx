import React, { useState, useMemo } from 'react';
import { PencilSquare, Trash3, CashCoin, Receipt, Search, PlusLg, DashLg, ChevronLeft, ChevronRight as ChevronRightIcon } from 'react-bootstrap-icons';
import type { Transaction, Account } from '../types';



// Composant pour les cartes expandables
interface ExpandableCardProps {
  isExpanded: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  rightContent: React.ReactNode;
  children?: React.ReactNode;
  ariaLabel: string;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  isExpanded,
  onToggle,
  title,
  badge,
  rightContent,
  children,
  ariaLabel
}) => {
  return (
    <div className="glass-card mb-3 fade-in-up">
      <div 
        className="p-3 clickable-area"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={ariaLabel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="row align-items-center">
          <div className="col-auto pe-3">
            <div className="expand-icon">
              {isExpanded ? <DashLg size={20} /> : <PlusLg size={20} />}
            </div>
          </div>
          <div className="col-6">
            <h5 className="glass-balance mb-0">{title}</h5>
            <div className="d-md-none mt-2">
              <span className="glass-badge">{badge}</span>
            </div>
          </div>
          <div className="col-auto ms-auto">
            <div className="d-flex align-items-center">
              <div className="d-none d-md-block mx-4">
                <span className="glass-badge">{badge}</span>
              </div>
              <div className="text-end" style={{ minWidth: '130px' }}>
                {rightContent}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && children && (
        <div className="border-top border-white-10">
          {children}
        </div>
      )}
    </div>
  );
};

interface TransactionGroup {
  key: string;
  month: string;
  year: number;
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}

interface AdvancedTransactionHistoryProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: string[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const AdvancedTransactionHistory: React.FC<AdvancedTransactionHistoryProps> = ({
  transactions,
  accounts,
  categories,
  onEditTransaction,
  onDeleteTransaction
}) => {
  // États pour les filtres
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  // États pour l'édition
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  // États pour la pagination et l'expansion
  const [currentGroupPage, setCurrentGroupPage] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [groupTransactionPages, setGroupTransactionPages] = useState<Record<string, number>>({});
  
  const GROUPS_PER_PAGE = 6;
  const TRANSACTIONS_PER_GROUP_PAGE = 8;

  // Utilitaires
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


  // Filtrage des transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filtre par compte
      const accountMatch = filterAccount === 'all' || transaction.accountId === filterAccount;
      
      // Filtre par type
      const typeMatch = filterType === 'all' || transaction.type === filterType;
      
      // Filtre par recherche
      const searchMatch = searchQuery === '' || 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getAccountName(transaction.accountId).toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par montant
      const minAmountMatch = minAmount === '' || transaction.amount >= parseFloat(minAmount);
      const maxAmountMatch = maxAmount === '' || transaction.amount <= parseFloat(maxAmount);
      
      // Filtre par période
      let periodMatch = true;
      if (periodFilter !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        
        switch (periodFilter) {
          case 'thisMonth':
            periodMatch = transactionDate.getMonth() === now.getMonth() && 
                         transactionDate.getFullYear() === now.getFullYear();
            break;
          case 'lastMonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            periodMatch = transactionDate.getMonth() === lastMonth.getMonth() && 
                         transactionDate.getFullYear() === lastMonth.getFullYear();
            break;
          case 'last3Months':
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3);
            periodMatch = transactionDate >= threeMonthsAgo;
            break;
          case 'last6Months':
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6);
            periodMatch = transactionDate >= sixMonthsAgo;
            break;
          case 'thisYear':
            periodMatch = transactionDate.getFullYear() === now.getFullYear();
            break;
        }
      }
      
      return accountMatch && typeMatch && searchMatch && minAmountMatch && maxAmountMatch && periodMatch;
    });
  }, [transactions, filterAccount, filterType, searchQuery, minAmount, maxAmount, periodFilter, accounts]);

  // Regroupement par mois
  const transactionGroups = useMemo(() => {
    const groups: Record<string, TransactionGroup> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!groups[key]) {
        groups[key] = {
          key,
          month: date.toLocaleDateString('fr-FR', { month: 'long' }),
          year: date.getFullYear(),
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0
        };
      }
      
      groups[key].transactions.push(transaction);
      
      if (transaction.type === 'income') {
        groups[key].totalIncome += transaction.amount;
      } else {
        groups[key].totalExpense += transaction.amount;
      }
    });
    
    // Calculer le montant net et trier les transactions
    Object.values(groups).forEach(group => {
      group.netAmount = group.totalIncome - group.totalExpense;
      group.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    
    // Trier les groupes par date (plus récent en premier)
    return Object.values(groups).sort((a, b) => {
      const aDate = new Date(a.year, parseInt(a.key.split('-')[1]));
      const bDate = new Date(b.year, parseInt(b.key.split('-')[1]));
      return bDate.getTime() - aDate.getTime();
    });
  }, [filteredTransactions]);

  // Pagination des groupes
  const paginatedGroups = useMemo(() => {
    const startIndex = currentGroupPage * GROUPS_PER_PAGE;
    return transactionGroups.slice(startIndex, startIndex + GROUPS_PER_PAGE);
  }, [transactionGroups, currentGroupPage]);

  const totalGroupPages = Math.ceil(transactionGroups.length / GROUPS_PER_PAGE);

  // Fonctions de gestion
  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({ ...transaction });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onEditTransaction(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    const isTransfer = transaction?.category === 'Virement' && 
                      (transaction.id.includes('transfer_debit_') || transaction.id.includes('transfer_credit_'));
    
    const message = isTransfer 
      ? 'Êtes-vous sûr de vouloir supprimer ce virement ? Les deux transactions liées (débit et crédit) seront supprimées.'
      : 'Êtes-vous sûr de vouloir supprimer cette transaction ?';
    
    if (window.confirm(message)) {
      onDeleteTransaction(transactionId);
    }
  };

  const toggleGroupExpansion = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getGroupTransactionPage = (groupKey: string) => {
    return groupTransactionPages[groupKey] || 0;
  };

  const setGroupTransactionPage = (groupKey: string, page: number) => {
    setGroupTransactionPages(prev => ({ ...prev, [groupKey]: page }));
  };

  const getPaginatedGroupTransactions = (group: TransactionGroup) => {
    const page = getGroupTransactionPage(group.key);
    const startIndex = page * TRANSACTIONS_PER_GROUP_PAGE;
    return group.transactions.slice(startIndex, startIndex + TRANSACTIONS_PER_GROUP_PAGE);
  };

  const getGroupTransactionPages = (group: TransactionGroup) => {
    return Math.ceil(group.transactions.length / TRANSACTIONS_PER_GROUP_PAGE);
  };

  return (
    <div className="glass-form">
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 pb-0">
        <div className="d-flex align-items-center">
          <Receipt className="me-2" size={24} />
          <h2 className="glass-section-title mb-0">Historique avancé</h2>
        </div>
        <span className="glass-badge">{filteredTransactions.length} transactions</span>
      </div>
      
      <div className="p-4">
        {/* Filtres avancés */}
        <div className="row g-3 mb-4 px-2">
          <div className="col-md-3">
            <label className="glass-label">Recherche :</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control glass-input"
                placeholder="Description, compte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="position-absolute top-50 end-0 translate-middle-y me-3 medium-contrast-text" size={16} />
            </div>
          </div>
          
          <div className="col-md-2">
            <label className="glass-label">Période :</label>
            <select 
              className="form-select glass-input"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value="all">Toutes</option>
              <option value="thisMonth">Ce mois</option>
              <option value="lastMonth">Mois dernier</option>
              <option value="last3Months">3 derniers mois</option>
              <option value="last6Months">6 derniers mois</option>
              <option value="thisYear">Cette année</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="glass-label">Compte :</label>
            <select 
              className="form-select glass-input"
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
            >
              <option value="all">Tous</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="glass-label">Type :</label>
            <select 
              className="form-select glass-input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="income">Revenus</option>
              <option value="expense">Dépenses</option>
            </select>
          </div>

          <div className="col-md-1.5">
            <label className="glass-label">Montant min :</label>
            <input
              type="number"
              step="0.01"
              className="form-control glass-input"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          <div className="col-md-1.5">
            <label className="glass-label">Montant max :</label>
            <input
              type="number"
              step="0.01"
              className="form-control glass-input"
              placeholder="∞"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Pagination des groupes */}
        {totalGroupPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mb-4">
            <button
              className="glass-btn glass-btn-accessible me-2"
              disabled={currentGroupPage === 0}
              onClick={() => setCurrentGroupPage(prev => prev - 1)}
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} />
              <span className="d-none d-md-inline ms-1">Précédent</span>
            </button>
            <span className="glass-badge mx-3" role="status" aria-live="polite">
              Page {currentGroupPage + 1} sur {totalGroupPages}
            </span>
            <button
              className="glass-btn glass-btn-accessible ms-2"
              disabled={currentGroupPage >= totalGroupPages - 1}
              onClick={() => setCurrentGroupPage(prev => prev + 1)}
              aria-label="Page suivante"
            >
              <span className="d-none d-md-inline me-1">Suivant</span>
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}

        {/* Groupes de transactions */}
        {paginatedGroups.length === 0 ? (
          <div className="text-center py-5">
            <CashCoin size={48} className="mb-3" style={{color: 'rgba(255,255,255,0.5)'}} />
            <p className="medium-contrast-text">Aucune transaction trouvée</p>
          </div>
        ) : (
          paginatedGroups.map((group) => (
            <ExpandableCard
              key={group.key}
              isExpanded={expandedGroups.has(group.key)}
              onToggle={() => toggleGroupExpansion(group.key)}
              title={`${group.month} ${group.year}`}
              badge={`${group.transactions.length}\u00A0\u00A0transaction${group.transactions.length > 1 ? 's' : ''}`}
              ariaLabel={`${expandedGroups.has(group.key) ? 'Masquer' : 'Afficher'} les transactions de ${group.month} ${group.year}`}
              rightContent={
                <>
                  <div className="glass-balance text-end" style={{ whiteSpace: 'nowrap' }}>
                    {group.netAmount >= 0 ? (
                      <span className="text-success">+{group.netAmount.toFixed(2)} €</span>
                    ) : (
                      <span className="text-danger">{group.netAmount.toFixed(2)} €</span>
                    )}
                  </div>
                  <div className="medium-contrast-text d-none d-md-block" style={{fontSize: '0.8rem'}}>
                    +{group.totalIncome.toFixed(2)} € / -{group.totalExpense.toFixed(2)} €
                  </div>
                </>
              }
            >
                            {/* Contenu des transactions */}
              <div className="transaction-list">
                {getPaginatedGroupTransactions(group).map(transaction => (
                  <div key={transaction.id} className="px-3 py-4 border-bottom transaction-mobile-container" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
                    {editingId === transaction.id ? (
                      // Responsive Edit Mode
                      <div className="row g-3">
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="glass-label">Date</label>
                          <input type="date" className="form-control glass-input" value={editForm?.date || ''} onChange={(e) => setEditForm(prev => prev ? {...prev, date: e.target.value} : null)} />
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="glass-label">Compte</label>
                          <select className="form-select glass-input" value={editForm?.accountId || ''} onChange={(e) => setEditForm(prev => prev ? {...prev, accountId: e.target.value} : null)}>
                            {accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}
                          </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="glass-label">Catégorie</label>
                          <select className="form-select glass-input" value={editForm?.category || ''} onChange={(e) => setEditForm(prev => prev ? {...prev, category: e.target.value} : null)}>
                            {categories.map(category => <option key={category} value={category}>{category}</option>)}
                          </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="glass-label">Description</label>
                          <input type="text" className="form-control glass-input" value={editForm?.description || ''} onChange={(e) => setEditForm(prev => prev ? {...prev, description: e.target.value} : null)} />
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="glass-label">Montant</label>
                          <div className="d-flex">
                            <select className="form-select glass-input me-1" style={{width: '60px'}} value={editForm?.type || ''} onChange={(e) => setEditForm(prev => prev ? {...prev, type: e.target.value as 'income' | 'expense'} : null)}>
                              <option value="income">+</option>
                              <option value="expense">-</option>
                            </select>
                            <input type="number" step="0.01" className="form-control glass-input" value={editForm?.amount || 0} onChange={(e) => setEditForm(prev => prev ? {...prev, amount: parseFloat(e.target.value)} : null)} />
                          </div>
                        </div>
                        <div className="col-12 col-lg-1 d-flex align-items-end">
                          <div className="d-flex gap-2 w-100">
                            <button className="glass-btn glass-btn-success flex-fill" onClick={handleSaveEdit}>✓</button>
                            <button className="glass-btn flex-fill" onClick={handleCancelEdit}>✕</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Responsive Display Mode
                      <div className="row align-items-center">
                        {/* Mobile View */}
                        <div className="d-md-none col-12">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong className="glass-balance">{formatAmount(transaction.amount, transaction.type)}</strong>
                              <div className="high-contrast-text mt-1">{transaction.description}</div>
                            </div>
                            <span className="glass-badge">{transaction.category}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-end mt-2">
                            <small className="medium-contrast-text">{formatDate(transaction.date)}<br/>{getAccountName(transaction.accountId)}</small>
                            <div className="d-flex gap-1">
                              <button className="glass-btn glass-btn-primary" style={{padding: '4px 8px'}} onClick={() => handleEdit(transaction)} title="Modifier"><PencilSquare size={12} /></button>
                              <button className="glass-btn glass-btn-warning" style={{padding: '4px 8px'}} onClick={() => handleDelete(transaction.id)} title="Supprimer"><Trash3 size={12} /></button>
                            </div>
                          </div>
                        </div>

                        {/* Tablet & Desktop View */}
                        <div className="d-none d-md-flex col-md-12 row align-items-center">
                          <div className="col-md-2"><small className="medium-contrast-text">{formatDate(transaction.date)}<br/>{getAccountName(transaction.accountId)}</small></div>
                          <div className="col-md-2"><span className="glass-badge">{transaction.category}</span></div>
                          <div className="col-md-4 high-contrast-text">{transaction.description}</div>
                          <div className="col-md-2 text-end"><strong className="glass-balance">{formatAmount(transaction.amount, transaction.type)}</strong></div>
                          <div className="col-md-2 text-end">
                            <div className="d-flex gap-1 justify-content-end">
                              <button className="glass-btn glass-btn-primary" style={{padding: '4px 8px'}} onClick={() => handleEdit(transaction)} title="Modifier"><PencilSquare size={12} /></button>
                              <button className="glass-btn glass-btn-warning" style={{padding: '4px 8px'}} onClick={() => handleDelete(transaction.id)} title="Supprimer"><Trash3 size={12} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

                  {/* Pagination des transactions du groupe */}
                  {getGroupTransactionPages(group) > 1 && (
                    <div className="d-flex justify-content-center align-items-center p-3">
                      <button
                        className="glass-btn me-2"
                        style={{padding: '6px 10px', fontSize: '0.9rem'}}
                        disabled={getGroupTransactionPage(group.key) === 0}
                        onClick={() => setGroupTransactionPage(group.key, getGroupTransactionPage(group.key) - 1)}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="glass-badge mx-2" style={{fontSize: '0.8rem'}}>
                        {getGroupTransactionPage(group.key) + 1} / {getGroupTransactionPages(group)}
                      </span>
                      <button
                        className="glass-btn ms-2"
                        style={{padding: '6px 10px', fontSize: '0.9rem'}}
                        disabled={getGroupTransactionPage(group.key) >= getGroupTransactionPages(group) - 1}
                        onClick={() => setGroupTransactionPage(group.key, getGroupTransactionPage(group.key) + 1)}
                      >
                        <ChevronRightIcon size={14} />
                      </button>
                    </div>
                  )}
            </ExpandableCard>
          ))
        )}

        {/* Pagination des groupes (bas) */}
        {totalGroupPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4">
            <button
              className="glass-btn me-2"
              style={{padding: '8px 12px'}}
              disabled={currentGroupPage === 0}
              onClick={() => setCurrentGroupPage(prev => prev - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="glass-badge mx-3">
              Page {currentGroupPage + 1} sur {totalGroupPages}
            </span>
            <button
              className="glass-btn ms-2"
              style={{padding: '8px 12px'}}
              disabled={currentGroupPage >= totalGroupPages - 1}
              onClick={() => setCurrentGroupPage(prev => prev + 1)}
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedTransactionHistory;