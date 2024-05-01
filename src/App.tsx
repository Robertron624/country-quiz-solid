import type { Component } from 'solid-js';

import styles from './App.module.scss';

const App: Component = () => {
  return (
    <div class={styles.App}>
        <h1>
          Hello world!
        </h1>
    </div>
  );
};

export default App;
