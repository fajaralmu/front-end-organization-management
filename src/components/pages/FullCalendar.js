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


class FullCalendar extends Component {
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

        this.calendarData = [];
        this.days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];


        this.month_now = 7;// 0;
        //let this.begin = { week: 2, day: 1, dayCount: 31 };
        this.begin = { week: 1, day: 3, dayCount: 31, info: "" };
        this.begin_old = { week: 0, day: 0, dayCount: 0, info: "" };
        this.year_now = 1945;
        //let month_label = document.getElementById("month");
        //let year_label = document.getElementById("year"); 
        this.input_month = document.getElementById("input_month");
        this.date_info = document.getElementById("date-info");
        this.running_month = 7;
        this.running_year = 1945;
        this.filterDayId = 0;
        this.filterMonthId = 0; this.dateFormId = 0;
        this.entity_Name = 0; this.entity_Prop = 0; this.dateFormId = 0;

        this.setSelectedMonth = (val) => {
            this.setState({ selectedMonth: val })
        }
        this.changeInputYear = (val, id) => {
            this.setState({ inputYearValue: val, activeId: id });
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
            this.props.getEventByDate(month, year );
        }

        this.getEventDetail = (day) => {
            if(this.props.getEventDetail){
                return this.props.getEventDetail(day);
            }

            return [];
        }
    }

    componentDidUpdate() {
        if (!this.props.division) {
            return;
        } 
        this.updateFields();
        if (_byId(this.state.activeId)) {
            _byId(this.state.activeId).focus();
        }
    }

    componentDidMount() {
         this.loadCalendar();
    }

    setDateElementId(dateID) { 
        this.dateFormId = dateID;
        let filterStr = "filter-" + dateID;
        this.filterDayId = (filterStr + ".day");
        this.filterMonthId = (filterStr + ".month");
        this.dateFormId = (filterStr + ".year");
    }

    updateFields() {
        this.input_month = document.getElementById("input_month");
        this.date_info = document.getElementById("date-info");
    }

    loadCalendar() {
        this.updateFields();
        this.createTable();
        this.begin_old = this.begin;
        this.begin = this.fillDay(this.month_now, true, this.begin);

        this.input_month.value = new Date().getMonth() + 1; 
        this.setCalendar();
        this.setState({ updated: new Date(), inputYearValue: new Date().getFullYear() });
    }
    setCalendar() {
        this.doSetCalendar();
    }

    doSetCalendar() {
        console.log("==start==");

        this.running_month = this.input_month ? this.input_month.value - 1 : new Date().getMonth();
        this.running_year = this.state.inputYearValue ? this.state.inputYearValue : new Date().getFullYear();
        let diff_year = +Math.abs(this.running_year - this.year_now);
        // alert("diff_year year:" + diff_year);
        let monthCount = 0;
        if (diff_year > 0)
            monthCount = (11 - this.month_now) + (diff_year > 1 ? ((diff_year - 1) * 12) : 0) + (+this.running_month);
        else
            monthCount = this.running_month - this.month_now;
        let less = false;
        if (this.running_year - this.year_now > 0) {
            less = false;
        } else if (this.running_year - this.year_now < 0) {
            less = true;
        } else {
            if (this.running_month - this.month_now > 0) {
                less = false;
            } else {
                less = true;
            }
        }
        monthCount = Math.abs(monthCount);
        //console.log("kurang dari: ", less);
        let current_month = this.month_now;
        let endMonth = (monthCount + this.month_now);
        if (monthCount <= 0)
            return;
        if (!less)
        ////console.log("month now",this.month_now,"diff_year",monthCount,"to",to);
        {
            for (let m = this.month_now + 1; m <= endMonth + 1; m++) {
                if (current_month > 11) {
                    current_month = 0;

                }
                this.month_now = current_month;
                let end = this.nextMonth();
                if (end) {
                    break;
                }
                ////console.log("month",current_month,"this.running_year",this.year_now);
                current_month++;
            }
        } else if (less) {
            let pastMonthCount = (this.month_now) + (diff_year > 1 ? ((diff_year - 1) * 12) : 0) + (11 - this.running_month);
            endMonth = (pastMonthCount + this.month_now);
            //console.log("month now", this.month_now, "diff_year", monthCount, "from", to);
            let begin_month = this.month_now;
            for (let b = endMonth + 1; b >= begin_month + 1; b--) {
                if (current_month < 0) {
                    current_month = 11;
                }
                this.month_now = current_month;
                let end = this.prevMonth();
                if (end) {
                    break;
                }
                ////console.log("b",b,"month",current_month);
                current_month--;
            } 
        }

        this.fillInfo();
        console.log("==end==")
    }

    fillInfo() {
        if (this.date_info)
            this.date_info.value = timeLineConstant.month[this.month_now].name + " " + this.year_now;
        this.refresh();

    } 

    detail(day, month, year) { 
        if(this.props.detail){
            this.props.detail(day, month, year);
        } 
    }

    prevMonth() {
        this.setState({ updated:new Date()})
        return this.doPrevMonth(false);
    }

    doPrevMonth(prev) {
        this.month_now--;
        if (prev) {
            this.running_month--;
        }
        if (this.month_now < 0) {
            this.month_now = 11;
            this.year_now--;
            if (prev) {
                this.running_month = 11;
                this.running_year--;
            }
        }
        let begin_prev = this.findBegin(this.begin_old, this.begin_old.dayCount);

        this.begin_old = {
            week: begin_prev.week,
            day: begin_prev.day,
            dayCount: begin_prev.dayCount,
        }
        let switch_ = this.fillDay(this.month_now, false, begin_prev);
        this.begin = {
            week: switch_.week,
            day: switch_.day,
            dayCount: switch_.dayCount
        }
        this.refresh();
        return switch_.info == "NOW";
    }

    nextMonth() {
        this.setState({ updated:new Date()})
        return this.doNextMonth(false);
    }

    refresh() {
        if(this.props.refresh){
            this.props.refresh();
        }
    }

    doNextMonth(next) {
        console.log("NEXT")
        this.month_now++;
        if (next) {
            this.running_month++;
        }
        if (this.month_now > 11) {
            this.month_now = 0;
            this.year_now++;
            if (next) {
                this.running_month = 0;
                this.running_year++;
            }
        }

        let switch_ = this.fillDay(this.month_now, true, this.begin);
        this.begin_old = {
            week: this.begin.week,
            day: this.begin.day,
            dayCount: this.begin.dayCount,
        }
        this.begin = {
            week: switch_.week,
            day: switch_.day,
            dayCount: switch_.dayCount,
        }
        this.refresh();
        return switch_.info == "NOW";

    }

    findBegin(begin_old_, totalday) {
        let M = this.month_now - 1;
        if (M < 0) {
            M = 11;
        }
        let day = begin_old_.day;
        let week = 6;
        let begin_prev_ = {
            week: 0,
            day: 0,
            dayCount: timeLineConstant.month[M].day
        }

        for (let D = totalday; D >= 0; D--) {
            if (day <= 0) {
                day = 7;
                week--;
            }
            day--;
        }
        begin_prev_.week = week;
        begin_prev_.day = day + 1;
        return begin_prev_;
    }

    setElementByAttr(val, val2, day) {
        for (let i = 0; i < this.calendarData.length; i++) {
            let data = this.calendarData[i];

            if (data.week == val && data.day == val2) {
                if (new Date().getDate() == day &&
                    new Date().getMonth() == this.month_now &&
                    new Date().getYear() + 1900 == this.year_now) {

                    console.log("NOW", i);
                    this.calendarData[i].now = true;
                } else {
                    console.log("NOT NOW", i);
                    this.calendarData[i].now = false;
                }
                this.calendarData[i].text = day;
            }
        }
    }

    addNewEvent(day, month, year) {

        let strDate = this.dateAcceptableForHtmlInput(day, month, year);
        document.getElementById(this.dateFormId).value = strDate;
    }

    dateAcceptableForHtmlInput(day, month, year) {
        return year + "-" + this.addZero(month, 10) + "-" + this.addZero(day, 10);
    }

    addZero(Val, Min) {
        let N = new String(Val);
        let MinStr = new String(Min);

        let ValLength = N.length;
        let MinLength = MinStr.length;
        let Diff = MinLength - ValLength;
        for (let i = 1; i <= Diff; i++) {
            N = new String("0").concat(N);
        }

        return N;
    }

    clear() {

        for (let i = 0; i < this.calendarData.length; i++) {
            this.calendarData[i].text = "";
        }

        timeLineConstant.month[1].day = 28 + (+this.year_now % 4 == 0 ? 1 : 0);
    }

    fillDay(current_month, next, begin) {
        this.clear();
        let begin_new = {
            week: begin.week,
            day: begin.day,
            dayCount: begin.dayCount
        };
        let begin_old_ = {
            week: begin.week,
            day: begin.day,
            dayCount: begin.dayCount
        };
        let week_ = begin_new.week;
        let begin_week = week_;
        if (begin_new.week > 1 && begin_new.day > 1) {
            week_ = 1;
            begin_week = 1;
        }
        let day_ = begin_new.day;
        let begin_day = day_;
        let isNow = this.running_month == current_month && this.running_year == this.year_now;
        //  console.log("isNow", isNow,this.running_month,'=',current_month, this.running_month == current_month,this.running_year,'=',this.year_now, this.running_year == this.year_now)
        for (let d = 1; d <= timeLineConstant.month[current_month].day; d++) {
            if (day_ > 7) {
                day_ = 1;
                week_++;
            }
            if (isNow) {
                this.setElementByAttr(week_, day_, d);
            }
            day_++;
        }
        begin_new.week = week_ >= 5 ? 2 : 1;
        begin_new.day = day_;
        begin_new.dayCount = timeLineConstant.month[current_month].day;
        //console.log("old", begin_old_.day, begin_old_.week);
        //console.log("   ");
        //console.log("new", begin_new.day, begin_new.week);
        this.fillInfo();
        if (isNow) {
            // this.detail(null, (+this.running_month + 1), this.running_year);
            begin_new.info = "NOW";
            this.getEventByDate(this.running_month + 1, this.running_year);
        } else {
            begin_new.info = "SOME-DAY";
        }



        return begin_new;
    }

    render() {
        //validate division
        let selectedYear = this.state.inputYearValue;

        let totalCalendarData = this.days.map(day => {
            return ({ text: day, title: true })
        })

        this.calendarData.forEach(element => {
            totalCalendarData.push(element);
        });

        let calendarData = totalCalendarData.map(
            data => {

                if (data.text == null || data.text == "") {
                    return <div></div>
                }

                let style = { width: '80%', minHeight: '150px', marginBottom: '15px' };

                if (data.title == true) {
                    return (<div>{data.text}</div>)
                }

                if (data.now == true) {
                    style = {
                        ...style,
                        backgroundColor: 'lightgreen'
                    }
                }

                let events = this.getEventDetail(+data.text);
                let i = 0;
                let eventList = events.map(event => {
                    i++;
                    if (i <= 3) {

                        return <p key={"EVT_" + i}>{event.name}</p>
                    } else if (i == 4) {
                        return <ActionButton onClick={() => { }} text={"detail " + i} />
                    } else {
                        return null;
                    }


                });
                console.log(data.text, "EVENTS: ", events);

                return (
                    <Card style={style} title={data.text}
                        onClick={() => this.detail(data.text, this.state.selectedMonth, this.year_now)}
                        content={eventList}
                    />
                )
            }
        )


        let content = <div id="calendar-wrapper">

            <GridComponent cols={3} style={{
                textAlign: 'center', width: '400px'
            }} items={[
                <ComboBox id="input_month" defaultValue={this.state.selectedMonth} onChange={this.setSelectedMonth}
                    options={timeLineConstant.month} />,
                <InputField type="number" id="input_year" value={selectedYear} onKeyUp={this.changeInputYear} />,
                <ActionButton onClick={(e) => this.setCalendar()} text={"Go"} />,
                <ActionButton onClick={(e) => this.doPrevMonth(true)} text={"Prev"} />,
                <input disabled className="form-control" id="date-info" />,
                <ActionButton onClick={(e) => this.doNextMonth(true)} text={"Next"} />
            ]}

            />
            <p></p>
            <p></p>
            <GridComponent cols={7} items={calendarData} />
        </div>;


        return (
             content  
        );

    }
}

export default FullCalendar;