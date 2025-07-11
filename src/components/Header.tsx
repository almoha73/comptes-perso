
import React from 'react';
import { Upload, Download } from 'react-bootstrap-icons';

interface HeaderProps {
  onLoad: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoad, onSave }) => {
  return (
    <header className="glass-header d-flex justify-content-between align-items-center mb-4 p-4">
      <h1 className="mb-0 fs-2 text-glass floating" style={{ fontWeight: '700', letterSpacing: '-0.5px' }}>
        💰 Mes Comptes Perso
      </h1>
      <div>
        <button className="glass-btn me-3" onClick={onLoad}>
          <Upload className="me-2 glass-icon" size={18}/>
          Charger
        </button>
        <button className="glass-btn-primary glass-btn" onClick={onSave}>
          <Download className="me-2 glass-icon" size={18}/>
          Sauvegarder
        </button>
      </div>
    </header>
  );
};

export default Header;
