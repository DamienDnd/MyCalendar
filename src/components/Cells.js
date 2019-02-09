import React, { Component } from 'react';
import './Cells.css';
import Cours from './Cours';

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
        
        this.state = {
          week : []
        }
    }
    
    normalizeTimeBlocks = (appointments) => {
        // Des blocs de 15 minutes
        const blockTime = 15;
        const timeBlocks = {};
        const eventBlocks = {};
        
        appointments.map( function(item,index) {
          let hour = 0;
          let min = 0;
          // Si l'heure est 830 pour 8h30
          if(item.heure.length === 3) {
            hour = item.heure.substring(0,1);
            min = item.heure.substring(1);
          } else {
            hour = item.heure.substring(0,2);
            min = item.heure.substring(2);
          }
          // Si l'heure de départ est 830 alors on affichera 08:30
          let startTime = formatTime(hour,min);
          // On additionne l'heure de début et la durée du cours (ex : 830 + 130 = 960)
          let fin = (parseInt(item.heure) + parseInt(item.duree));
          let endHour = 0;
          let endMin = 0;
          // Si l'heure de fin est toujours a 3 caractères comme 960
          if(fin.toString().length === 3) {
            endHour = parseInt(fin.toString().substring(0,1));
            endMin = parseInt(fin.toString().substring(1));
          } else {
            endHour = parseInt(fin.toString().substring(0,2));
            endMin = parseInt(fin.toString().substring(2));
          }
          // Si on a 960 alors les minutes passent à 0 et on rajoute 1h
          if(endMin === 60) {
            endHour = parseInt(endHour) +1;
            endMin = "00";
          }
          // Si on a plus de 60min : 75 alors on retire 60min, on ajoute 1h et on conserve les 15 minutes
          if(endMin > 60) {
            endHour = parseInt(endHour) +1;
            endMin = endMin - 60;
          }
          // Maintenant on a notre date de fin (ex : 10:00 et pas 09:60)
          let endTime = formatTime(endHour.toString(), endMin.toString());

          let blockSpan = 0;

          let timeString = startTime;
          hour = parseInt(hour);
          min = parseInt(min);
          // On boucle tant que la date de début est différente de la date de fin 
          while (timeString !== endTime) {
            blockSpan++;
            min += blockTime;
            
            if (min >= 60) {
              min = 0;
              hour += 1;
            }
            timeString = formatTime(hour, min);
          }
          
          eventBlocks[startTime] = eventBlocks[startTime] || {};
          eventBlocks[startTime][item.id] = Object.assign({}, item, {
            blockSpan, startTime, endTime
          });
        }); // Fin du map
        
        for (let hour = 8; hour < 20; hour++) {
          for (let minutes = 0; minutes < 60; minutes += blockTime) {
            const timeString = formatTime(hour, minutes);
          
            timeBlocks[timeString] = eventBlocks[timeString] || {};
          }
        } // fin du double for
        this.timeBlocks = timeBlocks;
        return timeBlocks;
    }; // fin de normalizeTimeBlocks()
    
    render() {
        const rows = [];
        let timeBlocks = this.normalizeTimeBlocks(this.props.ArrayWeek);
        for (let time in timeBlocks) {
          let block = timeBlocks[time];
          block = Object.entries(block);
          if(block.length > 0)  {
            block = block.flat();
            block = block.filter( function(item,index) {
              return (index %2 === 1);
            }) 
          }
            rows.push(
              <div className="calendar__row" key={time}>
                <div className="calendar__cell calendar__cell--time calendar__cell--time-col">{(time.endsWith("0"))?time:""}</div>
                <div className="calendar__cell calendar__cell--appointment calendar__cell--time-spacing"></div>
                <Cours array={(block.length === 0)? [] : block.filter(item => {
                   return (item.idWeek.endsWith("-mo"));
                })}></Cours>
                <Cours array={(block.length === 0)? [] : block.filter(function (item){
                  return (item.idWeek.endsWith("-tu"))
                })}></Cours>
                <Cours array={(block.length === 0)? [] : block.filter(function (item){
                  return (item.idWeek.endsWith("-we"))
                })}></Cours>
                <Cours array={(block.length === 0)? [] : block.filter(function (item){                
                  return (item.idWeek.endsWith("-th"))
                })}></Cours>
                <Cours array={(block.length === 0)? [] : block.filter(function (item){
                  return (item.idWeek.endsWith("-fr"))
                })}></Cours>
                <div className="calendar__cell calendar__cell--appointment calendar__cell--weekend"></div>
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