import React, { Component } from 'react'
import '../../css/Common.css'
import '../../css/Timeline.css'
import * as timeLineConstant from '../../constant/TimelineConstant'
import ActionButton from '../buttons/ActionButton';
import ComboBox from '../input/ComboBox';
import InputField from '../input/InputField'
import { _byId } from '../../utils/ComponentUtil'
import GridComponent from '../layout/GridComponent';



class Timeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: new Date().getMonth(),
            inputYearValue: new Date().getFullYear(),
            activeId: ""
        }

        this.calendarData = [];

        this.month_now = 7;// 0;
        //let this.begin = { week: 2, day: 1, dayCount: 31 };
        this.begin = { week: 1, day: 3, dayCount: 31, info: "" };
        this.begin_old = { week: 0, day: 0, dayCount: 0, info: "" };
        this.year_now = 1945;
        //let month_label = document.getElementById("month");
        //let year_label = document.getElementById("year");
        this.tabel = document.getElementById("calendarTable");
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
            let tBody = document.createElement("tbody");
            let calendarData = [];
            for (let r = 1; r <= 6; r++) {
                let tr = document.createElement("tr");
                // tr.setAttribute("week",r); 
                for (let i = 1; i <= 7; i++) {
                    let col = document.createElement("td");
                    col.setAttribute("class", "date_element");
                    col.setAttribute("day", +i);
                    col.setAttribute("week", +r);
                    col.style.wordWrap = "normal";
                    tr.appendChild(col);
                    //set state data
                    calendarData.push({ day: i, week: r });
                }
                tBody.appendChild(tr);
            }

            this.calendarData = calendarData;
            this.tabel.className = "table table-bordered";
            this.tabel.style.tableLayout = "fixed";
            this.tabel.appendChild(tBody);


        }
    }

    initEntity(entityName, propName, dateID) {
        this.entity_Name = entityName;
        this.entity_Prop = propName;
        console.log("entity Name and prop ", this.entity_Name, this.entity_Prop);
        this.setDateElementId(dateID);

    }

    componentDidUpdate() {
        console.log("CALENDAR ROW:", this.calendarData);
        this.updateFields();
        if (_byId(this.state.activeId)) {
            _byId(this.state.activeId).focus();
        }
    }

    componentDidMount() {
        this.loadCalendar();
    }

    setDateElementId(dateID) {
        console.log("Set date id field ", dateID);
        this.dateFormId = dateID;
        let filterStr = "filter-" + dateID;
        this.filterDayId = (filterStr + ".day");
        this.filterMonthId = (filterStr + ".month");
        this.dateFormId = (filterStr + ".year");
    }

    updateFields() {
        this.tabel = document.getElementById("calendarTable");
        this.input_month = document.getElementById("input_month");
        this.date_info = document.getElementById("date-info");
    }

    loadCalendar() {
        this.updateFields();
        this.createTable();
        this.begin_old = this.begin;
        this.begin = this.fillDay(this.month_now, true, this.begin);

        this.input_month.value = new Date().getMonth() + 1;
        this.setState({ inputYearValue: new Date().getFullYear() });
        this.setCalendar();
        this.setState({ updated: new Date() })
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

    clearDateFilter() {
        this.detail("", "", "");
    }

    detail(day, month, year) {
        let filterDay = document.getElementById(this.filterDayId);
        let filterMonth = document.getElementById(this.filterMonthId);
        let filterYear = document.getElementById(this.dateFormId);

        console.log("DETAIL", day, month, year);
        if (filterDay == null || filterMonth == null || filterYear == null) {
            console.log("NULL", this.filterDayId, this.filterMonthId, this.dateFormId)
            return;
        }
        filterDay.value = day;
        filterMonth.value = month;
        filterYear.value = year;

        this.filterEntity(null, null, null);

        this.loadList("externalRequest");
        this.loadJSON();
    }

    loadJSON() { }

    fillEventData(eventList) {
        let dateCells = document.getElementsByClassName("date_element");
        for (let i = 0; i <= 31; i++) {
            if (document.getElementById("date-list-" + i) != null)
                document.getElementById("date-list-" + i).innerHTML = "";
        }

        for (let i = 0; i < eventList.length; i++) {

            let event = eventList[i];
            var evDate = event.date.replace('/', '').replace("Date", "").replace('(', '').replace(')', '').replace('/', '');
            let day = +(evDate) / (24 * 60 * 60 * 1000);
            let date = new Date(+evDate);
            let dateCell = document.getElementById("date-list-" + date.getDate());

            if (dateCell.getElementsByTagName("li") != null && dateCell.getElementsByTagName("li").length >= 3) {
                console.log("more than 3");
                console.log("-");
                if (dateCell.getElementsByTagName("code").length == 0) {
                    let info = document.createElement("code");
                    info.innerHTML = "click details <br/>to see more";
                    dateCell.appendChild(info);
                }
                continue;
            }
            //  console.log("ID: ", "date-list-" + date.getDate(), date)
            //console.log("-");
            let li = document.createElement("li");
            li.className = "li-custom li-uncheck";
            let evtName = document.createElement("span");
            evtName.innerHTML = event[this.entity_Prop];
            evtName.className = "text-wrap";
            evtName.style.fontFamily = "Calibri";
            //  evtName.style.color = "black";

            if (event.done == 1 || event.done == "1") {
                li.className = "li-custom li-checked";
            }
            li.appendChild(evtName);

            dateCell.appendChild(li);
        }
    }

    prevMonth() {
        this.setState({ activeId: "xx" })
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
        this.setState({ activeId: "xx" })
        return this.doNextMonth(false);
    }

    refresh() {
        this.setState({ updated: new Date(), selectedMonth: this.month_now + 1, inputYearValue: this.year_now })
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
        let dates = document.getElementsByClassName("date_element");

        let calendarData = this.calendarData;
        
        let a = 0;
        for (let i = 0; i < calendarData.length; i++) {
            let data = calendarData[i];

            let cek = data.week == val;
            let cek2 = data.day == val2;
            if (cek && cek2) {

                dates[i].innerHTML = "";
                dates[i].id = "date-" + day;
                if (new Date().getDate() == day && new Date().getMonth() == this.month_now && new Date().getYear() + 1900 == this.year_now) {
                    console.log("NOW", i);
                    dates[i].setAttribute("style", "background-color:yellow");

                    calendarData[i].now = true;
                } else {
                    dates[i].setAttribute("style", "background-color:white");
                    console.log("NOT NOW", i);

                    calendarData[i].now = false;
                }

                let span = document.createElement("span");
                span.innerHTML = day;

                calendarData[i].text = day;
                dates[i].appendChild(span);
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
        let dates = document.getElementsByClassName("date_element");
        let a = 0;
        for (let i = 0; i < dates.length; i++) {
            dates[i].innerHTML = "";
        }

        for(let i=0;i<this.calendarData.length;i++){
            this.calendarData[i].text  = "";
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
            this.detail(null, (+this.running_month + 1), this.running_year);
            begin_new.info = "NOW";
        } else {
            begin_new.info = "SOME-DAY";
        }
        return begin_new;
    }

    render() {

        let selectedYear = this.state.inputYearValue;

        let calendarData = this.calendarData.map(
            data => {
                let style = {};
                if (data.now == true) {
                    style = {
                        backgroundColor: 'lightgreen'
                    }
                }

                return (
                    <div style={style}>
                        {data.text}
                    </div>
                )
            }
        )

        return (
            <div className="container">
                <h2>TimeLine {this.state.inputYearValue}</h2>
                <div id="calendar-wrapper">
                    <table className="table" style={{
                        tableLayout: "fixed",
                        width: '70%', textAlign: "center"
                    }}>
                        <tr>
                            <td>
                                <ComboBox id="input_month" defaultValue={this.state.selectedMonth} onChange={this.setSelectedMonth}
                                    options={timeLineConstant.month} />
                            </td>
                            <td>
                                <InputField type="number" id="input_year" value={selectedYear} onKeyUp={this.changeInputYear} />

                            </td>
                            <td>
                                <ActionButton onClick={(e) => this.setCalendar()} text={"Go"} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ActionButton onClick={(e) => this.doPrevMonth(true)} text={"Prev"} />
                            </td>
                            <td>
                                <input disabled className="form-control" id="date-info" />
                            </td>
                            <td>
                                <ActionButton onClick={(e) => this.doNextMonth(true)} text={"Next"} />
                            </td>
                        </tr>
                    </table>
                    <table className="table" id="calendarTable"
                        style={{ width: '100%', tableLayout: 'fixed' }}
                    >
                        <thead>
                            <tr>
                                <th>Senin</th>
                                <th>Selasa</th>
                                <th>Rabu</th>
                                <th>Kamis</th>
                                <th>Jumat</th>
                                <th>Sabtu</th>
                                <th>Ahad</th>
                            </tr>
                        </thead>

                    </table>
                    <GridComponent cols={7} items={calendarData} />
                </div>

            </div>
        );
    }
}

export default Timeline;