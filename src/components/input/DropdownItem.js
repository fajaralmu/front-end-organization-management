import React, { Component } from 'react'

import '../../css/Input.css'

class DropdownItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        }

        this.handleClick = (e) => {
            console.log("selected: ",e.target.innerHTML);
            if(this.props.onClick){
                this.props.onClick(e);
            }
        }

        this.onHover = (e) => {
          
            if(this.props.onHover)
                this.props.onHover( this.props.index); 
        }
        this.unHover = (e) => { 
            this.setState({ hover: false })
        }
    }


    render() {
          return (
              <div>
                
                <div    onMouseLeave={this.unHover} onMouseOver ={this.onHover}  >
                {this.props.text}</div>
              </div>
          
        )
    }
}
export default DropdownItem;