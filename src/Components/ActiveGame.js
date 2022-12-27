import {Component} from "@types/react";
import axios from "axios";
import M from "materialize-css";

export default class ActiveGame extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            spells: [],
            runes: [],
            url: `https://lolapi.gadzina.biz/live-game/by-summonerName/1/${this.props.summonerName}`
        }
    }
    async componentDidMount() {
        const response = await axios.get(this.state.url);
        const json = await response.data;
        this.setState({ data: json, spells: this.props.spells, runes: this.props.runes });
        M.AutoInit()
    }
    render() {
        return(
            <>
                
            </>
        )
    }
}