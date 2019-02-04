import React, { Component } from 'react';
import './App.css';
import Calendar from './components/Calendar';

class App extends Component {
  render() {
    return (
      <div className="App">
{/*         <header>
          <div id="logo">
            <span className="icon">date_range</span>
            <span>
              My React <b>Calendar</b>
            </span>
          </div>
        </header> */}
        <div className="main">
          <Calendar></Calendar>
        </div>
      </div>
    );
  }
}

export default App;
