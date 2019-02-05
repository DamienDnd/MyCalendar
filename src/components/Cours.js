import React, { Component } from 'react'
import './Cours.css';

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

    render() {
        if(this.props.array) {
            let infos = this.props.array;
            return (    
                <div style={this.props.style} className={"calendar__appointment " + infos.type_activite}>
                    <div className="calendar__appointment__time">
                        {infos.type_activite} : {infos.startTime} - {infos.endTime}
                    </div>
                    <br></br>
                    <div className="calendar__appointment__name">
                        Cours : {infos.matiere}
                    </div>
                </div>
            )
        } else {
            return (    
                <div>
                vide
                </div>
            )
        }
    }
}