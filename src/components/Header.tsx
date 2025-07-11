
import React from 'react';
import { Upload, Download } from 'react-bootstrap-icons';

interface HeaderProps {
  onLoad: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoad, onSave }) => {
  return (
    <header className="gradient-header d-flex justify-content-between align-items-center mb-4 p-4">
      <h1 className="mb-0 fs-2 gradient-title">
        💰 Mes Comptes Perso
      </h1>
      <div>
        <button className="gradient-btn me-3" onClick={onLoad}>
          <Upload className="me-2" size={18}/>
          Charger
        </button>
        <button className="gradient-btn gradient-btn-secondary" onClick={onSave}>
          <Download className="me-2" size={18}/>
          Sauvegarder
        </button>
      </div>
    </header>
  );
};

export default Header;
