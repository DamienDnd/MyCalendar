import React, { Component } from 'react';
import './Calendar.css';
import dateFns from 'date-fns';
import frDate from 'date-fns/locale/fr';
import Cells from './Cells';

const formatWeek = "WW";

export default class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentWeek: new Date(2013,8,2),
            week: []
        };
        this.renderHeader = this.renderHeader.bind(this);
        this.renderWeek = this.renderWeek.bind(this);
        this.nextWeek = this.nextWeek.bind(this);
        this.prevWeek = this.prevWeek.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
        fetch(`/login/M1/idWeek/${dateFns.format(this.state.currentWeek, "WW")}-${dateFns.format(this.state.currentWeek, "YYYY")}`)
          .then(res => res.json())
          .then(data => this.setState({week : data.Items}))
          .catch(error => console.log(error));
    }

    // Le header contient le numéro de la semaine,
    // le jour de début et de fin de la semaine
    renderHeader() {
        // Format pour afficher le numéro de la semaine et l'année
        const dateFormat = "WW YYYY";
        const dateFormat2 = "DD";
        // on démarre à Monday et on termine à Sunday
        let startWeek = dateFns.startOfWeek(this.state.currentWeek, {weekStartsOn:1});
        let endWeek = dateFns.endOfWeek(this.state.currentWeek);
        return (
          <div className="header row flex-middle">
            <div className="col col-start">
              <div className="icon2" onClick={this.prevMonth}>arrow_back</div>
              <div className="icon" onClick={this.prevWeek}> chevron_left</div>
            </div>
            <div className="col col-center">
              <span>
                 Semaine : {dateFns.format(this.state.currentWeek, dateFormat)}
              </span>
            </div>
            <div className="col col-center">
              <span>
                Semaine du {dateFns.format(startWeek,dateFormat2)} au {dateFns.format(endWeek,dateFormat2)}
              </span>
            </div>
            <div className="col col-end" >
              <div onClick={this.nextWeek} className="icon">chevron_right</div>
              <div onClick={this.nextMonth} className="icon2">arrow_forward</div>
            </div>
          </div>
        );
      }
      // Fonction pour passer à la semaine suivante
      nextWeek = () => {
        fetch(`/login/M1/idWeek/${dateFns.format(dateFns.addWeeks(this.state.currentWeek, 1), "WW")}-${dateFns.format(dateFns.addWeeks(this.state.currentWeek, 1), "YYYY")}`)
          .then(res => res.json())
          .then(data => this.setState({week : data.Items, currentWeek: dateFns.addWeeks(this.state.currentWeek, 1)}))
          .catch(error => console.log(error));
      };
      // Fonction pour passer à la semaine précédente
      prevWeek = () => {
        fetch(`/login/M1/idWeek/${dateFns.format(dateFns.subWeeks(this.state.currentWeek, 1), "WW")}-${dateFns.format(dateFns.subWeeks(this.state.currentWeek, 1), "YYYY")}`)
        .then(res => res.json())
        .then(data => this.setState({week : data.Items, currentWeek: dateFns.subWeeks(this.state.currentWeek, 1)}))
        .catch(error => console.log(error));
      };
      // Fonction pour passer au mois suivant
      nextMonth = () => {
        fetch(`/login/M1/idWeek/${dateFns.format(dateFns.addMonths(this.state.currentWeek, 1), "WW")}-${dateFns.format(dateFns.addMonths(this.state.currentWeek, 1), "YYYY")}`)
          .then(res => res.json())
          .then(data => this.setState({week : data.Items, currentWeek: dateFns.addMonths(this.state.currentWeek, 1)}))
          .catch(error => console.log(error));
    };
    // Fonction pour passer au mois précédent
    prevMonth = () => {
      fetch(`/login/M1/idWeek/${dateFns.format(dateFns.subMonths(this.state.currentWeek, 1), "WW")}-${dateFns.format(dateFns.subMonths(this.state.currentWeek, 1), "YYYY")}`)
      .then(res => res.json())
      .then(data => this.setState({week : data.Items, currentWeek: dateFns.subMonths(this.state.currentWeek, 1)}))
      .catch(error => console.log(error));
    };
    // Fonction pour afficher les entêtes (=les jours de la semaine) du calendrier
    renderWeek() {
        const dateFormat = "dddd DD";
        const days = [];
        // De base on commence à Sunday jusqu'à Saturday, en mettant 1 on commence alors au 2ème jour
        // donc on commence a Monday = Lundi
        let startDate = dateFns.startOfWeek(this.state.currentWeek, {weekStartsOn:1});
        // On boucle de Lundi à Samedi
        for (let i = 0; i < 6; i++) {
          days.push(
            <div className="col col-center" key={i}>
              {dateFns.format(dateFns.addDays(startDate, i), dateFormat, {locale:frDate})}
            </div>
          );
        }
        return <div className="days row">{days}</div>;
    }
    // Fonction pour afficher les cellules de l'emploie du temps
    renderDays() {
      const currentWeek = this.state.currentWeek;
      const startWeekDate = dateFns.startOfWeek(currentWeek,{weekStartsOn:1});
      const endWeekDate = dateFns.endOfWeek(currentWeek);
      const rows = [];

      let days = [];
      let day = startWeekDate;

      while (day <= endWeekDate) {
        for (let i = 0; i < 6; i++) {
          days.push(
            <div className="col cell">
              <span className="number"></span>
              <span className="bg"></span>
            </div>
          );
          day = dateFns.addDays(day, 1);
        }
        rows.push(
          <div className="row" key={day}>
            {days}
          </div>
        );
        days = [];
      }
      return <div className="body">{rows}</div>;
    }

    render() {
      return (
          <div className="calendar">
            {this.renderHeader()}
            {this.renderWeek()}
            <Cells ArrayWeek={this.state.week} week={dateFns.format(this.state.currentWeek, formatWeek)} year={this.state.currentWeek.getFullYear()} ></Cells>
          </div>
      )
    }
}
