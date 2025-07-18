
import React from 'react';
import { Upload, Download, Pencil } from 'react-bootstrap-icons';

interface HeaderProps {
  onLoad: () => void;
  onSave: () => void;
  onEdit: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoad, onSave, onEdit }) => {
  return (
    <header className="glass-header mb-4 p-4">
      {/* Version desktop */}
      <div className="d-none d-md-flex justify-content-between align-items-center">
        <h1 className="mb-0 glass-title">
          💰 Mes Comptes Perso
        </h1>
        <div>
          <button className="glass-btn me-2" onClick={onEdit}>
            <Pencil className="me-2" size={18}/>
            Éditer
          </button>
          <button className="glass-btn me-2" onClick={onLoad}>
            <Upload className="me-2" size={18}/>
            Charger
          </button>
          <button className="glass-btn glass-btn-primary" onClick={onSave}>
            <Download className="me-2" size={18}/>
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Version mobile */}
      <div className="d-md-none">
        <div className="text-center mb-3">
          <h1 className="mb-0 glass-title" style={{fontSize: '1.5rem'}}>
            💰 Comptes Perso
          </h1>
        </div>
        <div className="d-flex gap-1 justify-content-center">
          <button className="glass-btn glass-btn-accessible flex-fill" onClick={onEdit}>
            <Pencil size={16}/>
            <span className="ms-1 d-none d-sm-inline">Éditer</span>
          </button>
          <button className="glass-btn glass-btn-accessible flex-fill" onClick={onLoad}>
            <Upload size={16}/>
            <span className="ms-1 d-none d-sm-inline">Charger</span>
          </button>
          <button className="glass-btn glass-btn-primary glass-btn-accessible flex-fill" onClick={onSave}>
            <Download size={16}/>
            <span className="ms-1 d-none d-sm-inline">Sauver</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
