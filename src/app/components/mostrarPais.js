// src/app/components/mostrarPais.js

"use client";  // Asegúrate de que esta línea esté al inicio del archivo

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './mostrarPais.module.css'; // Importa el archivo CSS

const CountriesList = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
        setCountries(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (countries.length > 0) {
      // Seleccionar una bandera aleatoria
      const randomIndex = Math.floor(Math.random() * countries.length);
      const selected = countries[randomIndex];
      setSelectedCountry(selected);

      // Generar opciones para adivinar
      const optionsCount = 4; // Número de opciones
      let options = [selected.country];

      // Seleccionar opciones aleatorias diferentes de la seleccionada
      while (options.length < optionsCount) {
        const randomIndex = Math.floor(Math.random() * countries.length);
        const option = countries[randomIndex].country;
        if (option !== selected.country && !options.includes(option)) {
          options.push(option);
        }
      }

      // Mezclar las opciones
      options = options.sort(() => Math.random() - 0.5);

      setOptions(options);
    }
  }, [countries]);

  const handleOptionClick = (option) => {
    if (option === selectedCountry.country) {
      alert('¡Correcto!');
    } else {
      alert('Intenta de nuevo.');
    }
    // Opcional: Puedes agregar lógica aquí para mostrar una nueva bandera y opciones
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.Banderas}>
      <h1>Adivina La Bandera</h1>
      {selectedCountry ? (
        <div>
          <img src={selectedCountry.flag} alt={`Flag of ${selectedCountry.country}`} width="100" />
          <p>¿De qué país es esta bandera?</p>
          <div className={styles.options}>
            {options.map(option => (
              <button key={option} onClick={() => handleOptionClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No country selected</p>
      )}
    </div>
  );
};

export default CountriesList;
