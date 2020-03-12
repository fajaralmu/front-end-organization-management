import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actionCreators'
import { _byId } from '../../utils/ComponentUtil'
import InputField from '../input/InputField';
import ActionButton from '../buttons/ActionButton';
import SockJsClient from 'react-stomp';
import ChatList from '../ChatList';
import ContentTitle from '../layout/ContentTitle';
import Label from '../Label';
import GridComponent from '../layout/GridComponent'
import { uniqueId } from '../../utils/StringUtil';
import Tab from '../buttons/Tab';

const MENU_MESSAGE = "0xfffre";
const MENU_LIST = "0x44444";

let cloudHost = "https://nuswantoroshop.herokuapp.com/";
let localHost = "http://localhost:8080/organization-management/";
const usedHost = localHost;

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [], //NEVER NULL
            username: null,
            activeId: null,
            receiver: null,
            menu: MENU_LIST

        }

        this.sendChatMessage = () => {
            if (!_byId("input-msg").value) {
                alert("Message must not be null");
                return;
            }
            this.props.sendChatMessage(_byId("input-msg").value, this.state.username,
                this.state.receiver,
                this.props.app);
            _byId("input-msg").value = "";
        }

        this.handleMessage = (response) => {
            console.log("Responses handleMessage: ", response.code);
            console.log("LOCAL STORAGE:", localStorage.getItem("requestId"))
            if (response.code != localStorage.getItem("requestId")) {
                return;
            }
            this.props.storeChatMessageLocally(response.entities);
            // this.setState({ messages: response.entities });
        }

        this.changeUsername = (value, id) => {
            this.setState({ username: value, activeId: id });
        }

        this.setMenuCode = (code) => {
            this.setState({ menu: code });
        }

        this.setReceiver = (receiver) => {
            const messages = this.getMessagesByReceiver(receiver);
            this.setState({ receiver: receiver, menu: MENU_MESSAGE, messages: messages });
        }

        this.getMessagesByReceiver = (receiver) => {
            let messages = [];
            const propMessages = this.props.messages? this.props.messages:[];
            for (let i = 0; i < propMessages.length; i++) {
                const message = propMessages[i];
                if(message.receiver == receiver || message.sender == receiver){
                    messages.push(message);
                }
            }
            
            return messages;
        }
    }

    getButtonsData = () => {
        return [
            {
                text: "Online Users",
                active: this.state.menu == MENU_LIST,
                onClick: () => { this.setMenuCode(MENU_LIST) }
            },
            {
                text: "Message",
                active: this.state.menu == MENU_MESSAGE,
                onClick: () => { this.setMenuCode(MENU_MESSAGE) }
            }
        ];
    }

    componentWillMount() {
        this.props.setMenuCode('chatroom');
        document.title = "Chat Room";
        this.props.getMessages(this.props.app);
        if (this.props.userAlias) {
            this.setState({ username: this.props.userAlias })
        }
        this.props.getAvailableSessions(this.props.app);
    }

    componentDidUpdate() {
        if (this.state.activeId && _byId(this.state.activeId)) {
            _byId(this.state.activeId).focus();
        }

        console.log("messages: ",this.props.messages)
    }

    render() {

        const availableSessions = this.props.availableSessions;

        const buttonsData = this.getButtonsData();

        let content = "";

        if(this.state.menu == MENU_MESSAGE){
            let messages = this.state.messages;
            content = <div>
                <Label text={"Receiver: "+this.state.receiver} />
                <div>
                    {messages.map(message=>{
                        return <div key={uniqueId()} style={{margin:'5px', backgroundColor:'khaki'}}>
                                <Label text={message.date} />
                                <Label text={"From: "+message.sender} />
                                <Label text={message.text} />
                            </div>
                    })}
                </div>
                <InputField style={{ width: '80%' }} type="textarea" placeholder="input message" id="input-msg" />
                <ActionButton status="success" text="Send" onClick={this.sendChatMessage} />
            </div>;
        }else if(this.state.menu == MENU_LIST){
            content = <div>
                {availableSessions.map(session => {
                    return <ActionButton key={uniqueId()} onClick={()=>this.setReceiver(session.value)} text={session.key}/>;
                })}
            </div>
        }

        return (
            // <div className="section-container">
            //     <ContentTitle title="What Do You Feel?" description=
            //         {"Identified as [" + this.state.username + "]"} />
            //     <InputField
            //         value={userAlias}
            //         onKeyUp={this.changeUsername}
            //         id="input-username"
            //         placeholder="identify your name" />
            //     <div style={{ textAlign: 'left' }} id="chat-room">

            //         <div className="chat-container"  >
            //             <ChatList username={this.state.username} messages={this.props.messages} />
            //         </div>

            //         <GridComponent style={{ width: '50%', textAlign: 'right' }} items={[
            //             <InputField style={{ width: '130%' }} type="textarea" placeholder="input message" id="input-msg" />,
            //             <ActionButton style={{ margin: '5px' }} status="success" onClick={this.sendChatMessage} text="send" />

            //         ]} />

            //         <SockJsClient url={usedHost+'shop-app'} topics={['/wsResp/messages']}
            //             onMessage={(msg) => { this.handleMessage(msg) }}
            //             ref={(client) => { this.clientRef = client }} />
            //     </div>
            // </div>
            <div>
                <ContentTitle title="under construction" />
                <Tab tabsData={buttonsData} /> 
                {content}

                <SockJsClient url={usedHost+'realtime-app'} topics={['/wsResp/messages']}
                       onMessage={(msg) => { this.handleMessage(msg) }}
                       ref={(client) => { this.clientRef = client }} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    //console.log(state);
    return {
        messages: state.chatState.messages,
        userAlias: state.shopState.userAlias,
        availableSessions: state.chatState.availableSessions
    }
}

const mapDispatchToProps = dispatch => ({
    sendChatMessage: (message, username, receiver, app) => dispatch(actions.sendChatMessage(message, username, receiver, app)),
    storeChatMessageLocally: (messages) => dispatch(actions.storeMessageLocally(messages)),
    getMessages: (app) => dispatch(actions.getMessageList(app)),
    getAvailableSessions: (app) => dispatch(actions.getAvailableSessions(app))

})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatRoom)