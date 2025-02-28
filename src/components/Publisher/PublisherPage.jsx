import React, { useEffect, useState } from "react";
import {
  getPublishers,
  addPublisher,
  updatePublisher,
  deletePublisher,
} from "../../api/publisherApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./PublisherPage.css";

const PublisherPage = () => {
  // State variables for managing publishers, new publisher, selected publisher for editing, and visibility of publisher details
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  });
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [visibleDetails, setVisibleDetails] = useState({}); // Track visibility of publisher details

  // Fetching publishers on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getPublishers();
      // If no publishers exist, add sample publishers
      if (data.length === 0) {
        const samplePublishers = [
          {
            name: "Bilge Kültür Sanat",
            establishmentYear: 1995,
            address: "İstanbul, Türkiye",
          },
          {
            name: "Mavi Karga Yayınları",
            establishmentYear: 2010,
            address: "Ankara, Türkiye",
          },
          {
            name: "Çınar Kitap",
            establishmentYear: 1983,
            address: "İzmir, Türkiye",
          },
          {
            name: "Gölge Yayınları",
            establishmentYear: 2005,
            address: "Bursa, Türkiye",
          },
          {
            name: "Yakamoz Kitabevi",
            establishmentYear: 2018,
            address: "Antalya, Türkiye",
          },
        ];

        // Add sample publishers to the database
        for (const publisher of samplePublishers) {
          await addPublisher(publisher);
        }
        const updatedData = await getPublishers();
        setPublishers(updatedData);
        toast.info("Örnek yayıncılar başarıyla eklendi!");
      } else {
        setPublishers(data); // If data exists, set publishers from the API
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on component mount

  const toggleDetails = (id) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle visibility of the specific publisher's details
    }));
  };

  // Handle the addition of a new publisher
  const handleAddPublisher = async () => {
    if (
      !newPublisher.name ||
      !newPublisher.establishmentYear ||
      !newPublisher.address
    ) {
      toast.warn("Lütfen tüm alanları doldurun."); // Display warning if form is incomplete
      return;
    }
    try {
      const addedPublisher = await addPublisher(newPublisher); // Add publisher to the API
      setPublishers((prev) => [...prev, addedPublisher]); // Update the publisher list with the new publisher
      setNewPublisher({ name: "", establishmentYear: "", address: "" }); // Reset input fields
      toast.success("Yayımcı başarıyla eklendi!", { autoClose: 3000 });
    } catch (err) {
      console.error("Yayıncı eklenirken hata oluştu:", err);
      toast.error("Yayımcı eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  // Handle updating an existing publisher
  const handleUpdatePublisher = async () => {
    if (!selectedPublisher) {
      toast.error("Güncelleme için hiçbir yayıncı seçilmedi.");
      return;
    }

    if (
      !selectedPublisher.name ||
      !selectedPublisher.establishmentYear ||
      !selectedPublisher.address
    ) {
      toast.warn("Lütfen kaydetmeden önce tüm alanları doldurun."); // Show a warning if fields are incomplete
      return;
    }

    try {
      const updatedData = { ...selectedPublisher };
      await updatePublisher(selectedPublisher.id, updatedData); // Update publisher in the API
      setPublishers(
        (prevPublishers) =>
          prevPublishers.map((publisher) =>
            publisher.id === selectedPublisher.id
              ? selectedPublisher
              : publisher
          ) // Update the list of publishers
      );
      toast.success("Yayımcı başarıyla güncellendi!", { autoClose: 3000 });
      setSelectedPublisher(null); // Reset selected publisher after update
    } catch (err) {
      console.error("Yayıncı güncellenirken hata oluştu:", err);
      toast.error("Yayıncı güncellenirken hata oluştu.");
    }
  };

  // Handle deleting a publisher
  const handleDeletePublisher = async (id) => {
    if (window.confirm("Bu yayıncıyı silmek istediğinizden emin misiniz?")) {
      try {
        await deletePublisher(id); // Delete publisher from the API
        setPublishers((prev) =>
          prev.filter((publisher) => publisher.id !== id)
        ); // Remove from state
        toast.success("Yayımcı başarıyla silindi!");
      } catch (err) {
        console.error("Yayıncı silinirken hata oluştu:", err);
        toast.error("Yayıncı silinirken hata oluştu.");
      }
    }
  };

  return (
    <div className="publisher-page-container">
      <h2>📚 Yayımcı Sayfası</h2>
      <p>Burada yayımcılar hakkında bilgi edinebilirsiniz.</p>

      {/* Form for adding a new publisher */}
      <form
        className="publisher-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedPublisher) {
            handleUpdatePublisher(e);
          } else {
            handleAddPublisher(e);
          }
        }}
      >
        <input
          className="publisher-input"
          type="text"
          name="name"
          placeholder="Yayıncı Adı"
          value={selectedPublisher ? selectedPublisher.name : newPublisher.name}
          onChange={(e) =>
            selectedPublisher
              ? setSelectedPublisher({
                  ...selectedPublisher,
                  name: e.target.value,
                })
              : setNewPublisher({ ...newPublisher, name: e.target.value })
          }
        />
        <input
          className="publisher-input"
          type="number"
          name="establishmentYear"
          placeholder="Kuruluş Yılı"
          value={
            selectedPublisher
              ? selectedPublisher.establishmentYear
              : newPublisher.establishmentYear
          }
          onChange={(e) =>
            selectedPublisher
              ? setSelectedPublisher({
                  ...selectedPublisher,
                  establishmentYear: e.target.value,
                })
              : setNewPublisher({
                  ...newPublisher,
                  establishmentYear: e.target.value,
                })
          }
        />
        <input
          className="publisher-input"
          type="text"
          name="address"
          placeholder="Adres"
          value={
            selectedPublisher ? selectedPublisher.address : newPublisher.address
          }
          onChange={(e) =>
            selectedPublisher
              ? setSelectedPublisher({
                  ...selectedPublisher,
                  address: e.target.value,
                })
              : setNewPublisher({ ...newPublisher, address: e.target.value })
          }
        />
        <button type="submit" className="publisher-button">
          {selectedPublisher ? "Güncelle" : "Ekle"}
        </button>
      </form>

      {/* Yayımcılar Listesi */}
      <div className="publisher-list">
        <h3>Yayımcılar Listesi</h3>
        {publishers.length === 0 ? (
          <p>Henüz yayımcı eklenmedi.</p>
        ) : (
          <ul>
            {publishers.map((publisher) => (
              <li key={publisher.id} className="publisher-item">
                <div>
                  <strong>{publisher.name}</strong> -{" "}
                  {publisher.establishmentYear} - {publisher.address}
                </div>
                <div className="publisher-buttons">
                  <button
                    onClick={() => handleDeletePublisher(publisher.id)}
                    className="publisher-delete-btn"
                  >
                    Sil
                  </button>
                  <button
                    onClick={() => setSelectedPublisher(publisher)}
                    className="publisher-edit-btn"
                  >
                    Düzenle
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

export default PublisherPage;
