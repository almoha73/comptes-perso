
import React, { useState, useEffect, useRef } from 'react';
import { Container } from '@mui/material';
import './App.css';
import Header from './components/Header';
import AccountList from './components/AccountList';
import AddTransaction from './components/AddTransaction';
import TransferMoney from './components/TransferMoney';
import CategoryManager from './components/CategoryManager';
import AdvancedTransactionHistory from './components/AdvancedTransactionHistory';
import type { AppData, Transaction } from './types';
import initialData from './data.json';

function App() {
  const [data, setData] = useState<AppData>(() => {
    const savedData = localStorage.getItem('appData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Validation basique de la structure
        if (parsedData.accounts && parsedData.transactions && parsedData.categories) {
          return parsedData;
        } else {
          console.log('Structure de données invalide dans localStorage, utilisation des données initiales');
          return initialData as AppData;
        }
      } catch (error) {
        console.error('Erreur lors du parsing des données sauvegardées:', error);
        return initialData as AppData;
      }
    }
    return initialData as AppData;
  });
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sauvegarde automatique quand isDirty devient true
  useEffect(() => {
    if (isDirty) {
      localStorage.setItem('appData', JSON.stringify(data));
    }
  }, [isDirty, data]);

  // Gestion du beforeunload
  useEffect(() => {
    
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ''; // Standard for browser to show confirmation
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setData(JSON.parse(content));
          setIsDirty(false);
          console.log('Data loaded, isDirty set to false.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}m${date.getSeconds().toString().padStart(2, '0')}s`;
    a.download = `data-${formattedDate}_${formattedTime}.json`;
    
    // Append to body, click, then remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    setIsDirty(false);
    console.log('Data saved, isDirty set to false.');
  };

  const handleAddTransaction = (transaction: Transaction) => {
    const updatedData = { ...data };
    const account = updatedData.accounts.find(acc => acc.id === transaction.accountId);
    if (account) {
        if (transaction.type === 'expense') {
            account.balance -= transaction.amount;
        } else {
            account.balance += transaction.amount;
        }
    }
    updatedData.transactions = [...updatedData.transactions, transaction];
    setData(updatedData);
    setIsDirty(true);
    console.log('Transaction added, isDirty set to true.');
  };

  const handleTransfer = (from: string, to: string, amount: number) => {
    const updatedData = { ...data };
    const fromAccount = updatedData.accounts.find(acc => acc.id === from);
    const toAccount = updatedData.accounts.find(acc => acc.id === to);

    if(fromAccount && toAccount) {
        // Mettre à jour les soldes
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        // Créer les transactions de virement
        const currentDate = new Date().toISOString().split('T')[0];
        const transferId = Date.now().toString();

        // Transaction de débit (sortie du compte source)
        const debitTransaction: Transaction = {
          id: `transfer_debit_${transferId}`,
          accountId: from,
          type: 'expense',
          amount: amount,
          category: 'Virement',
          description: `Virement vers ${toAccount.name}`,
          date: currentDate
        };

        // Transaction de crédit (entrée dans le compte destination)
        const creditTransaction: Transaction = {
          id: `transfer_credit_${transferId}`,
          accountId: to,
          type: 'income',
          amount: amount,
          category: 'Virement',
          description: `Virement depuis ${fromAccount.name}`,
          date: currentDate
        };

        // Ajouter les deux transactions
        updatedData.transactions = [...updatedData.transactions, debitTransaction, creditTransaction];
    }

    setData(updatedData);
    setIsDirty(true);
    console.log('Transfer made with transaction history, isDirty set to true.');
  };

  const handleUpdateCategories = (newCategories: string[]) => {
    const updatedData = { ...data, categories: newCategories };
    setData(updatedData);
    setIsDirty(true);
    console.log('Categories updated, isDirty set to true.');
  };

  const handleEditTransaction = (editedTransaction: Transaction) => {
    const updatedData = { ...data };
    
    // Trouver l'ancienne transaction
    const oldTransaction = updatedData.transactions.find(t => t.id === editedTransaction.id);
    if (!oldTransaction) return;

    // Annuler l'effet de l'ancienne transaction sur le solde
    const oldAccount = updatedData.accounts.find(acc => acc.id === oldTransaction.accountId);
    if (oldAccount) {
      if (oldTransaction.type === 'expense') {
        oldAccount.balance += oldTransaction.amount;
      } else {
        oldAccount.balance -= oldTransaction.amount;
      }
    }

    // Appliquer l'effet de la nouvelle transaction
    const newAccount = updatedData.accounts.find(acc => acc.id === editedTransaction.accountId);
    if (newAccount) {
      if (editedTransaction.type === 'expense') {
        newAccount.balance -= editedTransaction.amount;
      } else {
        newAccount.balance += editedTransaction.amount;
      }
    }

    // Mettre à jour la transaction (créer un nouveau tableau)
    const transactionIndex = updatedData.transactions.findIndex(t => t.id === editedTransaction.id);
    const newTransactions = [...updatedData.transactions];
    newTransactions[transactionIndex] = editedTransaction;
    
    const newData = {
      ...updatedData,
      transactions: newTransactions
    };

    setData(newData);
    setIsDirty(true);
  };

  const handleEditDataFile = () => {
    // Afficher les instructions pour éditer le fichier source
    const message = `Pour modifier les soldes initiaux de vos comptes :
    
1. Ouvrez le fichier : /home/almoha/Bureau/gestion-comptes-perso-pwa/src/data.json
2. Modifiez les valeurs "balance" avec vos vrais montants
3. Sauvegardez le fichier
4. Relancez : npm run build
5. Rechargez la page

Exemple :
{ "id": "CCP", "name": "Compte Courant Postal", "balance": 1500.00 }
                                                            ^^^^^^^ 
                                                    Changez cette valeur`;
    
    alert(message);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const updatedData = { ...data };
    
    // Trouver la transaction à supprimer
    const transactionToDelete = updatedData.transactions.find(t => t.id === transactionId);
    if (!transactionToDelete) return;

    // Vérifier si c'est une transaction de virement
    const isTransferTransaction = transactionToDelete.category === 'Virement' && 
                                 (transactionToDelete.id.includes('transfer_debit_') || 
                                  transactionToDelete.id.includes('transfer_credit_'));

    if (isTransferTransaction) {
      // Pour les virements, supprimer aussi la transaction liée
      const transferId = transactionToDelete.id.includes('debit') 
        ? transactionToDelete.id.replace('transfer_debit_', '')
        : transactionToDelete.id.replace('transfer_credit_', '');
      
      const linkedTransactionId = transactionToDelete.id.includes('debit') 
        ? `transfer_credit_${transferId}`
        : `transfer_debit_${transferId}`;
      
      const linkedTransaction = updatedData.transactions.find(t => t.id === linkedTransactionId);
      
      // Annuler l'effet des deux transactions
      [transactionToDelete, linkedTransaction].forEach(transaction => {
        if (transaction) {
          const account = updatedData.accounts.find(acc => acc.id === transaction.accountId);
          if (account) {
            if (transaction.type === 'expense') {
              account.balance += transaction.amount;
            } else {
              account.balance -= transaction.amount;
            }
          }
        }
      });

      // Supprimer les deux transactions
      updatedData.transactions = updatedData.transactions.filter(
        t => t.id !== transactionId && t.id !== linkedTransactionId
      );
      
      console.log('Transfer transactions deleted, isDirty set to true.');
    } else {
      // Transaction normale
      const account = updatedData.accounts.find(acc => acc.id === transactionToDelete.accountId);
      if (account) {
        if (transactionToDelete.type === 'expense') {
          account.balance += transactionToDelete.amount;
        } else {
          account.balance -= transactionToDelete.amount;
        }
      }

      // Supprimer la transaction
      updatedData.transactions = updatedData.transactions.filter(t => t.id !== transactionId);
      
      console.log('Transaction deleted, isDirty set to true.');
    }

    setData(updatedData);
    setIsDirty(true);
  };

  return (
    <Container maxWidth="lg" className="main-container">
      <Header onLoad={() => fileInputRef.current?.click()} onSave={handleFileDownload} onEdit={handleEditDataFile} />
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} accept=".json"/>
      
      <main>
        <AccountList accounts={data.accounts} />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div>
            <CategoryManager categories={data.categories} onUpdateCategories={handleUpdateCategories} />
            <AddTransaction accounts={data.accounts} categories={data.categories} onAddTransaction={handleAddTransaction} />
          </div>
          <div>
            <TransferMoney accounts={data.accounts} onTransfer={handleTransfer} />
          </div>
        </div>
        
        <AdvancedTransactionHistory 
          transactions={data.transactions}
          accounts={data.accounts}
          categories={data.categories}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>
    </Container>
  );
}

export default App;
