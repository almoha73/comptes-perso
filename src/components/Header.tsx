
import React from 'react';
import { Upload, Download } from 'react-bootstrap-icons';

interface HeaderProps {
  onLoad: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoad, onSave }) => {
  return (
    <header className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm">
      <h1 className="mb-0 fs-3">Mes Comptes Perso</h1>
      <div>
        <button className="btn btn-outline-secondary me-2" onClick={onLoad}>
          <Upload className="me-2"/>
          Charger
        </button>
        <button className="btn btn-primary" onClick={onSave}>
          <Download className="me-2"/>
          Sauvegarder
        </button>
      </div>
    </header>
  );
};

export default Header;
