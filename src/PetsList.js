// src/PetsList.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PetsList.css"; // Se añadió un archivo CSS para la interfaz

function PetsList() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPet, setEditingPet] = useState(null);
  const [newPet, setNewPet] = useState({ nombre: "", raza: "", edad: "" });

  useEffect(() => {
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

  // Función para manejar la edición de una mascota
  const handleEdit = (pet) => {
    setEditingPet(pet);
    setNewPet({ nombre: pet.nombre, raza: pet.raza, edad: pet.edad });
  };

  // Función para guardar los cambios de la mascota editada
  const handleSaveEdit = () => {
    axios
      .put(`http://127.0.0.1:8000/pets/${editingPet.id}/`, newPet)
      .then((response) => {
        setPets(pets.map((pet) => (pet.id === editingPet.id ? response.data : pet)));
        setFilteredPets(filteredPets.map((pet) => (pet.id === editingPet.id ? response.data : pet)));
        setEditingPet(null);
        setNewPet({ nombre: "", raza: "", edad: "" });
      })
      .catch((err) => {
        setError("Error updating pet");
        console.error(err);
      });
  };

  // Función para eliminar una mascota
  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/pets/${id}/`)
      .then(() => {
        setPets(pets.filter((pet) => pet.id !== id));
        setFilteredPets(filteredPets.filter((pet) => pet.id !== id));
      })
      .catch((err) => {
        setError("Error deleting pet");
        console.error(err);
      });
  };

  // Función para agregar una nueva mascota
  const handleAddPet = () => {
    axios
      .post("http://127.0.0.1:8000/pets/", newPet)
      .then((response) => {
        setPets([...pets, response.data]);
        setFilteredPets([...filteredPets, response.data]);
        setNewPet({ nombre: "", raza: "", edad: "" });
      })
      .catch((err) => {
        setError("Error adding pet");
        console.error(err);
      });
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

      <div className="add-pet-container">
        <h2>Add a New Pet</h2>
        <input
          type="text"
          placeholder="Name"
          value={newPet.nombre}
          onChange={(e) => setNewPet({ ...newPet, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Breed"
          value={newPet.raza}
          onChange={(e) => setNewPet({ ...newPet, raza: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={newPet.edad}
          onChange={(e) => setNewPet({ ...newPet, edad: e.target.value })}
        />
        <button onClick={handleAddPet}>Add Pet</button>
      </div>

      {filteredPets.length > 0 ? (
        <ul className="pets-list">
          {filteredPets.map((pet) => (
            <li key={pet.id} className="pet-item">
              <div className="pet-details">
                <h3>{pet.nombre}</h3>
                <p><strong>Breed:</strong> {pet.raza}</p>
                <p><strong>Age:</strong> {pet.edad} years</p>
                <button onClick={() => handleEdit(pet)}>Edit</button>
                <button onClick={() => handleDelete(pet.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pets available</p>
      )}

      {editingPet && (
        <div className="edit-pet-container">
          <h2>Edit Pet</h2>
          <input
            type="text"
            value={newPet.nombre}
            onChange={(e) => setNewPet({ ...newPet, nombre: e.target.value })}
          />
          <input
            type="text"
            value={newPet.raza}
            onChange={(e) => setNewPet({ ...newPet, raza: e.target.value })}
          />
          <input
            type="number"
            value={newPet.edad}
            onChange={(e) => setNewPet({ ...newPet, edad: e.target.value })}
          />
          <button onClick={handleSaveEdit}>Save Changes</button>
          <button onClick={() => setEditingPet(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default PetsList;
