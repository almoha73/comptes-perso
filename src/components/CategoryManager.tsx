import React, { useState } from 'react';
import { Button, TextField, Chip, Paper, Typography, IconButton, Box } from '@mui/material';
import { Category, AddCircle, Delete, Close } from '@mui/icons-material';

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
      <Box mb={3}>
        <Button 
          variant="outlined" 
          startIcon={<Category />}
          onClick={() => setShowManager(true)}
        >
          Gérer les catégories
        </Button>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
          <Category sx={{ mr: 1 }} />
          Gestion des catégories
        </Typography>
        <IconButton onClick={() => setShowManager(false)}>
          <Close />
        </IconButton>
      </Box>
      <Box component="form" onSubmit={handleAddCategory} mb={2} display="flex" gap={1}>
        <TextField
          label="Nouvelle catégorie"
          variant="outlined"
          size="small"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" startIcon={<AddCircle />}>
          Ajouter
        </Button>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {categories.map(category => (
          <Chip
            key={category}
            label={category}
            onDelete={() => handleDeleteCategory(category)}
            deleteIcon={<Delete />}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default CategoryManager;