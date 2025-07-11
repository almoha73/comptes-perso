
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import AccountList from './components/AccountList';
import AddTransaction from './components/AddTransaction';
import TransferMoney from './components/TransferMoney';
import CategoryManager from './components/CategoryManager';
import initialData from './data.json';

function App() {
  const [data, setData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('isDirty state changed:', isDirty);
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ''; // Standard for browser to show confirmation
        console.log('BeforeUnload event prevented: isDirty is true');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    console.log('BeforeUnload event listener added.');

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('BeforeUnload event listener removed.');
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

  const handleAddTransaction = (transaction: any) => {
    const updatedData = { ...data };
    const account = updatedData.accounts.find(acc => acc.id === transaction.accountId);
    if (account) {
        if (transaction.type === 'expense') {
            account.balance -= transaction.amount;
        } else {
            account.balance += transaction.amount;
        }
    }
    updatedData.transactions.push(transaction);
    setData(updatedData);
    setIsDirty(true);
    console.log('Transaction added, isDirty set to true.');
  };

  const handleTransfer = (from: string, to: string, amount: number) => {
    const updatedData = { ...data };
    const fromAccount = updatedData.accounts.find(acc => acc.id === from);
    const toAccount = updatedData.accounts.find(acc => acc.id === to);

    if(fromAccount && toAccount) {
        fromAccount.balance -= amount;
        toAccount.balance += amount;
    }

    setData(updatedData);
    setIsDirty(true);
    console.log('Transfer made, isDirty set to true.');
  };

  const handleUpdateCategories = (newCategories: string[]) => {
    const updatedData = { ...data, categories: newCategories };
    setData(updatedData);
    setIsDirty(true);
    console.log('Categories updated, isDirty set to true.');
  };

  return (
    <div className="container mt-4">
      <Header onLoad={() => fileInputRef.current?.click()} onSave={handleFileDownload} />
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} accept=".json"/>
      
      <main>
        <AccountList accounts={data.accounts} />
        <div className="row g-4">
          <div className="col-md-6">
            <CategoryManager categories={data.categories} onUpdateCategories={handleUpdateCategories} />
            <AddTransaction accounts={data.accounts} categories={data.categories} onAddTransaction={handleAddTransaction} />
          </div>
          <div className="col-md-6">
            <TransferMoney accounts={data.accounts} onTransfer={handleTransfer} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
