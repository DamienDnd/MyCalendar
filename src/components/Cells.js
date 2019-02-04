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
          week : json
        }
        console.log(this.state.week);
        this.normalizeTimeBlocks(this.state.week);
        /* fetch(`/login/M1/idWeek/${this.props.week}-${this.props.year}`)
          .then(res => res.json())
          .then(data => this.setState({week : data}))
          .catch(error => console.log(error)); */
    }
    
    normalizeTimeBlocks = (appointments) => {
        // Des blocs de 15 minutes
        const blockTime = 15;
        const timeBlocks = {};
        const eventBlocks = {};
        
        appointments.map( function(item,index) {
          let hour = 0;
          let min = 0;
          if(item.heure.length === 3) {
            hour = item.heure.substring(0,1);
            min = item.heure.substring(1);
          } else {
            hour = item.heure.substring(0,2);
            min = item.heure.substring(2);
          }

          let startTime = formatTime(hour,min);

          let fin = (parseInt(item.heure) + parseInt(item.duree));
          let endHour = 0;
          let endMin = 0;

          if(item.heure.length === 3) {
            endHour = parseInt(fin.toString().substring(0,1));
            endMin = parseInt(fin.toString().substring(1));
          } else {
            endHour = parseInt(fin.toString().substring(0,2));
            endMin = parseInt(fin.toString().substring(2));
          }

          if(endMin === 60) {
            endHour = parseInt(endHour) +1;
            endMin = "00";
          }
          if(endMin > 60) {
            endHour = parseInt(endHour) +1;
            endMin = endMin - 60;
          }

          let endTime = formatTime(endHour.toString(), endMin.toString());

          let blockSpan = 0;

          let timeString = startTime;
          hour = parseInt(hour);
          min = parseInt(min);

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
        });
        
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
          let block = this.timeBlocks[time];
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

const json = [
  {"date":"2013-9-2","groupes":["M1"],"heure":"1630","profs":[{"NOM":"FISSON","PRENOM":"SYLVAIN"}],"idWeek":"36-2013-mo","duree":"130","salles":["IB119","IB117"],"id":"76d05671-471c-42ee-a39d-3a892c8f9e1c","matiere":"_M1TC7.13 MASTRIALES TD","type_activite":"TD"},

  {"date":"2013-9-2","groupes":["M1"],"heure":"830","idWeek":"36-2013-mo","duree":"130","salles":["IBGRANDAMPHI"],"id":"2c964507-db09-4f8c-9a03-78d2a3014014","matiere":"_PRE-RENTREE","type_activite":"CM"},

  {"date":"2013-9-3","groupes":["M1"],"heure":"1300","profs":[{"NOM":"FISSON","PRENOM":"SYLVAIN"}],"idWeek":"36-2013-tu","duree":"130","salles":["IB119","IB117"],"id":"04ec3867-e7a7-418e-8c93-2d60be27e9bd","matiere":"_M1TC7.13 MASTRIALES TD","type_activite":"TD"},

  {"date":"2013-9-3","groupes":["M1"],"heure":"830","profs":[{"NOM":"FISSON","PRENOM":"SYLVAIN"}],"idWeek":"36-2013-tu","duree":"130","salles":["IB119","IB117"],"id":"aa1d219b-cdde-42d0-82e9-9b58a8a13b01","matiere":"_M1TC7.13 MASTRIALES TD","type_activite":"TD"},

  {"date":"2013-9-3","groupes":["M1"],"heure":"1445","profs":[{"NOM":"FISSON","PRENOM":"SYLVAIN"}],"idWeek":"36-2013-tu","duree":"130","salles":["IB119","IB117"],"id":"3c0569d4-d877-4dd5-b651-227735243ef5","matiere":"_M1TC7.13 MASTRIALES TD","type_activite":"TD"},

  {"date":"2013-9-3","groupes":["M1"],"heure":"1015","profs":[{"NOM":"FISSON","PRENOM":"SYLVAIN"}],"idWeek":"36-2013-tu","duree":"130","salles":["IB119","IB117"],"id":"01bc7731-7ad1-4189-be24-d30946f7030c","matiere":"_M1TC7.13 MASTRIALES TD","type_activite":"TD"},

  {"date":"2013-9-2","groupes":["M1"],"heure":"1015","profs":[{"NOM":"FISSON","PRENOM":"SYLVAIN"}],"idWeek":"36-2013-mo","duree":"130","salles":["IB119","IB117"],"id":"b73148ae-14c8-467f-b82d-1e1e2ffda590","matiere":"_M1TC7.13 MASTRIALES TD","type_activite":"TD"},

  {"date":"2013-9-2","groupes":["M1"],"heure":"1445","profs":[{"NOM":"FISSON","PRENOM":"SYLVAIN"}],"idWeek":"36-2013-mo","duree":"130","salles":["IB119","IB117"],"id":"65880c6c-1db3-4e4f-8e11-8d787b68b369","matiere":"_M1TC7.13 MASTRIALES TD","type_activite":"TD"},

  {"date":"2013-9-2","groupes":["M1"],"heure":"1300","profs":[{"NOM":"FISSON","PRENOM":"SYLVAIN"}],"idWeek":"36-2013-mo","duree":"130","salles":["IB119","IB117"],"id":"b4f5cf82-6b92-4cc3-99bb-3fcc75ba3e54","matiere":"_M1TC7.13 MASTRIALES TD","type_activite":"TD"}

  ];