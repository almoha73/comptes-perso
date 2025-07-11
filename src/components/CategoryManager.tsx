import React, { useState } from 'react';
import { TagsFill, PlusCircle, Trash } from 'react-bootstrap-icons';

interface CategoryManagerProps {
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onUpdateCategories }) => {
  const [newCategory, setNewCategory] = useState('');
  const [showManager, setShowManager] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()].sort();
      onUpdateCategories(updatedCategories);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
    onUpdateCategories(updatedCategories);
  };

  if (!showManager) {
    return (
      <div className="mb-3">
        <button 
          type="button" 
          className="glass-btn btn-sm"
          onClick={() => setShowManager(true)}
        >
          <TagsFill className="me-2 glass-icon" size={16} />
          🏷️ Gérer les catégories
        </button>
      </div>
    );
  }

  return (
    <div className="glass-form mb-3 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 text-glass" style={{ fontWeight: '600' }}>
          <TagsFill className="me-2 glass-icon" size={18} />
          Gestion des catégories
        </h6>
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          onClick={() => setShowManager(false)}
        ></button>
      </div>
      <div>
        <form onSubmit={handleAddCategory} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control glass-input"
              placeholder="Nouvelle catégorie"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="glass-btn-primary glass-btn">
              <PlusCircle className="me-1 glass-icon" size={16} />
              Ajouter
            </button>
          </div>
        </form>
        
        <div className="row g-2">
          {categories.map(category => (
            <div key={category} className="col-auto">
              <div className="glass-badge d-flex align-items-center px-3 py-2">
                <span className="me-2">{category}</span>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  style={{ fontSize: '0.6em' }}
                  onClick={() => handleDeleteCategory(category)}
                  title={`Supprimer ${category}`}
                ></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;