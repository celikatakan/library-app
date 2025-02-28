import React, { useState, useEffect } from 'react';
import { getBorrowings, addBorrowing, updateBorrowing, deleteBorrowing } from '../../api/bookBorrowApi';
import { getBooks } from '../../api/bookApi';
import { toast } from 'react-toastify';
import './BorrowPage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const BookBorrowingPage = () => {
  const [borrowings, setBorrowings] = useState([]); // State to store the list of borrowings
  const [books, setBooks] = useState([]); // State to store the list of books
  const [selectedBook, setSelectedBook] = useState(null); // State to store the selected book for borrowing
  const [newBorrowing, setNewBorrowing] = useState({ // State to store the new borrowing form data
    borrowerName: '',
    borrowerMail: '',
    borrowingDate: '',
    returnDate: '', // Return date field
  });
  const [editingBorrowing, setEditingBorrowing] = useState(null); /// State for editing an existing borrowing

  // Fetch books and borrowings data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBooks = await getBooks(); // Fetching books data
        setBooks(fetchedBooks);

        const fetchedBorrowings = await getBorrowings(); // Fetching borrowings data
        setBorrowings(fetchedBorrowings);
      } catch (error) {
        console.error("Veriler alınırken hata oluştu:", error);
        toast.error('Veriler alınamadı. Lütfen daha sonra tekrar deneyin.', { position: 'top-center' });
      }
    };

    fetchData(); // Empty dependency array ensures this effect runs once when the component mounts
  }, []);

  // Handle book selection from the dropdown
  const handleBookSelection = (bookId) => {
    const selected = books.find((book) => book.id === parseInt(bookId));
    setSelectedBook(selected); // Set the selected book
  };

  // Handle adding a new borrowing
  const handleAddBorrowing = async (e) => {
    e.preventDefault();

    // Validation: Check if all required fields are filled
    if (!newBorrowing.borrowerName || !newBorrowing.borrowerMail || !newBorrowing.borrowingDate) {
      toast.error('Lütfen tüm gerekli alanları doldurun.', { position: 'top-center' });
      return;
    }

    if (!selectedBook) {
      toast.error('Lütfen bir kitap seçin.', { position: 'top-center' });
      return;
    }

    if (selectedBook.stock <= 0) {
      toast.error('Bu kitap stokta yok.', { position: 'top-center' });
      return;
    }
    // Attempt to add borrowing and update stock
    try {
      const addedBorrowing = await addBorrowing({
        ...newBorrowing,
        bookForBorrowingRequest: {
          id: selectedBook.id,
          name: selectedBook.name,
          publicationYear: selectedBook.publicationYear,
          stock: selectedBook.stock - 1,
        },
      });

      // Update the books state with new stock value
      setBooks(
        books.map((book) =>
          book.id === selectedBook.id
            ? { ...book, stock: book.stock - 1 }
            : book
        )
      );

      setBorrowings([...borrowings, addedBorrowing]); // Add the new borrowing to the list
      setNewBorrowing({
        borrowerName: '',
        borrowerMail: '',
        borrowingDate: '',
      }); // Clear form fields after submission
      setSelectedBook(null);
      toast.success('Ödünç alma başarıyla eklendi!', { position: 'top-center' });
    } catch (error) {
      console.error('Ödünç alma ekleme hatası:', error);
      toast.error('Ödünç alma eklenemedi. Lütfen tekrar deneyin.', { position: 'top-center' });
    }
  };

  // Begin editing a borrowing
  const handleEditClick = (borrowing) => {
    setEditingBorrowing(borrowing); // Set the borrowing to be edited
  };
  // Handle updating an existing borrowing
  const handleUpdateBorrowing = async (e) => {
    e.preventDefault();

    if (!editingBorrowing) return;

    const updatedRequest = {
      borrowerName: editingBorrowing.borrowerName,
      borrowingDate: editingBorrowing.borrowingDate,
      returnDate: editingBorrowing.returnDate,
    };

    try { // Attempt to update the borrowing
      const updatedBorrowing = await updateBorrowing(editingBorrowing.id, updatedRequest);
      setBorrowings((prev) =>
        prev.map((borrowing) =>
          borrowing.id === editingBorrowing.id ? updatedBorrowing : borrowing
        )
      );
      toast.success('Ödünç alma başarıyla güncellendi!', { position: 'top-center' });
      setEditingBorrowing(null); // Reset form after updating
    } catch (error) {
      console.error('Ödünç alma güncellenirken hata oluştu:', error);
      toast.error('Ödünç alma güncellenemedi. Lütfen tekrar deneyin.', { position: 'top-center' });
    }
  };

  // Handle deleting a borrowing
  const handleDeleteBorrowing = async (id) => {
    const confirmDelete = window.confirm(
      'Bu ödünç almayı silmek istediğinizden emin misiniz?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBorrowing(id); // Delete the borrowing from the backend
      setBorrowings((prev) => prev.filter((borrowing) => borrowing.id !== id)); // Remove from state
      toast.success('Ödünç alma başarıyla silindi!', {
        position: 'top-center',
      });
    } catch (error) {
      console.error('Ödünç alma işlemi silinirken hata oluştu:', error);
      toast.error('Ödünç alma işlemi silinemedi. Lütfen tekrar deneyin.', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="borrow-container">
      <div>
        <h2>📖 Kitap Ödünç Alma</h2>
        <p className="borrow-p">
          Burada istediğiniz kitabı ödünç almak için işlem yapabilirsiniz.
        </p>



        {/* Borrowing Form */}
        <form className="book-form"
         onSubmit={(e) => {
          e.preventDefault();
          if (editingBorrowing) {
            handleUpdateBorrowing(e);
          } else {
            handleAddBorrowing(e);
          }}
        }
         >
          <input className="form-input"
            type="text"
            placeholder="Ödünç Alan Ad"
            value={editingBorrowing ? editingBorrowing.borrowerName : newBorrowing.borrowerName}
            onChange={(e) =>
              editingBorrowing
                ? setEditingBorrowing({
                    ...editingBorrowing,
                    borrowerName: e.target.value,
                  })
                : setNewBorrowing({ ...newBorrowing,borrowerName: e.target.value })
                }
          />
          <input className="form-input"
            type="email"
            placeholder="Ödünç Alan E-Mail"
            value={editingBorrowing ? editingBorrowing.borrowerMail : newBorrowing.borrowerMail}
            onChange={(e) =>
              editingBorrowing
                ? setEditingBorrowing({
                    ...editingBorrowing,
                    borrowerMail: e.target.value,
                  })
                : setNewBorrowing({ ...newBorrowing,borrowerMail: e.target.value })
                }
          />
          
          <input className="form-input"
            type="date"
            placeholder="Ödünç Alma Tarihi"
            value={editingBorrowing ? editingBorrowing.borrowingDate : newBorrowing.borrowingDate}
            onChange={(e) =>
              editingBorrowing
                ? setEditingBorrowing({
                    ...editingBorrowing,
                    borrowingDate: e.target.value,
                  })
                : setNewBorrowing({ ...newBorrowing,borrowingDate: e.target.value })
                }
          />

          <select onChange={(e) => handleBookSelection(e.target.value)} className="form-input">
            <option value="">Kitap Seçiniz</option>
            {books.map((book) => (
              <option key={book.id} value={book.id} disabled={book.stock === 0}>
                {book.name} (Stok: {book.stock})
              </option>
            ))}
          </select>

            <button type="submit" className="borrow-button">
            {editingBorrowing ? "Güncelle" : "Ödünç Al"}
          </button>
        </form>
      </div>

      <div className="borrow-list">
        {borrowings.map((borrow) => (
          <div className="borrow-card" key={borrow.id}>
            <h4>{borrow.book?.name}</h4>
            <p>
              <strong>Ad:</strong> {borrow.borrowerName}
            </p>
            <p>
              <strong>Mail:</strong> {borrow.borrowerMail}
            </p>
            <p>
              <strong>Tarih:</strong> {borrow.borrowingDate}
            </p>
            <p>
              <strong>Kitap ID:</strong> {borrow.book?.id}
            </p>
            <div className="button-container">
              <button
                className="update-button"
                onClick={() => handleEditClick(borrow)}
              >
                Güncelle
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteBorrowing(borrow.id)}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default BookBorrowingPage;
