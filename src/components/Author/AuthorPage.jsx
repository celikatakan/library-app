import React, { useEffect, useState } from 'react';
import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from '../../api/authorApi';
import { toast } from 'react-toastify';
import './AuthorPage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AuthorPage = () => {
  // State to store the list of authors
  const [authors, setAuthors] = useState([]);
  // State to store the new author form data
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    birthDate: "",
    country: "",
  });
  // State to store the author being edited
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  // State to control visibility of author details
  const [visibleDetails, setVisibleDetails] = useState({});

  // Fetch authors from the database when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAuthors(); // Call the API to get authors data

      // If no authors are found, add sample authors
      if (data.length === 0) {
        const sampleAuthors = [
          { name: "Orhan Pamuk", birthDate: "1952-06-07", country: "Turkey" },
          { name: "Yaşar Kemal", birthDate: "1923-10-06", country: "Turkey" },
          { name: "Elif Şafak", birthDate: "1971-10-25", country: "Turkey" },
          { name: "Nazım Hikmet", birthDate: "1902-01-15", country: "Turkey" },
          { name: "Ahmet Hamdi Tanpınar", birthDate: "1901-06-23", country: "Turkey" },
        ];

        // Add sample authors to the database
        for (const author of sampleAuthors) {
          await addAuthor(author);
        }

        // Fetch updated data after adding sample authors
        const updatedData = await getAuthors();
        setAuthors(updatedData); // Set the updated list of authors to the state
      } else {
        setAuthors(data);
      }
    };

    fetchData();
  }, []) // Empty dependency array means this effect runs once when the component mounts

  // Toggle the visibility of author details
  const toggleDetails = (id) => {
    setVisibleDetails((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle visibility of details for the clicked author
    }));
  };

  // Handle adding a new author
  const handleAddAuthor = async () => {
    try {
      const addedAuthor = await addAuthor(newAuthor); // Add the new author via the API
      setAuthors((prev) => [...prev, addedAuthor]); // Add the new author to the list
      setNewAuthor({ name: "", birthDate: "", country: "" }); // Reset the form
      toast.success("Yazar başarıyla eklendi!", { autoClose: 3000 }) // Show success message
    } catch (err) {
      console.error("Yazar eklenirken hata oluştu:", err);
      toast.error("Yazar eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  // Handle updating an existing author
  const handleUpdateAuthor = async () => {
    try {
      await updateAuthor(selectedAuthor.id, selectedAuthor); // Update the author via the API
      toast.success("Yazar başarıyla güncellendi!", { autoClose: 3000 });

      // Update the author list in the state after successful update
      setAuthors((prevAuthors) =>
        prevAuthors.map((author) =>
          author.id === selectedAuthor.id ? selectedAuthor : author)
      );
      setSelectedAuthor(null); // Reset the selected author
    } catch (err) {
      console.error("Yazar güncellenirken hata oluştu:", err);
      toast.error("Yazar güncellenirken hata oluştu");
    }
  };

  // Handle deleting an author
  const handleDeleteAuthor = async (id) => {
    if (window.confirm("İlgili yazarı silmek istediğinize emin misiniz?")) {
      try {
        await deleteAuthor(id); // Delete the author via the API
        setAuthors((prev) => prev.filter((author) => author.id !== id)); // Remove the author from the list
        toast.success("Yazar başarıyla silindi!");
      } catch (err) {
        console.error("Yazar silinirken hata oluştu:", err);
        toast.error("Yazar silinirken hata oluştu");
      }
    }
  };

  return (
    <div className="author-page-container">
      <h2>✍️ Yazar Sayfası</h2>
      <p>Burada yazarlar hakkında bilgi edinebilirsiniz.</p>

         {/* New author form */}
         <form className="author-form"
         onSubmit={(e) => {
          e.preventDefault();
          if (selectedAuthor) {
            handleUpdateAuthor(e);
          } else {
            handleAddAuthor(e);
          }
    
        }}
      >
        <input className="form-input"
          type="text"
          name="name"
          placeholder='Yazar Adı'
          value={selectedAuthor ? selectedAuthor.name : newAuthor.name}
          onChange={(e) =>
            selectedAuthor
              ? setSelectedAuthor({
                ...selectedAuthor,
                name: e.target.value,
              })
              : setNewAuthor({ ...newAuthor, name: e.target.value })
          }
        />
        <input className="form-input"
          type="date"
          name="birthDate"
          placeholder='Doğum Tarihi'
          value={selectedAuthor ? selectedAuthor.birthDate : newAuthor.birthDate}
          onChange={(e) =>
            selectedAuthor
              ? setSelectedAuthor({
                ...selectedAuthor,
                birthDate: e.target.value,
              })
              : setNewAuthor({ ...newAuthor, birthDate: e.target.value })
          }
        />
        <input className="form-input"
          type="text"
          name="country"
          placeholder='Doğum Yeri'
          value={selectedAuthor ? selectedAuthor.country : newAuthor.country}
          onChange={(e) =>
            selectedAuthor
              ? setSelectedAuthor({
                ...selectedAuthor,
                country: e.target.value,
              })
              : setNewAuthor({ ...newAuthor, country: e.target.value })
          }
        />
         <button type="submit" className="author-button">
          {selectedAuthor ? "Güncelle" : "Ekle"}
        </button>
      </form>

      

      {/* Yazar listesi */}
      <div className="author-list-container">
        <h3>Yazarlar Listesi</h3>
        {authors.length === 0 ? (
          <p>Henüz yazar eklenmedi.</p>
        ) : (
          <ul className="author-list">
            {authors.map((author) => (
              <li key={author.id} className="author-item">
                <div>
                  <strong>{author.name}</strong> - {author.country} - {author.birthDate}
                </div>
                <div className="author-buttons">
                  <button onClick={() => handleDeleteAuthor(author.id)} className="author-delete-btn">
                    Sil
                  </button>
                  <button onClick={() => setSelectedAuthor(author)} className="author-edit-btn">
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

export default AuthorPage;