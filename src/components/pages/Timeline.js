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
import * as entityConfig from '../../utils/EntityConfigurations'
import * as stringUtil from '../../utils/StringUtil'

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: new Date().getMonth(),
            selectedYear: new Date().getFullYear(),
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
            console.log("_________", month, year);
            this.setState({
                update: new Date(), selectedMonth: month, selectedYear: year
            });
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
        this.detail = (day, month, year) => {
            console.log("@DETAIL:", day, month, year);
            let events = this.getEventDetail(+day);
            this.setState({
                detailView: true, detailEvents: events, selectedDay: day,
                selectedMonth: month, selectedYear: year
            })
        }

        this.refresh = (selectedMonth, selectedYear) => {
            this.setState({
                updated: new Date(),
                selectedMonth: selectedMonth, selectedYear: selectedYear
            })
        }

        this.addEvent = () => {
            let config = entityConfig.eventConfig;

            this.props.getEntities({
                entityName: config.entityName,
                page: 0,
                limit: 10,
                entityConfig: config
            }, this.props.app);

            this.props.addEventFromTimeline(
                this.state.selectedDay,
                this.state.selectedMonth + 1, /*IMPORTANT*/
                this.state.selectedYear
            );

            this.props.history.push("/management");
        }
    }



    componentDidUpdate() {
        if (!this.props.division) {
            return;
        }
    }

    componentDidMount() {

    }
    render() {

        //validate division
        if (this.props.division == null) {
            return <h2>Silakan Pilih Badan Pengurus MPI</h2>
        }
        let title = <h2>TimeLine {this.props.division.name + " " + this.state.selectedYear}</h2>;

        let detailEvents = [];
        if (this.state.detailView == true) {
            this.state.detailEvents.forEach(event => {

                const eventDate = new Date(event.date).toString();

                let eventStatus = "Done";
                if(event.done == 0){
                    eventStatus = "Not Done";
                }else if(event.done != 1){
                    eventStatus = "Not Configured";
                }

                let content = <div>
                     <p>{eventDate}</p>
                    <GridComponent cols={2} items={[  
                        <label>Location</label>, <label>{event.location}</label>,

                        <label>Participant</label>, <label>{event.participant}</label>,

                        <label>Status</label>, <label>{eventStatus}</label>,

                        <label>Info</label>, <label>{event.info}</label>,
                    ]} />
                </div>

                let eventCard = <Card title={event.name}
                    content={content} style={{ width: '90%' }}
                />
                detailEvents.push(eventCard);
            });

            if (detailEvents.length == 0) {
                detailEvents = [
                    <div>No Agenda.</div>
                ]
            }
            return <div>
                {title}
                <p>Detail in {this.state.selectedDay + " " + stringUtil.monthYearString(
                    this.state.selectedMonth + 1,
                    this.state.selectedYear
                )}</p>
                <ActionButton onClick={() => { this.setState({ detailView: false }) }} text="Back" />
                <GridComponent width={"30%"} cols={3} items={detailEvents} />
                <ActionButton status="success" onClick={() => { this.addEvent() }} text="Add Event" />
            </div>
        }

        return (
            <div className="container">
                {title}
                <FullCalendar
                    division={this.props.division}
                    detail={this.detail} getEventByDate={this.getEventByDate}
                    refresh={this.refresh}
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
    getEntities: (request, app) => dispatch(actions.getEntityList(request, app)),
    getEventByDate: (m, y, app) => dispatch(actions.getEventByDate(m, y, app)),
    addEventFromTimeline: (d, m, y) => dispatch(actions.addEventFromTimeline(d, m, y))
})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Timeline)) 