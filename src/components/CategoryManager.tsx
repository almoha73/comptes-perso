import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Chip, 
  IconButton
} from '@mui/material';
import { Category, Add, Close } from '@mui/icons-material';

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
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="outlined"
          startIcon={<Category />}
          onClick={() => setShowManager(true)}
          size="small"
        >
          Gérer les catégories
        </Button>
      </Box>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Category /> Gestion des catégories
          </Typography>
          <IconButton 
            onClick={() => setShowManager(false)}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
        
        <Box component="form" onSubmit={handleAddCategory} sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Nouvelle catégorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="secondary"
            startIcon={<Add />}
          >
            Ajouter
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              onDelete={() => handleDeleteCategory(category)}
              deleteIcon={<Close />}
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;