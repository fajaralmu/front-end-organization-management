import React, { Component } from 'react'
import * as stringUtil from '../utils/StringUtil'
import ActionButton from './ActionButton';

class NavButtons extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        let buttonsData = [];
        if (this.props.buttonsData) {
            buttonsData = this.props.buttonsData;
        }
        const gridTemplateColumns   = "auto ".repeat(buttonsData.length);
        const msGridTemplateColumns = "1fr ".repeat(buttonsData.length);
        return (
            <div className  ="nav-button-wrapper grid-container" 
                style       ={{ 
                    width               : 'min-content', 
                 //   display             : 'grid', 
                    gridTemplateColumns : gridTemplateColumns,
                    msGridColumns       : msGridTemplateColumns }}
                    >
                {buttonsData.map(
                    buttonData => {
                        return (
                            <ActionButton 
                                style   ={{
                                         backgroundColor: buttonData.active ? 'lightsteelblue' : 'darkcyan'
                                         }}

                                id      ={buttonData.id} 
                                onClick ={buttonData.buttonClick}
                                key     ={stringUtil.uniqueId() + "_nav"} 
                                text    ={buttonData.text} 
                                />
                        )
                    }
                )}
            </div>
        )
    }
}

export default NavButtons;