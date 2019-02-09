import React, { Component } from 'react'
import './Cours.css';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class Cours extends Component {

    render() {
        let cellules = null;
        if(this.props.array !== undefined && this.props.array.length > 0) {
            const blockSpan = this.props.array[0].blockSpan;
            const height = (100 * blockSpan) + '%';
            const borderPixels = (blockSpan + 1) + 'px';
            const cssHeight = 'calc(' + height + ' + ' + borderPixels + ')';
            cellules = (
                <CoursCell style={{ height: cssHeight }} array={this.props.array[0]} />
            ); 
        }
        return (
            <div className='calendar__cell calendar__cell--appointment'>
                {cellules}
            </div>
        );
    }
}

class CoursCell extends Component {
    constructor(props) {
        super(props);
    
        this.togglePopover = this.togglePopover.bind(this);
        this.state = {
          popOpen: false
        };
    }
    
    togglePopover() {
        this.setState({
          popOpen: !this.state.popOpen
        });
    }

    render() {
        let prof=[];
        let profText=[];
        let salle=[];
        let array = this.props.array
        if(Object.keys(array).includes("salles"))
            salle.push(<div className="cell_content">{`Salle  : ${array.salles.join(", ")}`}</div>);
        if(Object.keys(array).includes("profs")){
            prof.push(<div className="cell_content">{`${array.profs.map(ele=>ele.NOM).join(", ")}`}</div>);
            profText.push(`Prof : ${array.profs.map(ele=>ele.NOM).join(", ")}`);
        }
        let matiere ="";
        matiere = array.matiere.replace(/_\S+ /,"").replace(/TD|CM|TP/,"").split(".")[0].replace(/_/,"").replace(/\s$/,"").replace(/\s\s+\S*$/,"").replace(/\s[0-9]+$/,"");

        if(this.props.array) {
            let infos = this.props.array;
            console.log(array);
            return (    
                <div id={"Popover" + (infos.id).substring(0,4)} style={this.props.style} className={"calendar__appointment " + infos.type_activite} onClick={this.togglePopover}>
                    <div className="calendar__appointment__time">
                        {infos.type_activite} : {infos.startTime} - {infos.endTime}
                    </div>
                    <div className="calendar__appointment__matiere">
                        {matiere}
                    </div>     
                    <div className="calendar__appointment__prof">
                        {prof}
                    </div>
                    {salle}
                    <UncontrolledPopover trigger="legacy" placement="bottom" target={"Popover" + (infos.id).substring(0,4)} >
                        <PopoverHeader className={infos.type_activite}>{infos.type_activite} : {infos.startTime} - {infos.endTime}</PopoverHeader>
                        <PopoverBody>
                            Matière : {matiere}
                            <br></br>
                            {profText}
                            {salle}
                        </PopoverBody>
                    </UncontrolledPopover>
                </div>
            )
        } 
    }
}