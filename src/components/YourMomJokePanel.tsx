'use client';

import React, { useState, useEffect } from 'react';
import styles from './YourMomJokePanel.module.css';

const jokes = [
  "Yo momma is so fat, when she skips a meal, the stock market drops.",
  "Yo momma is so fat, she got baptized at Sea World.",
  "Yo momma is so stupid, she stared at a cup of orange juice for 12 hours because it said \"concentrate\".",
  "Yo momma is so ugly, she made a blind kid cry.",
  "Yo momma is so poor, the ducks throw bread at her.",
  "Yo momma is so fat, I took a picture of her last Christmas and it's still printing.",
  "Yo momma is so old, her social security number is 1.",
  "Yo momma is so stupid, she put lipstick on her forehead to make up her mind.",
  "Yo momma is so short, she has to use a ladder to pick up a dime.",
  "Yo momma is so fat, when she wears a yellow raincoat, people yell \"taxi!\""
];

const YourMomJokePanel: React.FC = () => {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  }, []);

  const getNewJoke = () => {
    setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>A Chuckle for Your Troubles</h3>
      <p className={styles.jokeText}>{joke}</p>
      <button onClick={getNewJoke} className={styles.newJokeButton}>
        Another One!
      </button>
    </div>
  );
};

export default YourMomJokePanel; 