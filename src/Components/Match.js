import {Component} from 'react'
import {CardPanel, Col, Row} from "react-materialize";
import axios from "axios";
import convert from "convert-seconds"
import M from 'materialize-css'
export default class Match extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'https://static.developer.riotgames.com/docs/lol/queues.json',
            queues: [],
            queue: {},
            runes: []
        }
    }
    checkNull(int)
    {
        if(int !== 0)
        {
            return <img alt={int} className={'item'} width={'40px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${int}.png`}/>
        }
        else {
            return <div style={{width:'40px', marginRight:'2px', height:'40px', borderRadius:'10px', background: '#bbdefb', display:'inline-block'}}></div>
        }
    }
    getPrimaryRuneById(summonerRune){
        let rune = this.state.runes.find((r) => r.id === summonerRune.style);
        let perk;
        rune && (
            perk = rune.slots[0].runes.find((r) => r.id === summonerRune.selections[0].perk)
        )
        if(perk === undefined)
        {
            return (
                    <img width={'50px'} src={'https://ddragon.canisback.com/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png'}/>
            )
        }
       return(
           <>
               {perk && (
                   <img width={'50px'} src={`https://ddragon.canisback.com/img/${perk.icon}`}/>
               )}
           </>
       )}
        getSecondaryRuneById(id){
            let rune = this.state.runes.find((r) => r.id === id);
            return(
                <>
                    {rune && (
                        <img width={'25px'} src={`https://ddragon.canisback.com/img/${rune.icon}`}/>
                    )}
                </>
            )
    }
    async componentDidMount() {
        const response = await axios.get(this.state.url);
        const json = await response.data;
        const responseRunes = await axios.get('http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/runesReforged.json');
        const jsonRunes = await responseRunes.data;
        this.setState({ queues: json, runes: jsonRunes});
        M.AutoInit();
    }
    render() {
        let kdaColor;
        let match = this.props.match;
        let summoner = this.props.summoner;
        const queue = this.state.queues.find((m) => m.queueId === match.info.queueId);
        let gameDuration = convert(match.info.gameDuration);
        let summonerStats = match.info.participants.find((s) => s.puuid === summoner.puuid);
        let summonerTeam = match.info.teams.find((s) => s.teamId === summonerStats.teamId);
        let color = 'win';
        let dateOfGame = new Date(match.info.gameStartTimestamp)
        let gameResult = 'Zwycięstwo';
        let kda;
        let csPerMinute = (summonerStats.totalMinionsKilled + summonerStats.neutralMinionsKilled) / gameDuration.minutes;
        if(summonerStats.deaths !== 0)
        {
            kda = (summonerStats.kills + summonerStats.assists) / summonerStats.deaths;
        }else {
            kda = summonerStats.kills + summonerStats.assists;
        }
        if(summonerTeam.win === false)
        {
         color = 'lose';   
         gameResult = 'Porażka'
        }
        if(kda <= 1)
            kdaColor = 'red'
        if(kda > 1 && kda < 5){
                kdaColor = 'green'
        }
        if(kda >= 5){
                kdaColor = 'gold'
        }
        return (
            <>
                <CardPanel style={{borderRadius: '15px'}} className={color}>
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
                                <div>
                                    {summonerStats.kills} / {summonerStats.deaths} / {summonerStats.assists}
                                </div>
                                <div>
                                   <div style={{color: kdaColor} }> KDA: {kda.toFixed(1)} </div>
                                </div>
                            </Col>
                            <Col l={2} s={6}>
                            <img alt={summonerStats.championName} width={'70px'} style={{borderRadius: '15px'}} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${summonerStats.championName}.png`}/>
                                <div>
                                {this.getPrimaryRuneById(summonerStats.perks.styles[0])}
                                {this.getSecondaryRuneById(summonerStats.perks.styles[1].style)}
                                </div>
                                <div>
                                    {summonerStats.totalMinionsKilled + summonerStats.neutralMinionsKilled} CS
                                </div>
                                <div>
                                    {csPerMinute.toFixed(1)} CS/min
                                </div>
                            </Col>
                            <Col l={2} s={12}>
                                <div style={{display:''}}>
                                    {this.checkNull(summonerStats.item0)}
                                    {this.checkNull(summonerStats.item1)}
                                    {this.checkNull(summonerStats.item2)}
                                    {this.checkNull(summonerStats.item3)}
                                    {this.checkNull(summonerStats.item4)}
                                    {this.checkNull(summonerStats.item5)}
                                </div>
                            </Col>
                            <Col l={3} s={6}>
                                <Row className={'center'}>
                                {match.info.participants.filter((s) => s.teamId === summonerStats.teamId).map((p) => (
                                    <>
                                        <Col l={4} m={4} s={4} className={'right-align'}>
                                            <img alt={p.championName} width={'16px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/>
                                        </Col>
                                        <Col l={8} m={8} s={8} className={'left-align'}>
                                            <div title={p.summonerName} className={'truncate'}>{p.summonerName}</div>
                                        </Col>
                                    </>
                                ))}
                                </Row>
                            </Col>
                            <Col l={3} s={6}>
                                <Row className={'center'}>
                                {match.info.participants.filter((s) => s.teamId !== summonerStats.teamId).map((p) => (
                                    <>
                                        <Col l={8} m={8} s={8} className={'right-align'}>
                                            <div title={p.summonerName} className={'truncate'}>{p.summonerName}</div>
                                        </Col>
                                        <Col l={4} m={4} s={4} className={'left-align'}>
                                            <img alt={p.championName} height={'16px'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/>
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