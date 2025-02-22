import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PetsList.css"; // Se añadió un archivo CSS para la interfaz

function PetsList() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPet, setEditingPet] = useState(null); // Estado para la mascota en edición
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    // Cambia la URL si tu FastAPI corre en otro puerto
    axios
      .get("http://127.0.0.1:8000/pets/")
      .then((response) => {
        setPets(response.data);
        setFilteredPets(response.data); // Inicialmente se muestra toda la lista
      })
      .catch((err) => {
        setError("Error fetching data");
        console.error(err);
      });
  }, []);

  // Función para filtrar las mascotas según el nombre
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter((pet) =>
        pet.nombre.toLowerCase().includes(query)
      );
      setFilteredPets(filtered);
    }
  };

  // Función para eliminar una mascota
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/pets/${id}`);
      setPets(pets.filter((pet) => pet.id !== id)); // Actualiza la lista sin la mascota eliminada
      setFilteredPets(filteredPets.filter((pet) => pet.id !== id));
      alert("Pet deleted successfully");
    } catch (err) {
      setError("Error deleting pet");
      console.error(err);
    }
  };

  // Función para ver detalles de una mascota
  const handleView = (id) => {
    const pet = pets.find((pet) => pet.id === id);
    alert(`Details:\nName: ${pet.nombre}\nBreed: ${pet.raza}\nAge: ${pet.edad}`);
  };

  // Función para abrir el modal de edición
  const openEditModal = (pet) => {
    setEditingPet(pet); // Establece la mascota que se está editando
    setIsModalOpen(true); // Abre el modal
  };

  // Función para cerrar el modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingPet(null); // Limpia la mascota en edición
  };

  // Función para manejar el envío del formulario de edición
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envía la solicitud PUT a la API para actualizar la mascota
      await axios.put(`http://127.0.0.1:8000/pets/${editingPet.id}`, editingPet);
      
      // Actualiza la lista de mascotas
      const updatedPets = pets.map((pet) =>
        pet.id === editingPet.id ? editingPet : pet
      );
      setPets(updatedPets);
      setFilteredPets(updatedPets);

      alert("Pet updated successfully");
      closeEditModal(); // Cierra el modal después de la edición
    } catch (err) {
      setError("Error updating pet");
      console.error(err);
    }
  };

  // Función para actualizar los campos de la mascota en edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPet({ ...editingPet, [name]: value });
  };

  return (
    <div className="pets-container">
      <h1>Pets List</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search pets by name"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredPets.length > 0 ? (
        <ul className="pets-list">
          {filteredPets.map((pet) => (
            <li key={pet.id} className="pet-item">
              <div className="pet-details">
                <h3>{pet.nombre}</h3>
                <p><strong>Breed:</strong> {pet.raza}</p>
                <p><strong>Age:</strong> {pet.edad} years</p>
              </div>
              <div className="pet-actions">
                <button onClick={() => handleView(pet.id)} className="view-button">
                  View
                </button>
                <button onClick={() => openEditModal(pet)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(pet.id)} className="delete-button">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pets available</p>
      )}

      {/* Modal de edición */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Pet</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="nombre"
                  value={editingPet.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Breed:</label>
                <input
                  type="text"
                  name="raza"
                  value={editingPet.raza}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  name="edad"
                  value={editingPet.edad}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetsList;
