import {Component} from 'react'
import {CardPanel, Col, Row} from "react-materialize";
import axios from "axios";
import convert from "convert-seconds"
import M from 'materialize-css'
import { Link } from "react-router-dom";
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
                    <img alt={'First Strike'} width={'50px'} src={'https://ddragon.canisback.com/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png'}/>
            )
        }
       return(
           <>
               {perk && (
                   <img alt={perk.icon} width={'50px'} src={`https://ddragon.canisback.com/img/${perk.icon}`}/>
               )}
           </>
       )}
        getSecondaryRuneById(id){
            let rune = this.state.runes.find((r) => r.id === id);
            return(
                <>
                    {rune && (
                        <img alt={rune.icon} width={'25px'} src={`https://ddragon.canisback.com/img/${rune.icon}`}/>
                    )}
                </>
            )
    }
    async componentDidMount() {
        const response = await axios.get(this.state.url);
        const json = await response.data;
        const responseRunes = await axios.get('https://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/runesReforged.json');
        const jsonRunes = await responseRunes.data;
        this.setState({ queues: json, runes: jsonRunes});
        M.AutoInit();
    }
    render() {
        function csPerMinute(summoner)
        {
            let csPerM = (summoner.totalMinionsKilled + summoner.neutralMinionsKilled) / gameDuration.minutes;
            return <>{csPerM.toFixed(1)}</>
        }
        function getKda(summoner)
        {
            if(summoner.deaths !== 0)
            {
                kda = (summoner.kills + summoner.assists) / summoner.deaths;
            }else {
                kda = summoner.kills + summoner.assists;
            }
            if(kda <= 1)
                kdaColor = 'red'
            if(kda > 1 && kda < 5){
                kdaColor = 'green'
            }
            if(kda >= 5){
                kdaColor = 'gold'
            }
            return <span style={{color: kdaColor}}>{kda.toFixed(1)}</span>
        }
        let kdaColor;
        let opponentGameResult;
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
        let queueType;
        {queue && (queueType = queue.description.replace('games', '').replace('5v5', '').toLocaleString())}
        
        if(summonerTeam.win === false)
        {
         color = 'lose';   
         gameResult = 'Porażka'
        }
        let opponentColor;
        if(color === 'win')
        {
            opponentColor = 'lose'
            opponentGameResult = "Porażka"
        }
        else if(color === 'lose')
        {
            opponentColor = 'win'
            opponentGameResult = 'Zwycięstwo'
        }
            
        return (
            <>
                <li>
                <CardPanel className={color + ' collapsible-header'} style={{borderRadius: '15px'}} >
                    <div className={'white-text'}>
                        <Row>
                            <Col l={2} s={6} style={{fontSize: '15px'}}>
                                <div>
                                    {queueType}
                                </div>
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
                                   <div> KDA: {getKda(summonerStats)} </div>
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
                                    {csPerMinute(summonerStats)} CS/min
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
                                    <Col l={12} m={12} s={12}>
                                        <Col l={3} m={4} s={4} className={'right-align'}>
                                            <img alt={p.championName} className={'responsive-img'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/>
                                        </Col>
                                        <Col l={9} m={8} s={8} className={'left-align'}>
                                            <div title={p.summonerName} className={'truncate'}>{p.summonerName}</div>
                                        </Col>
                                    </Col>
                                ))}
                                </Row>
                            </Col>
                            <Col l={3} s={6}>
                                <Row className={'center'}>
                                {match.info.participants.filter((s) => s.teamId !== summonerStats.teamId).map((p) => (
                                    <Col l={12}>
                                        <Col l={9} m={8} s={8} className={'right-align'}>
                                            <div title={p.summonerName} className={'truncate'}>{p.summonerName}</div>
                                        </Col>
                                        <Col l={3} m={4} s={4} className={'left-align'}>
                                            <img alt={p.championName} className={'responsive-img'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/>
                                        </Col>
                                    </Col>
                                ))}
                                    </Row>
                            </Col>
                        </Row>
                        </div>
                </CardPanel>
                    <CardPanel style={{borderRadius: '15px', border: 'none'}} className={'blue-grey collapsible-body'}>
                        <div className={'white-text'}>{gameResult}</div>
                        <Row>
                            <Col l={12} m={12} s={12} className={color + ' white-text'} style={{borderRadius: '15px'}}>
                                <table className={'responsive-table centered'}>
                                    <thead>
                                    <tr>
                                        <th>Champion</th>
                                        <th>Summoner</th>
                                        <th>KDA</th>
                                        <th>Total Gold</th>
                                        <th>Minion Score</th>
                                        <th>Damage Given</th>
                                        <th>Damage Taken</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {match.info.participants.filter((s) => s.teamId === summonerStats.teamId).map((p) => (

                                        <tr>
                                            <td><img alt={p.championName} className={'responsive-img championImageInTable'} style={{maxHeight: '40px'}} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/></td>
                                            <td><a className={'white-text'} style={{cursor:'pointer'}} onClick={() => {window.location.href=`/eune/${p.summonerName}`}}><div title={p.summonerName} className={'truncate'}>{p.summonerName}</div></a></td>
                                            <td>{p.kills}/{p.deaths}/{p.assists} ({getKda(p)})</td>
                                            <td>{p.goldEarned.toLocaleString()} G</td>
                                            <td>{p.totalMinionsKilled + p.neutralMinionsKilled} ({csPerMinute(p)})</td>
                                            <td>{p.totalDamageDealtToChampions.toLocaleString()}</td>
                                            <td>{p.totalDamageTaken.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </Col>
                            <div className={'white-text'}>{opponentGameResult}</div>
                            <Col l={12} m={12} s={12} className={opponentColor + ' white-text'} style={{borderRadius: '15px'}}>
                                <table className={'responsive-table centered'}>
                                    <thead>
                                        <tr>
                                            <th>Champion</th>
                                            <th>Summoner</th>
                                            <th>KDA</th>
                                            <th>Total Gold</th>
                                            <th>Minion Score</th>
                                            <th>Damage Given</th>
                                            <th>Damage Taken</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                {match.info.participants.filter((s) => s.teamId !== summonerStats.teamId).map((p) => (
                                        
                                        <tr>
                                            <td> <img alt={p.championName} className={'responsive-img championImageInTable'} style={{maxHeight: '40px'}} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/></td>
                                            <td><a className={'white-text'} style={{cursor:'pointer'}} onClick={() => {window.location.href=`/eune/${p.summonerName}`}}><div title={p.summonerName} className={'truncate'}>{p.summonerName}</div></a></td>
                                            <td>{p.kills}/{p.deaths}/{p.assists} ({getKda(p)})</td>
                                            <td>  {p.goldEarned.toLocaleString()} G</td>
                                            <td>{p.totalMinionsKilled + p.neutralMinionsKilled} ({csPerMinute(p)})</td>
                                            <td>{p.totalDamageDealtToChampions.toLocaleString()}</td>
                                            <td>{p.totalDamageTaken.toLocaleString()}</td>
                                        </tr>
                                ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </CardPanel>
                </li>
            </>
        )
    }
}