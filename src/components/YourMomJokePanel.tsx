'use client';

import React, { useState, useEffect } from 'react';
import styles from './YourMomJokePanel.module.css';

const jokes = [
  "\"Why were you late to work today?\" \"Sorry boss, I was doing... overtime. With your mom.\"",
  "\"Dude, where did you get that new watch?\" \"Your mom said I deserved a little something for my troubles.\"",
  "\"You seem really happy today, what's up?\" \"Let's just say your mom's a great motivational speaker.\"",
  "\"Why is your phone always on silent?\" \"Priorities. And your mom prefers uninterrupted conversations.\"",
  "\"My therapist told me I have a fear of commitment.\" \"Funny, that's not what your mom said last night.\""
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