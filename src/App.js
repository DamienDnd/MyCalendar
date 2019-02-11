import React, { Component } from 'react';
import './App.css';
import Calendar from './components/Calendar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="main">
          <Calendar></Calendar>
        </div>
      </div>
    );
  }
}

export default App;
