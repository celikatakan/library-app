import React, { useEffect, useState } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './CategoryPage.css'; // Importing CSS file for styling

const CategoryPage = () => {
  const [categories, setCategories] = useState([]); // State to store categories
  const [newCategory, setNewCategory] = useState({ name: '', description: '' }); // State for adding a new category
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category to update
  const [visibleDetails, setVisibleDetails] = useState({}); // Track visibility of details

  // Fetch categories from API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories(); // Get categories from API
      if (data.length === 0) {
        // If no categories, add some sample categories
        const sampleCategories = [
          { name: 'Kurgu', description: 'Romanlar ve hikayeler' },
          { name: 'Bilim', description: 'Bilim üzerine kitaplar' },
          { name: 'Tarih', description: 'Tarihsel kitaplar' },
          { name: 'Felsefe', description: 'Felsefi eserler' },
          { name: 'Teknoloji', description: 'Teknolojiyle ilgili kitaplar' },
        ];
        for (const category of sampleCategories) {
          await addCategory(category); // Add sample categories
        }
        const updatedData = await getCategories();
        setCategories(updatedData);  // Update state with categories
      } else {
        setCategories(data); // Set categories if there are any
      }
    };
    fetchCategories(); // Call the fetchCategories function on mount
  }, []);

  // Toggle visibility of category details
  const toggleDetails = (id) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the visibility for the selected category
    }));
  };

  // Add a new category
  const handleAddCategory = async () => {
    try {
      const addedCategory = await addCategory(newCategory); // Call API to add category
      setCategories((prev) => [...prev, addedCategory]);  // Add new category to the list
      setNewCategory({ name: '', description: '' }); // Reset form
      toast.success('Kategori başarıyla eklendi!');  // Show success message
    } catch (err) {
      console.error('Kategori eklenirken hata oluştu:', err); // Log error
      toast.error('Kategori eklenemedi.');// Show error message
    }
  };

  // Update selected category
  const handleUpdateCategory = async () => {
    try {
      await updateCategory(selectedCategory.id, selectedCategory); // Call API to update category
      setCategories((prev) =>
        prev.map((category) =>
          category.id === selectedCategory.id ? selectedCategory : category
        )
      );  // Update the list of categories
      setSelectedCategory(null); // Deselect the category
      toast.success('Kategori başarıyla güncellendi!'); // Show success message
    } catch (err) {
      console.error('Kategori güncellenirken hata oluştu:', err); // Log error
      toast.error('Kategori güncellenemedi.'); // Show error message
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteCategory(id); // Call API to delete category
        setCategories((prev) => prev.filter((category) => category.id !== id)); // Remove deleted category from the list
        toast.success('Kategori başarıyla silindi!'); // Show success message
      } catch (err) {
        console.error('Kategori silinirken hata oluştu:', err); // Log error
        toast.error('Kategori silinemedi.'); // Show error message
      }
    }
  };

  return (
    <div className="category-page">
      <h2 className="category-page__title">📂 Kategori Sayfası</h2>
      <p className="category-page__description">
        Burada kategoriler hakkında bilgi edinebilirsiniz.📂
      </p>
      {/* Display each category */}

    
      {/* New Category Addition Form */}
      <form className="author-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedCategory) {
            handleUpdateCategory(e);
          } else {
            handleAddCategory(e);
          }}
        }
       
      >
        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Kategori Adı"
          value={selectedCategory ? selectedCategory.name : newCategory.name}
          onChange={(e) =>
            selectedCategory
              ? setSelectedCategory({
                  ...selectedCategory,
                  name: e.target.value,
                })
              : setNewCategory({ ...newCategory, name: e.target.value })
              }
        />
        <input
          className="form-input"
          type="text"
          name="description"
          placeholder="Açıklama"
          value={selectedCategory ? selectedCategory.description : newCategory.description}
          onChange={(e) =>
            selectedCategory
              ? setSelectedCategory({
                  ...selectedCategory,
                  description: e.target.value,
                })
              : setNewCategory({ ...newCategory, description: e.target.value })
              }
        />
       <button className="category-page__button" type="submit">
          {selectedCategory ? "Güncelle" : "Ekle"}
        </button>
      </form>


     
      
      {/* Kategoriler Listesi */}
      <div>
        <h3 className="category-page__list-title">Kategoriler Listesi</h3>
        {categories.length === 0 ? (
          <p className="category-page__empty">Henüz kategori eklenmedi.</p>
        ) : (
          <ul className="category-page__list">
            {categories.map((category) => (
              <li className="category-page__list-item" key={category.id}>
                <strong className="category-page__list-item-name">
                  {category.name}
                </strong>{" "}
                - {category.description}
                <div className="category-page__list-item-buttons">
                  <button
                    className="category-page__button-delete"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Sil
                  </button>
                  <button
                    className="category-page__button-edit"
                    onClick={() => setSelectedCategory(category)}
                  >
                    Güncelle
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
