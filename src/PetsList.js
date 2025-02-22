// src/PetsList.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PetsList.css"; // Se añadió un archivo CSS para la interfaz

function PetsList() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
            </li>
          ))}
        </ul>
      ) : (
        <p>No pets available</p>
      )}
    </div>
  );
}

export default PetsList;
