import {Component} from 'react'
import {CardPanel, Col, Row} from "react-materialize";
import axios from "axios";
import convert from "convert-seconds"
import {Link} from "react-router-dom";

export default class Match extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'https://static.developer.riotgames.com/docs/lol/queues.json',
            queues: [],
            queue: {}
        }
    }
    async componentDidMount() {
        const response = await axios.get(this.state.url);
        const json = await response.data;
        this.setState({ queues: json });
    }
    render() {
        let match = this.props.match;
        let summoner = this.props.summoner;
        const queue = this.state.queues.find((m) => m.queueId === match.info.queueId);
        let gameDuration = convert(match.info.gameDuration);
        let summonerStats = match.info.participants.find((s) => s.puuid === summoner.puuid);
        let summonerTeam = match.info.teams.find((s) => s.teamId === summonerStats.teamId);
        let color = 'win';
        let dateOfGame = new Date(match.info.gameStartTimestamp)
        let gameResult = 'Zwycięstwo';
        let kda = (summonerStats.kills + summonerStats.assists) / summonerStats.deaths
        if(summonerTeam.win === false)
        {
         color = 'lose';   
         gameResult = 'Porażka'
        }
        return (
            <>
                <CardPanel className={'borderradius15px ' + color}>
                    <div className={'white-text'}>
                        <Row>
                            <Col l={2} s={6} style={{fontSize: '15px'}}>
                                {queue && (
                                    <div>
                                        {queue.description.replace('games', '').replace('5v5', '')}
                                    </div>
                                )}
                                <div>
                                    {gameDuration.minutes}  {gameDuration.seconds}
                                </div>
                                <div>
                                    {gameResult} 
                                </div>
                                <div className={'blue-grey-text'}>
                                    {dateOfGame.toLocaleDateString()}
                                </div>
                            </Col>
                            <Col l={2} s={6}>
                            <img width={'70px'} style={{borderRadius: '15px'}} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${summonerStats.championName}.png`}/>
                                <div>
                                    {summonerStats.kills} / {summonerStats.deaths} / {summonerStats.assists}
                                </div>
                                <div>
                                    {kda.toFixed(1)}
                                </div>
                            </Col>
                            <Col l={2} s={12}>
                                <div>
                                    <img className={'item'} width={'40px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${summonerStats.item0}.png`}/>
                                    <img className={'item'} width={'40px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${summonerStats.item1}.png`}/>
                                    <img className={'item'} width={'40px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${summonerStats.item2}.png`}/>
                                    <img className={'item'} width={'40px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${summonerStats.item3}.png`}/>
                                    <img className={'item'} width={'40px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${summonerStats.item4}.png`}/>
                                    <img className={'item'} width={'40px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${summonerStats.item5}.png`}/>
                                </div>
                            </Col>
                            <Col l={3} s={6}>
                                <Row className={'center'}>
                                {match.info.participants.filter((s) => s.teamId === summonerStats.teamId).map((p) => (
                                    <>
                                        <Col l={4} m={4} s={4} className={'right-align'}>
                                            <img height={'16px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/>
                                        </Col>
                                        <Col l={8} m={8} s={8} className={'left-align'}>
                                            {p.summonerName}
                                        </Col>
                                    </>
                                ))}
                                </Row>
                            </Col>
                            <Col l={3} s={6}>
                                <Row className={'center'}>
                                {match.info.participants.filter((s) => s.teamId != summonerStats.teamId).map((p) => (
                                    <>
                                        <Col l={8} m={8} s={8} className={'right-align'}>
                                            {p.summonerName}
                                        </Col>
                                        <Col l={4} m={4} s={4} className={'left-align'}>
                                            <img height={'16px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/>
                                        </Col>
                                        
                                    </>
                                ))}
                                    </Row>
                            </Col>
                        </Row>
                        </div>
                </CardPanel> 
                {/*<CardPanel style={{opacity:'0.6'}} className={'red'}>*/}
                {/*</CardPanel>*/}
            </>
        )
    }
}