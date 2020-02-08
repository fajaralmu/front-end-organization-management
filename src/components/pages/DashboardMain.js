import  React  from 'react'
import '../../css/Common.css'
import ComboBox from '../input/ComboBox';

class DashboardMain extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            divisionId:null
        }
    }

    onDivisionListChange = (value) => {
        this.setState({divisionId:value});
        this.props.selectDivision(value);
    }
    
    divionOptions = () => {
        let options = [];
        let divisions = this.props.divisions? this.props.divisions : [];

        divisions.forEach(division => {
            options.push({
                value: division.id,
                text: division.name
            })
        });

        return options;
    }

    render(){
 
        const division = this.props.division;
        let divisionId = this.state.divisionId;
        if(this.props.division){
            divisionId = this.props.division.id;
        }

        return(
            <div >
                <p>Login Sebagai</p>
                <ComboBox defaultValue={divisionId} onChange={this.onDivisionListChange} options={this.divionOptions()} />

                <p>Current Selection:</p>
                <p>{division?division.name:""}</p>
            </div>
        )

    }

}
export default DashboardMain;