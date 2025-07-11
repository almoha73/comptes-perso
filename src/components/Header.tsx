
import React from 'react';
import { Upload, Download } from 'react-bootstrap-icons';

interface HeaderProps {
  onLoad: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoad, onSave }) => {
  return (
    <header className="fun-header d-flex justify-content-between align-items-center mb-4 p-4">
      <h1 className="mb-0 fs-2 fun-title" style={{ fontWeight: '900', letterSpacing: '-0.5px' }}>
        💰 Mes Comptes Perso
      </h1>
      <div>
        <button className="fun-btn me-3" onClick={onLoad}>
          <Upload className="me-2 fun-icon" size={18}/>
          Charger
        </button>
        <button className="fun-btn-primary fun-btn" onClick={onSave}>
          <Download className="me-2 fun-icon" size={18}/>
          Sauvegarder
        </button>
      </div>
    </header>
  );
};

export default Header;
