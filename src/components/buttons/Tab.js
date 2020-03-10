import React from 'react';
import '../../css/Tab.css'
import * as stringUtil from '../../utils/StringUtil'

class Tab extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        let tabsData = this.props.tabsData ? this.props.tabsData : [];

        let autoColumns = "5% " + ("max-content ".repeat(tabsData.length)) + " auto";
        let msAutoColumns = "5% " + ("max-content ".repeat(tabsData.length)) + " 1fr";
        let i = 0;
        return (
            <div className="tab-container  grid-container" style={{
                ...this.props.style,
                width               : 'auto',
                gap                 : '0px',
               // display: 'grid',
                msGridColumns       : autoColumns,
                gridTemplateColumns : msAutoColumns
            }} >
                <div style={{ width: '100%', borderBottom: 'solid 1px lightgray', msGridColumn:1 }}></div>
                {tabsData.map(tabData => {

                    i++;

                    return <div 

                    key         ={stringUtil.uniqueId()} 
                    className   ={tabData.active ? "tab-element tab-item-active rounded-top" :  "tab-element tab-item"} 
                    onClick     ={tabData.onClick ? tabData.onClick : () => { }}
                    style       = {{msGridColumn: i} }
                    >
                        {tabData.text}
                    </div>
                })}
                <div style={{ width: '100%', borderBottom: 'solid 1px lightgray', msGridColumn: 1 + tabsData.length }}></div>
            </div>
        )
    }
}
export default Tab;