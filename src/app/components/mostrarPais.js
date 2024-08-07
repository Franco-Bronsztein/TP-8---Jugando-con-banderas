"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './mostrarPais.module.css';

const RandomFlag = () => {
  const [randomFlag, setRandomFlag] = useState(null);
  const [correctCountry, setCorrectCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [points, setPoints] = useState(0);
  const [player, setPlayer] = useState('');
  const [isPlayerSet, setIsPlayerSet] = useState(false);
  const [playerHistory, setPlayerHistory] = useState([]);
  const [flagsGuessed, setFlagsGuessed] = useState(0);

  const fetchRandomFlag = async () => {
    try {
      const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
      const countries = response.data.data;

      if (countries.length > 0) {
        const randomIndex = Math.floor(Math.random() * countries.length);
        const randomCountry = countries[randomIndex];
        setRandomFlag(randomCountry.flag);
        setCorrectCountry(randomCountry.name);
        const otherCountries = countries.filter((_, index) => index !== randomIndex);
        const shuffledCountries = otherCountries.sort(() => 0.5 - Math.random());
        const randomOptions = shuffledCountries.slice(0, 3).map(country => country.name);
        const optionsWithCorrect = [...randomOptions];
        optionsWithCorrect.splice(Math.floor(Math.random() * 4), 0, randomCountry.name);

        setOptions(optionsWithCorrect);
        setResult(null); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomFlag();
  }, []);

  const handleOptionClick = (option) => {
    if (option === correctCountry) {
      setPoints(prev => prev + 10);
      setFlagsGuessed(prev => prev + 1);
      setResult("¡Correcto! Adivinaste la bandera.");
      setTimeout(fetchRandomFlag, 1000); 
    } else {
      setPoints(prev => prev - 1);
      setResult("Incorrecto. Inténtalo de nuevo.");
    }
  };

  const handlePlayerSubmit = (e) => {
    e.preventDefault();
    setIsPlayerSet(true);
  };

  const handleChangePlayer = () => {
    setPlayerHistory(prev => [...prev, { player, points, flagsGuessed }]);
    setIsPlayerSet(false);
    setPlayer('');
    setPoints(0);
    setFlagsGuessed(0);
  };

  if (!isPlayerSet) {
    return (
      <div className={styles.PlayerInput}>
        <h2>Ingrese su nombre:</h2>
        <form onSubmit={handlePlayerSubmit}>
          <input
            type="text"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.Banderas}>
      <div className={styles.PointsCounter}>
        Jugador: {player} | Puntos: {points} | Banderas Adivinadas: {flagsGuessed}
      </div>
      <button className={styles.ChangePlayerButton} onClick={handleChangePlayer}>
        Cambiar Jugador
      </button>
      <h1>Adivina La Bandera</h1>
      {randomFlag ? (
        <>
          <img src={randomFlag} alt="Random Flag" />
          <div>
            {options.map((option, index) => (
              <button
                key={index}
                className={styles.optionButton}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {result && <p>{result}</p>}
        </>
      ) : (
        <p>No flag available</p>
      )}
      {playerHistory.length > 0 && (
        <div className={styles.PlayerHistory}>
          <h2>Historial de Jugadores</h2>
          <table>
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Puntos</th>
                <th>Banderas Adivinadas</th>
              </tr>
            </thead>
            <tbody>
              {playerHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.player}</td>
                  <td>{entry.points}</td>
                  <td>{entry.flagsGuessed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RandomFlag;
