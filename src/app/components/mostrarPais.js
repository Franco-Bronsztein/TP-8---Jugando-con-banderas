// src/app/components/mostrarPais.js

"use client";  // Agrega esta línea al inicio del archivo

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountriesList = () => {
  const [countries, setCountries] = useState([]);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Countries and Flags</h1>
      <ul>
        {countries.map(country => (
          <li key={country.country}>
            <img src={country.flag} alt={`Flag of ${country.country}`} width="50" />
            {country.country}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountriesList;
