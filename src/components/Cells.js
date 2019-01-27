import React, { Component } from 'react';
import './Cells.css';

// Fonction pour éviter que les 0 soient retirer des strings (ex: 08:00 s'afficheraient 8:0)
const zeroToHero = (number, padding) => (
    padding.substring(number.toString().length) + number
);
  
// Fonction pour afficher les horaires avec ce format : 10:00
const formatTime = (hours, minutes) => (
    `${zeroToHero(hours, '00')}:${zeroToHero(minutes, '00')}`
);

// La classe qui affiche les cellules du calendar
export default class Cells extends Component {
    constructor(props) {
        super(props);
        this.normalizeTimeBlocks(props.appointments);
    }
    
    normalizeTimeBlocks = (appointments) => {
        // Des blocs de 15 minutes
        const blockTime = 30;
        const timeBlocks = {};
        const eventBlocks = {};
        
        for (let day in appointments) {
          appointments[day].forEach(appointment => {
            const startTime = appointment.debut;
            const endTime = appointment.fin;
            let blockSpan = 0;
            
            if (startTime === '08:00' && endTime === '20:00') {
                blockSpan = Math.ceil(24 * 60 / blockTime);
            }
            else {
              const startSplit = startTime.split(':');
              let hour = parseInt(startSplit[0]);
              let minutes = parseInt(startSplit[1]);
              let timeString = appointment.startTime;
    
              while (timeString !== appointment.fin) {
                blockSpan++;
                minutes += blockTime;
    
                if (minutes >= 60) {
                  minutes = 0;
                  hour += 1;
                }
    
                timeString = formatTime(hour, minutes);
              }
            }
            
            eventBlocks[startTime] = eventBlocks[startTime] || {};
            eventBlocks[startTime][day] = Object.assign({}, appointment, {
              blockSpan
            });
          });
        }
        
        for (let hour = 8; hour < 20; hour++) {
          for (let minutes = 0; minutes < 60; minutes += blockTime) {
            const timeString = formatTime(hour, minutes);
          
            timeBlocks[timeString] = eventBlocks[timeString] || {};
          }
        }
        this.timeBlocks = timeBlocks;
    };
    
    render() {
        const rows = [];

        for (let time in this.timeBlocks) {
          rows.push(
            <div className="calendar__row" key={time}>
              <div className="calendar__cell calendar__cell--time calendar__cell--time-col">{time}</div>
              <div className="calendar__cell calendar__cell--appointment calendar__cell--time-spacing" />
              <div className="calendar__cell calendar__cell--appointment" />
              <div className="calendar__cell calendar__cell--appointment" />
              <div className="calendar__cell calendar__cell--appointment" />
              <div className="calendar__cell calendar__cell--appointment" />
              <div className="calendar__cell calendar__cell--appointment" />
              <div className="calendar__cell calendar__cell--appointment calendar__cell--weekend" />
            </div>
          );
        }
        
        return (
          <div className="calendarGrid">
              <div className="calendar__body">
                {rows}
              <div className="calendar__row calendar__row--deco-last-row">
                <div className="calendar__cell calendar__cell--time calendar__cell--time-col">20:00</div>
                <div className="calendar__cell calendar__cell--appointment" />
              </div>
              </div>
          </div>
        );
    }
}
