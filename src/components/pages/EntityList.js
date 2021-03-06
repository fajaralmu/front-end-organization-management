import React, { Component } from 'react'
import '../../css/Common.css'
import InstantTable from '../layout/InstantTable'
import { _byId } from '../../utils/ComponentUtil'
import * as stringUtil from '../../utils/StringUtil'
import '../../css/Management.css'
import '../../css/Entity.css'
import * as componentUtil from '../../utils/ComponentUtil'
import ActionButtons from '../buttons/ActionButtons';
import InputField from '../input/InputField'
import ActionButton from '../buttons/ActionButton'
import EntityForm from './EntityForm';
import * as url from '../../constant/Url'
import Label from '../Label'
import GridComponent from '../layout/GridComponent'
import { TYPE_LONG_DATE, TYPE_STATIC_DROPDOWN, TYPE_MULTIPLE_IMAGE, TYPE_DATE } from '../../utils/EntityConfigurations'

class EntityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {},
            activeId: null,
            orderBy: null,
            orderType: null
        }

        this.handleDelete = (id) => {
            if (!window.confirm("Are your sure for deleting this entity?")) { return; }
            console.log("Will DELETE: ", id)
        }
        this.handleEdit = (id) => {
            this.getEntityById(id);
        }
        this.getHeaderNames = (fieldNames) => {
            const headers = [];

            if (fieldNames == null) {
                this.props.backToDashboard();

            } else

                for (let i = 0; i < fieldNames.length; i++) {
                    const name = fieldNames[i];
                    let headerName = name.name;
                    if (headerName.split(".").length > 1) {
                        headerName = headerName.split(".")[0];
                    }
                    headers.push(headerName.toUpperCase());
                }
            headers.push("OPTION");
            return headers;
        }

        this.goToPage = (page, orderObject) => {
            if (page > this.props.entitiesData.totalData / 10) {
                page = 0;
            }
            if (page < 0) {
                page = Math.ceil(this.props.entitiesData.totalData / 10 - 1);
            }

            let config = this.props.entityConfig;
            config.filter = this.state.filter;
            if (orderObject != null) {
                config.orderBy = orderObject.orderBy;
                config.orderType = orderObject.orderType;
                this.setState({ orderBy: orderObject.orderBy, orderType: orderObject.orderType });
            }

            this.props.getEntityInPage(config, page);

        }

        this.getEntityById = (id) => {
            const config = this.props.entityConfig;
            if (config == null) {
                alert("Config Not Found!");
                return;
            }

            this.props.getEntityById(config.entityName, id);
        }

        this.createNavButtons = () => {
            let displayedButtons = componentUtil.createNavButtons(this.props.entitiesData.totalData / 10, this.props.currentPage);
            return displayedButtons;
        }

        this.setOrderBy = (fieldName, orderType) => {
            this.goToPage(this.props.currentPage, { orderBy: fieldName, orderType: orderType });
        }

        this.createFilterInputs = (fieldNames) => {
            let inputs = new Array();

            if (!fieldNames) {
                return inputs;
            }

            for (let i = 0; i < fieldNames.length; i++) {
                const fieldName = fieldNames[i];
                let headerName = fieldName.name;
                if (headerName.split(".").length > 1) {
                    headerName = headerName.split(".")[0];
                }

                let value = "";

                if (this.state.filter[headerName] != null) {
                    value = this.state.filter[headerName];

                }

                let input = <InputField value={value} id={headerName + "_filter_id"}
                    onKeyUp={this.handleFilterChange} key={"input_field_" + stringUtil.uniqueId()}
                    placeholder={headerName} />

                if (fieldName.type == TYPE_DATE || fieldName.type == TYPE_LONG_DATE) {
                    const valueDay = this.state.filter[headerName + "-day"];
                    const valueMonth = this.state.filter[headerName + "-month"];
                    const valueYear = this.state.filter[headerName + "-year"];

                    const inputDay = <InputField value={valueDay} id={headerName + "-day_filter_id"}
                        onKeyUp={this.handleFilterChange} key={"input_field_d" + stringUtil.uniqueId()}
                        placeholder={"day"} />;
                    const inputMonth = <InputField value={valueMonth} id={headerName + "-month_filter_id"}
                        onKeyUp={this.handleFilterChange} key={"input_field_m" + stringUtil.uniqueId()}
                        placeholder={"month"} />;
                    const inputYear = <InputField value={valueYear} id={headerName + "-year_filter_id"}
                        onKeyUp={this.handleFilterChange} key={"input_field_y" + stringUtil.uniqueId()}
                        placeholder={"year"} />;

                    input = <GridComponent width="50px" items={[inputDay, inputMonth, inputYear]} />
                }


                let orderType = "asc";
                if (this.state.orderBy && this.state.orderBy == headerName) {
                    if (this.state.orderType == "asc") {
                        orderType = "desc";
                    }
                }


                const orderButton = <ActionButton
                    onClick={() => { this.setOrderBy(headerName, orderType) }}
                    text={orderType} />

                inputs.push(<div className="filter-wrapper">
                    {input}{orderButton}
                </div>);
            }
            inputs.push("");
            return inputs;
        }

        this.handleFilterChange = (value, id) => {

            let filter = this.state.filter;
            if (value != null && value.trim() == "") {
                filter[id.split("_filter_id")[0]] = null;

            } else {
                filter[id.split("_filter_id")[0]] = value;

            }

            this.setState({ filter: filter, activeId: id });
            this.goToPage(this.props.currentPage);
        }

        this.focusActiveId = () => {
            if (_byId(this.state.activeId)) {
                _byId(this.state.activeId).focus();
            }
        }

    }


    componentDidUpdate() {
        this.focusActiveId();
    }

    render() {

        const entitiesData = this.props.entitiesData;
        const entityConfig = this.props.entityConfig;
        console.log("1");
        if (null == entitiesData || null == entityConfig) {
            return (<h2>Please Select One Of Menu</h2>)
        }


        if (null == entitiesData.entities) {
            entitiesData.entities = [];
        }

        const rows = [
            //header
            {
                values: this.getHeaderNames(entityConfig.fieldNames),
                disabled: true,
                style: { textAlign: 'center', fontWeight: 'bold' }
            },
            //filter
            {
                values: this.createFilterInputs(entityConfig.fieldNames),
                disabled: true
            }
        ];


        const entities = entitiesData.entities;
        const idField = entityConfig.id;

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            let rowValues = [];
            for (let j = 0; j < entityConfig.fieldNames.length; j++) {
                const fieldItem = entityConfig.fieldNames[j];
                let entityProp = fieldItem.name;
                let object = false

                if (entityProp.split(".").length > 1) {
                    entityProp = entityProp.split(".")[0];
                    object = true;
                }

                let entityValue = entity[entityProp];
                if (fieldItem.type) {
                    if (fieldItem.type == "number") {
                        entityValue = stringUtil.beautifyNominal(entityValue);
                    } else if (fieldItem.type == "link") {
                        entityValue = <a href={entityValue}><u>{entityValue}</u></a>
                    } else if (fieldItem.type == "image") {
                        entityValue = <img width="60" height="60" alt={url.baseImageUrl + entityValue} src={url.baseImageUrl + entityValue} />
                    } else if (fieldItem.type == TYPE_MULTIPLE_IMAGE) {
                        let imgName = entityValue.split("~")[0];

                        entityValue = <img width="60" height="60" src={url.baseImageUrl + imgName} />
                    } else if (fieldItem.type == TYPE_LONG_DATE) {
                        const dateStr = new Date(entityValue).toDateString();
                        entityValue = <Label text={dateStr} />;
                    } else if (fieldItem.type == TYPE_STATIC_DROPDOWN) {
                        const options = fieldItem.options;

                        options.forEach(opt => {
                            if (opt.value == entityValue) {
                                entityValue = opt.text;
                            }
                        });
                    }
                }

                rowValues.push(object && entityValue ? entityValue[fieldItem.name.split(".")[1]] : entityValue);
            }

            rows.push(
                {
                    identifier: entity[idField],
                    values: rowValues,
                    handleDelete: this.handleDelete,
                    handleEdit: this.handleEdit,
                    disabled: entityConfig.disabled == true ? true : false
                }
            )
        }

        const buttonsData = this.createNavButtons();
        const fixButtonData = new Array();

        fixButtonData.push({
            onClick: () => { this.goToPage(this.props.currentPage + -1) },
            text: 'previous'
        })

        for (let i = 0; i < buttonsData.length; i++) {
            buttonsData[i].onClick = () => { this.goToPage(buttonsData[i].value) }
            if (buttonsData[i].value == this.props.currentPage) {
                buttonsData[i].status = " btn-active";
            }
            buttonsData[i].text = buttonsData[i].text;


            fixButtonData.push(buttonsData[i]);
        }

        fixButtonData.push({
            onClick: () => { this.goToPage(this.props.currentPage + 1) },
            text: 'next'
        });

        let navButtons = <ActionButtons style={{
            backgroundColor: 'white',
            paddingTop: '15px',
            margin: '10px'
        }} buttonsData={fixButtonData} />

        let entityTable = <div className="entity-list-container">

            <InstantTable
                style={{
                    width: "100%",
                    margin: "5px",
                }}
                rows={rows} />
        </div>

        return (
            <div style={{ textAlign: 'center' }}>
                <div className="entity-container">
                    <div style={{
                        backgroundColor: 'white',
                        margin: '10px'
                    }} > </div>
                    {navButtons}
                    <div className="entityForm">
                        <EntityForm
                            addNew={this.props.addNew}
                            app={this.props.app}
                            updateEntity={this.props.updateEntity}
                            removeManagedEntity={this.props.removeManagedEntity}
                            managedEntity={this.props.managedEntity}
                            entityConfig={entityConfig} />
                    </div>
                    {entityTable}

                </div>
            </div>

        )
    }
}

export default EntityList;