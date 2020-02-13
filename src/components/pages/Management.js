import React, { Component } from 'react'
import '../../css/Common.css'
import '../../css/Management.css'
import { withRouter } from 'react-router';
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
import ContentTitle from '../layout/ContentTitle'
import * as entityConfig from '../../utils/EntityConfigurations'
import EntityList from './EntityList';
import Tab from '../buttons/Tab';

class Management extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entityList: [],
            currentPage: 0,
            entityConfig: { entityName: "main" }
        }
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true) this.props.history.push("/login");
        }

        this.refresh = () => {
            this.getEntityInPage(this.state.entityConfig, this.state.currentPage);
        }

        this.loadEntityManagement = (config) => {
            this.props.removeManagedEntity();

            this.setState({ currentPage: 0, entityConfig: config });

            this.props.setEntityConfig(config);
            this.props.getEntities({
                entityName: config.entityName,
                page: 0,
                limit: 10,
                entityConfig: config
            }, this.props.app);
        }

        this.gotoMainPage = () => {
            this.props.resetManagementPage();
            this.setState({ currentPage: 0, entityConfig: { entityName: "main" } });
        }

        this.getEntityInPage = (config, page) => {
            this.setState({ currentPage: page });

            const request = {
                entityName: config.entityName,
                page: page,
                limit: 10,
                entityConfig: config,
                fieldsFilter: config.filter,
                orderBy: config.orderBy,
                orderType: config.orderType,
            };

            console.log("REQUEST: ", request)

            this.props.getEntities(request, this.props.app);
        }

        this.checkIfCurrentMenuName = (name) => {
            return this.state.entityConfig.entityName == name;
        }

        this.getButtonsData = () => {
            return [
                {
                    text: "#",
                    active: this.checkIfCurrentMenuName("main"),
                    onClick: () => { this.gotoMainPage() }
                },
                {
                    text: "Badan Pengurus",
                    active: this.checkIfCurrentMenuName("division"),
                    onClick: () => { this.loadEntityManagement(entityConfig.divisionConfig) }
                },
                {
                    text: "Divisi",
                    active: this.checkIfCurrentMenuName("section"),
                    onClick: () => { this.loadEntityManagement(entityConfig.sectionConfig) }
                },
                {
                    text: "Program Kerja",
                    active: this.checkIfCurrentMenuName("program"),
                    onClick: () => { this.loadEntityManagement(entityConfig.programConfig) }
                },
                {
                    text: "Kegiatan",
                    active: this.checkIfCurrentMenuName("event"),
                    onClick: () => { this.loadEntityManagement(entityConfig.eventConfig) }
                },
                {
                    text: "Posisi",
                    active: this.checkIfCurrentMenuName("position"),
                    onClick: () => { this.loadEntityManagement(entityConfig.positionConfig) }
                },
                {
                    text: "Anggota",
                    active: this.checkIfCurrentMenuName("member"),
                    onClick: () => { this.loadEntityManagement(entityConfig.memberConfig) }
                },
            ];
        }

        this.updateEntity = (name, entity, flag) => {
            if (!window.confirm("Are you sure will update " + name + "?")) {
                return;
            }

            let newRecord = flag == "addNew";

            this.props.updateEntity({ entityName: name, entity: entity, isNewRecord: newRecord }, this, function (ref) {
                console.log("WILL CALLBACK");
                ref.callbackHandleUpdate();
            });
        }

        this.getEntityById = (name, id) => {
            this.props.getEntityById(name, id, this.props.app);
        }
        this.removeManagedEntity = () => {
            this.props.removeManagedEntity();
        }

        this.callbackHandleUpdate = () => {
            this.refresh();
            this.removeManagedEntity();

        }
    }

    componentDidUpdate() {
        this.validateLoginStatus();
    }

    componentWillMount() {
        this.validateLoginStatus();
        document.title = "Management";
        this.props.setMenuCode("management");
    }

    render() {
        console.log("managedEntity: ", this.props.managedEntity);
      

        let entityList = this.props.entitiesData ? this.props.entitiesData.entities : [];
        if (null == entityList) { entityList = []; }

        let buttonsData = this.getButtonsData();

        let content = <h2>Content</h2>

        if (this.props.entitiesData.entityConfig == null) {
            content = <div>
                <h2>{"Management Page"}
                </h2></div>
        } else {
            content = <EntityList currentPage={this.state.currentPage}
                app={this.props.app}
                getEntityInPage={this.getEntityInPage}
                entityConfig={this.props.entitiesData.entityConfig}
                entitiesData={this.props.entitiesData}
                managedEntity={this.props.managedEntity}
                getEntityById={this.getEntityById}
                removeManagedEntity={this.removeManagedEntity}
                updateEntity={this.updateEntity}
                addNew={this.props.addNew}
            />;
        }

        return (
            <div className="section-container">
                <ContentTitle title={"Management " + (this.state.entityConfig.title ?
                    this.state.entityConfig.title :
                    this.props.entitiesData && this.props.entitiesData.entityConfig ?
                        this.props.entitiesData.entityConfig.title : "")}

                    description="manage master data" />
                <div className="management-container">
                    <Tab tabsData={buttonsData} />
                    {content}
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    //console.log(state);
    return {
        entitiesData: state.managementState.entitiesData,
        managedEntity: state.managementState.managedEntity,
        addNew: state.managementState.addNew
    }
}

const mapDispatchToProps = dispatch => ({
    setEntityConfig:(config)=>dispatch(actions.setEntityConfig(config)),
    getEntities: (request, app) => dispatch(actions.getEntityList(request, app)),
    getEntityById: (name, id, app) => {
        let action = actions.getEntityById(name, id, app);
        dispatch(action);
    },
    resetManagementPage : () =>dispatch(actions.resetManagementPage()),
    removeManagedEntity: () => dispatch(actions.removeManagedEntity()),
    updateEntity: (request, referer, callback) => dispatch(actions.updateEntity(request, referer, callback))

})
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Management))