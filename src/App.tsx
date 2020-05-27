import React from 'react';
import ScrumHours from './ScrumHours';

import './App.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

function App() {
  const defaultTheme = createMuiTheme();
  return (
    <div className="App">
      <ThemeProvider theme={defaultTheme}>

        <ScrumHours></ScrumHours>
      </ThemeProvider>

    </div>
  );
}

export default App;
