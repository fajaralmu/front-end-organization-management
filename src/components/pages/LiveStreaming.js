import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actionCreators'
import { _byId } from '../../utils/ComponentUtil'
import InputField from '../input/InputField';
import ActionButton from '../buttons/ActionButton';
import SockJsClient from 'react-stomp';  
import SockJS from 'sockjs-client';
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
            stream: {},
           
        }
        this. sendingVideo=  false
        this.width = 320;    // We will scale the photo width to this
        this.height = 0;     // This will be computed based on the input stream

        this.streaming = false;
        this.terminated = false;
        this.video = null;
        this.canvas = null; 
        this.photoReceiver = null;
        this.startbutton = null;
        this.isAnimate = false;
        this.window = window;
        this.sockJsClient = null;
        this.latestImageResponse = {};
       

        this.refresh = () => {
            this.setState({ updated: new Date() });
        }

        this.init = () => {
            const _class = this;
            window.navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(function (stream) {
                    _class.video.srcObject = stream;
                    console.log("stream:", stream);
                    try{
                     //   _class.setState({stream:stream});
                    }catch(e){

                    }
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

        this.terminate = () =>{
            this.terminated = true;
        }

        this.setSendingVideoFalse = () => {
           this.sendingVideo = false;
        }

        this.sendVideoImage = (imageData) => {

            if(this.sendingVideo == true || this.terminated){
                return;
            }
            this.sendingVideo = true;

            const requestId = localStorage.getItem("requestId");
            const receiver =  this.props.receiver;
            this.props.sendVideoImage(imageData, requestId, receiver, this);  
            
        }

        this.handleLiveStream = (response) => { 
            if(this.terminated){
                return;
            }
            this.latestImageResponse = response;
            const _class = this;
            this.populateCanvas().then((base64)=>{
                _class.photoReceiver.setAttribute('src', base64 );
            });
        }

         this.populateCanvas =  () => {
            const _class = this;
            return new Promise((resolve, reject) => {
                var img = new Image();
                img.src =  _class.latestImageResponse.imageData;
                
                img.onload = function () {
                    var newDataUri = _class.imageToDataUri(this, 300, 300);
                    resolve(newDataUri);
                }; 
         });
        }

        this.takepicture = () => {
            var context = this.canvas.getContext('2d');
            if (this.width && this.height) {
                this.canvas.width = this.width/ 5;
                this.canvas.height = this.height/ 5;
                context.drawImage(this.video, 0, 0, this.width/ 5, this.height/ 5);
    
                var data = this.canvas.toDataURL('image/png');   

                this.sendVideoImage(data);
            } else {
                this.clearphoto();
            }
        }

        this.imageToDataUri = (img, width, height) => {

            // create an off-screen canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
        
            // set its dimension to target size
            canvas.width = width;
            canvas.height = height;
        
            // draw source image into the off-screen canvas:
            ctx.drawImage(img, 0, 0, width, height);
        
            // encode image to data-uri with base64 version of compressed image
            return canvas.toDataURL('image/png');
        }
    
        this.clearphoto = () => {
            var context = this.canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
            var data = this.canvas.toDataURL('image/png'); 
            var img = new Image();
            img.src = data;
        }


    /**
     * ==================================================
     *                  Frame Loop
     * ================================================== 
     */

        this. initAnimation = () => {
            this.isAnimate = !this.isAnimate;
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

    logSocket = function(){
        console.dir("LOG SOCKET:", window["socket"]);
        console.log("transport: ", window["socket"]._transport);
    }

    componentDidMount() {
        if(this.props.receiver == null){
            alert("Please select receiver!");
            return;
        }

        this.video = _byId('video');
        console.log("video:", this.video);
        this.canvas = _byId('canvas'); 
        this.photoReceiver = _byId("photo-receiver");
        this.init();
        this.initAnimation(this);
    }

    render() {

        const receiver = this.props.receiver;
        const streamId = this.state.stream.id;

        return (
            <div>
                <h2>Live Streaming</h2>
                <p>{"Stream ID: "+streamId}</p>
                <p>{"Receiver ID: "+receiver}</p>
                <div className="camera">
                    <video controls id="video">Video stream not available.</video>
                    <button id="startbutton" onClick={this.takepicture}>Take photo</button>
                    <button onClick={this.clearphoto}>Clear Photo</button>
                    <button onClick={this.terminate}>Terminate</button>
                </div>
                <hr />
                <canvas id="canvas">
                </canvas> 
                <div className="output-receiver x" style={{width:'400px', height:'400px', backgroundColor: 'green'}}>
                    <img width="300" height="300" id="photo-receiver" alt="The screen RECEIVER will appear in this box." />
                </div>
                <SockJsClient url={usedHost() + '/realtime-app'} topics={[  '/wsResp/livestream/'+receiver]}
                    onMessage={(msg) => { this.handleLiveStream(msg) }}
                    ref={(client) => { this.clientRef = client }} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    //console.log(state);
    return {
        
    }
}

const mapDispatchToProps = dispatch => ({
  
    sendVideoImage: (imageData, requestId, destinatio, app) => 
    dispatch(actions.sendVideoImage(imageData, requestId, destinatio, app)), 

})
export default connect(
    mapStateToProps,
    mapDispatchToProps)(LiveStreaming);