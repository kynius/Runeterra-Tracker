import React, {Component} from "react";
import axios from "axios";
import {Col, Preloader, Row} from "react-materialize";
import Match from "./Match";
import Ranks from "./Ranks";
import {ddragonVersion} from "../App";
export default class Summoner extends Component{
    constructor(props) {
        super(props);
        this.state = {
                data: [],
                summoner: {},
                matches: [],
                url: `https://lolapi.gadzina.biz/by-summonerName/1/${this.props.summonerName}?count=10`,
                isLoading: true
        }
    }
    async componentDidMount() {
        let isLoading = true;
        const response = await axios.get(this.state.url).then(isLoading = false);
        const json = await response.data;
        this.setState({ data: json });
        this.setState({summoner: json.summoner});
        this.setState({matches: json.matches})
        this.setState({isLoading: isLoading})
    }
    
    render(){
        const summoner = this.state.summoner;
        const matches = this.state.matches;
        const revisionDate = new Date(summoner.revisionDate);
    if(this.state.isLoading){
        return  <Preloader
            active
            color="blue"
            flashing
        />
    }
     return(
         <>
          <Row>
             <Col l={4} m={6} s={6} className={''}>
                 <img alt={'Summoner Icon'} height={'170px'} width={'170px'} style={{borderRadius:'15px'}} src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/profileicon/${summoner.profileIconId}.png`}/>
                 <div className={'levelborder'}>{summoner.summonerLevel}</div>
                 <div style={{fontSize:'10px'}}>Last update: {revisionDate.toLocaleString()}</div>
             </Col> 
              <Col l={8} m={6} s={6}>
                  <div style={{fontSize:'24px'}}>{summoner.name}</div>
              </Col>
          </Row>
             <Row>
                 <Col l={4} m={12} s={12}>
                     <Row>
                        <Ranks summonerId={summoner.id}/>
                     </Row>
                 </Col> 
                 <Col l={8} m={12} s={12}>
                     <Row>
                         <ul className="collapsible" style={{overflow: "hidden", WebkitBoxShadow: 'none', boxShadow: 'none', border:'none'}}>
                         {matches.map((match) => (
                             <Match key={match.metadata.matchId} match={match} summoner={summoner}/>
                         ))}
                         </ul>
                     </Row>
                 </Col>
             </Row>
         </>
     )
 }
}