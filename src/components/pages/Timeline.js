import React, { Component } from 'react'
import '../../css/Common.css'
import '../../css/Timeline.css'
import * as timeLineConstant from '../../constant/TimelineConstant'
import ActionButton from '../buttons/ActionButton';
import ComboBox from '../input/ComboBox';
import InputField from '../input/InputField'
import { _byId } from '../../utils/ComponentUtil'
import GridComponent from '../layout/GridComponent';
import Card from '../card/Card';
import { withRouter } from 'react-router';
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
import FullCalendar from './FullCalendar';

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: new Date().getMonth(),
            inputYearValue: new Date().getFullYear(),
            activeId: "",
            detailView: false,
            detailEvents: [],
            selectedDay: 0
        } 
 
        this.createTable = () => {
            //console.log("BUAT this.tabel"); 
            let calendarData = [];
            for (let r = 1; r <= 6; r++) {
                for (let i = 1; i <= 7; i++) {
                    calendarData.push({ day: i, week: r });
                }
            }
            this.calendarData = calendarData;
        }

        this.getEventByDate = (month, year) => {

            this.props.getEventByDate(month, year, this.props.app);
        }

        this.getEventDetail = (day) => {
            let events = this.props.events;
            let result = [];

            events.forEach(event => {
                let date = new Date(event.date);
                if (date.getDate() == day) {
                    result.push(event);
                }
            });

            return result;
        }
        this.detail=  (day, month, year) => {
         
            let events = this.getEventDetail(+day); 
             this.setState({ detailView: true, detailEvents: events, selectedDay: day })
        }
    }

  

    componentDidUpdate() {
        if (!this.props.division) {
            return;
        }
    }

    componentDidMount() {

    }
    refresh() {
        this.setState({ updated: new Date(), selectedMonth: this.month_now + 1, inputYearValue: this.year_now })
    }


    render() {


        //validate division
        if (this.props.division == null) {
            return <h2>Silakan Pilih Badan Pengurus MPI</h2>
        }
        let detailEvents = [];
        if (this.state.detailView == true) {
            this.state.detailEvents.forEach(event => {

                let content = <div>
                    <p>{"Date:" + event.date}</p>
                    <p>{"Info:" + event.info}</p>
                    <p>{"Participant:" + event.participant}</p>
                    <p>{"Location:" + event.location}</p>
                    <p>{"Status:" + (event.done ? "done" : "not done")}</p>
                </div>

                let eventCard = <Card title={event.name}
                    content={content}
                />
                detailEvents.push(eventCard);
            });

            if (detailEvents.length == 0) {
                detailEvents = [
                    <div>No Agenda.</div>
                ]
            }
            return <div>
                <ActionButton onClick={() => { this.setState({ detailView: false }) }} text="Back" />
                <GridComponent cols={4} items={detailEvents} />
            </div>
        }

        return (
            <div className="container">
                <h2>TimeLine {this.props.division.name + " " + this.state.inputYearValue}</h2>
                <FullCalendar
                    division={this.props.division}
                    detail={this.detail} getEventByDate={this.getEventByDate}
                    events={this.props.events} getEventDetail={this.getEventDetail}
                />

            </div>
        );
    }
}
const mapStateToProps = state => {
    //console.log(state);
    return {
        events: state.managementState.events,
        division: state.userState.division
    }
}

const mapDispatchToProps = dispatch => ({
    getEventByDate: (m, y, app) => dispatch(actions.getEventByDate(m, y, app)),
})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Timeline)) 