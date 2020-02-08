import React, { Component } from 'react'
import '../../css/Common.css'
import '../../css/Timeline.css'
import * as timeLineConstant from '../../constant/TimelineConstant'



class Timeline extends Component {
    constructor(props) {
        super(props);
        this.month_now = 7;// 0;
        //let this.begin = { week: 2, day: 1, dayCount: 31 };
        this.begin = { week: 1, day: 3, dayCount: 31, info: "" };
        this.begin_old = { week: 0, day: 0, dayCount: 0, info: "" };
        this.year_now = 1945;
        //let month_label = document.getElementById("month");
        //let year_label = document.getElementById("year");
        this.tabel = document.getElementById("calendarTable");
        this.input_month = document.getElementById("input_month");
        this.input_year = document.getElementById("input_year");
        this.date_info = document.getElementById("date-info");
        this.running_month = 7;
        this.running_year = 1945;
        this.filterDayId = 0;
        this.filterMonthId = 0; this.dateFormId = 0;
        this.entity_Name = 0; this.entity_Prop = 0; this.dateFormId = 0;
    }

    initEntity(entityName, propName, dateID) {
        this.entity_Name = entityName;
        this.entity_Prop = propName;
        console.log("entity Name and prop ", this.entity_Name, this.entity_Prop);
        this.setDateElementId(dateID);

    }

    componentDidUpdate() {
        this.updateFields();
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
        this.input_year = document.getElementById("input_year");
        this.date_info = document.getElementById("date-info");
    }

    loadCalendar() {

        this.updateFields();

        this.createTable();
        this.begin_old = this.begin;
        this.begin = this.fillDay(this.month_now, true, this.begin);
        this.fillInputMonth();
        this.input_month.value = new Date().getMonth() + 1;
        this.input_year.value = new Date().getFullYear();
        this.setCalendar();

        this.setState({ updated: new Date() })

    }

    fillInputMonth() {
        this.input_month.innerHTML = "";
        for (let i = 0; i < timeLineConstant.month.length; i++) {
            //  console.log("option ", i, this.input_month);
            let opt = document.createElement("option");
            opt.value = i + 1;
            opt.innerHTML = timeLineConstant.month[i].name;
            this.input_month.appendChild(opt);
        }
    }

    createTable() {
        //console.log("BUAT this.tabel");
        let tBody = document.createElement("tbody");
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
            }
            tBody.appendChild(tr);
        }
        this.tabel.className = "table table-bordered";
        this.tabel.style.tableLayout = "fixed";
        this.tabel.appendChild(tBody);
    }

    setCalendar() {
        this.doSetCalendar();
    }

    doSetCalendar() {
        console.log("==start==");

        this.running_month = this.input_month ? this.input_month.value - 1 : new Date().getMonth();
        this.running_year = this.input_year ? this.input_year.value : new Date().getFullYear();
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

    loadJSON() {


    }

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
        let begin_prev = this.caribegin(this.begin_old, this.begin_old.dayCount);
        //console.log("old", this.begin_old.day, this.begin_old.week, "prev");
        //console.log("begin_PREV", begin_prev.day, begin_prev.week, "prev");
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
        return this.doNextMonth(false);
    }

    refresh(){
        this.setState({updated:new Date()})
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

    caribegin(begin_old_, totalday) {
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

    setElementByAttr(attr, val, attr2, val2, day) {
        let dates = document.getElementsByClassName("date_element");
        let a = 0;
        for (let i = 0; i < dates.length; i++) {
            let cek = dates[i].getAttribute(attr) == val;
            let cek2 = dates[i].getAttribute(attr2) == val2;
            if (cek && cek2) {
                dates[i].innerHTML = "";
                dates[i].id = "date-" + day;
                if (new Date().getDate() == day && new Date().getMonth() == this.month_now && new Date().getYear() + 1900 == this.year_now) {
                    console.log("NOW", i);
                    dates[i].setAttribute("style", "background-color:yellow");
                } else {
                    dates[i].setAttribute("style", "background-color:white");
                    console.log("NOT NOW", i);
                }
                let dateStr = this.addZero(day, 10).concat("-").concat(this.addZero((+this.month_now + 1), 10)).concat("-").concat(this.year_now);

                let addBtn = document.createElement("code");
                addBtn.innerHTML = "+";
                addBtn.className = "btn btn-default btn-xs";
                addBtn.style.cssFloat = "right";
                addBtn.setAttribute("data-toggle", "tooltip");
                addBtn.setAttribute("title", "Add an event at " + dateStr + "!");
                addBtn.setAttribute("onclick", "addNewEvent(" + day + "," + (+this.month_now + 1) + "," + this.year_now + ")");
                dates[i].appendChild(addBtn);

                let detailBtn = document.createElement("code");
                detailBtn.innerHTML = "&#10296;";
                detailBtn.className = "btn btn-default btn-xs";
                detailBtn.style.cssFloat = "right";
                detailBtn.setAttribute("data-toggle", "tooltip");
                detailBtn.setAttribute("title", "See events at " + dateStr + "!");
                detailBtn.setAttribute("onclick", "detail(" + day + "," + (+this.month_now + 1) + "," + this.year_now + ")");
                dates[i].appendChild(detailBtn);

                let span = document.createElement("span");
                span.innerHTML = day;
                dates[i].appendChild(span);

                let ul = document.createElement("ul");
                ul.style.listStyle = "none";
                ul.id = "date-list-" + day;
                dates[i].appendChild(ul);



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
                this.setElementByAttr("week", week_, "day", day_, d);
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

        return (
            <div class="container">
                <h2>TimeLine</h2>
                <div id="calendar-wrapper">
                    <table className="table table-nonfluid" style={{
                        tableLayout: "fixed",
                        width: '40%', textAlign: "center"
                    }}>
                        <tr>
                            <td>
                                <select id="input_month" className="form-control"></select>
                            </td>
                            <td>
                                <input className="form-control" type="number" id="input_year" />
                            </td>
                            <td>
                                <button className="btn btn-default" id="prev" onClick={(e) => this.setCalendar()}>Go</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="btn" id="prev" onClick={(e) => this.doPrevMonth(true)}>&#10096;</button>
                            </td>
                            <td>
                                <input readonly className="form-control" id="date-info" />
                            </td>
                            <td>
                                <button className="btn" id="next" onClick={(e) => this.doNextMonth(true)}>&#10097;</button>
                            </td>
                        </tr>
                    </table>
                    <table className="table" id="calendarTable">
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
                </div>

            </div>
        );
    }
}

export default Timeline;