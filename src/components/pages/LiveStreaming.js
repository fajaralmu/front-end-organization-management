import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actionCreators'
import { _byId } from '../../utils/ComponentUtil'
import InputField from '../input/InputField';
import ActionButton from '../buttons/ActionButton';
import SockJsClient from 'react-stomp';
import ContentTitle from '../layout/ContentTitle';
import Label from '../Label';
import { uniqueId } from '../../utils/StringUtil';
import Tab from '../buttons/Tab';
import '../../css/Chat.css'
import * as config from '../../utils/WebConfig'
import * as url from '../../constant/Url'

const hostCloud = url.hostCloud;
const hostLocal = url.hostLocal;
const MENU_MESSAGE = "0xfffre";
const MENU_LIST = "0x44444";

const usedHost = () => {
    if (config.debugMode() == true)
        return hostLocal;
    else
        return hostCloud;
}


const currentRequestId = () => {
    return localStorage.getItem("requestId");
}

class LiveStreaming extends Component {




    constructor(props) {
        super(props);

        this.state = {
            updated: new Date(),
            stream: {}
        }
        this.width = 320;    // We will scale the photo width to this
        this.height = 0;     // This will be computed based on the input stream

        this.streaming = false;

        this.video = null;
        this.canvas = null;
        this.photo = null;
        this.startbutton = null;
        this.isAnimate = false;
        this.window = window;

        this.refresh = () => {
            this.setState({ updated: new Date() });
        }

        this.init = () => {
            const _class = this;
            window.navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(function (stream) {
                    _class.video.srcObject = stream;
                    console.log("stream:", stream);
                    _class.setState({stream:stream});
                    _class.video.play();
                   
                })
                .catch(function (err) {
                    console.log("An error occurred: " + err);
                });
           
            this.video.addEventListener('canplay', function (ev) {
                if (!_class.streaming) {
                    _class.height = _class.video.videoHeight / (_class.video.videoWidth / _class.width);

                    _class.video.setAttribute('width', _class.width);
                    _class.video.setAttribute('height', _class.height);
                    _class.canvas.setAttribute('width', _class.width);
                    _class.canvas.setAttribute('height', _class.height);
                    _class.streaming = true; 
                   
                }
            }, false); 

            this.clearphoto();
        }

        this.takepicture = () => {
            var context = this.canvas.getContext('2d');
            if (this.width && this.height) {
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                context.drawImage(this.video, 0, 0, this.width, this.height);
    
                var data = this.canvas.toDataURL('image/png');
                this.photo.setAttribute('src', data);
            } else {
                this.clearphoto();
            }
        }
    
        this.clearphoto = () => {
            var context = this.canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
            var data = this.canvas.toDataURL('image/png');
            this.photo.setAttribute('src', data);
        }


    /**
     * ==================================================
     *                  Frame Loop
     * ================================================== 
     */

        this. initAnimation = () => {
            this.isAnimate = !this.isAnimate;
            console.log("Init Anim", this);
            const _class = this;
            window.requestAnimationFrame(function () {
                _class.animate()
            });
        }
       this.animate = () => {
    
            this.clearphoto();
            this.takepicture(); 
            const _class = this;
            if (this.isAnimate) {
                window.requestAnimationFrame(function () {
                    _class.animate();
                });
            }
        }
    }

    

    componentDidMount() {
        this.video = _byId('video');
        console.log("video:", this.video);
        this.canvas = _byId('canvas');
        this.photo = _byId('photo'); 
        this.init();
        this.initAnimation(this);
    }

    render() {

        return (
            <div>
                <h2>Live Streaming</h2>
                <p>{"Stream ID:"+this.state.stream.id}</p>
                <div className="camera">
                    <video controls id="video">Video stream not available.</video>
                    <button id="startbutton" onClick={this.takepicture}>Take photo</button>
                    <button onClick={this.clearphoto}>Clear Photo</button>
                </div>
                <hr />
                <canvas id="canvas">
                </canvas>
                <div className="output">
                    <img id="photo" alt="The screen capture will appear in this box." />
                </div>
            </div>
        )
    }
}

export default LiveStreaming;