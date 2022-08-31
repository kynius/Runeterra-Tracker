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
            spells: [],
            queues: [],
            queue: {},
            runes: []
        }
    }
    checkNull(int, width)
    {
        if(int !== 0)
        {
            return <img alt={int} className={'item'} width={width} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/item/${int}.png`}/>
        }
        else {
            return <div style={{width: width, marginRight:'2px', height: width, borderRadius:'10px', background: '#bbdefb', display:'inline-block'}}></div>
        }
    }
    getSummonerSpell(spellId, width)
    {
        let summonerSpell = this.state.spells
        for(const [id, spell] of Object.entries(summonerSpell)){
            console.log(spell.key)
            console.log(spellId)
            if(spell.key === spellId.toString())
            {
                 return (
                     <div style={{height: width + 2}}>
                         <img width={width} style={{borderRadius: '5px'}} alt={id} src={`http://ddragon.leagueoflegends.com/cdn/12.16.1/img/spell/${id}.png`}/>
                     </div>
                     )
               
            }
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
        const summonerSpellsResponse = await axios.get('https://ddragon.leagueoflegends.com/cdn/12.16.1/data/en_US/summoner.json');
        const jsonSpells = await summonerSpellsResponse.data;
        this.setState({ queues: json, runes: jsonRunes, spells: jsonSpells.data});
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
                <CardPanel className={color + ' collapsible-header'} style={{borderRadius: '15px', border:'none'}} >
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
                                <Row style={{marginBottom:'0'}}>
                                    <Col l={8} m={6} s={6}>
                                        <img alt={summonerStats.championName} width={'70px'} style={{borderRadius: '15px'}} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${summonerStats.championName}.png`}/>
                                    </Col>
                                    <Col l={4} m={6} s={6}>
                                            {this.getSummonerSpell(summonerStats.summoner1Id, 35)}
                                            {this.getSummonerSpell(summonerStats.summoner2Id, 35)}
                                    </Col>
                                </Row>
                                <div>
                                {this.getPrimaryRuneById(summonerStats.perks.styles[0])}
                                {this.getSecondaryRuneById(summonerStats.perks.styles[1].style)}
                                </div>
                                <div>
                                    {summonerStats.totalMinionsKilled + summonerStats.neutralMinionsKilled} CS
                                </div>
                                <div style={{marginBottom: '10px'}}>
                                    {csPerMinute(summonerStats)} CS/min
                                </div>
                            </Col>
                            <Col l={2} s={12}>
                                <div>
                                    {this.checkNull(summonerStats.item0, '40px')}
                                    {this.checkNull(summonerStats.item1, '40px')}
                                    {this.checkNull(summonerStats.item2, '40px')}
                                    {this.checkNull(summonerStats.item3, '40px')}
                                    {this.checkNull(summonerStats.item4, '40px')}
                                    {this.checkNull(summonerStats.item5, '40px')}
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
                                            <img/>
                                            <img/>
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
                                        <th>Items</th>
                                        <th>Summoner</th>
                                        <th>KDA</th>
                                        <th>Gold</th>
                                        <th className='tooltipped' data-position='top' data-tooltip='Minion Score'>CS</th>
                                        <th>Damage Given</th>
                                        <th className='tooltipped' data-position='top' data-tooltip='Vision Score'>VS</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {match.info.participants.filter((s) => s.teamId === summonerStats.teamId).map((p) => (
                                        <tr>
                                            <td style={{paddingBottom: 0}}> 
                                                <Row>
                                                    <Col l={6} m={6} s={6}>
                                                        <img alt={p.championName} className={'championImageInTable'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/>
                                                    </Col>
                                                    <Col l={6} className={'hide-on-med-and-down'}>
                                                        {this.getSummonerSpell(p.summoner1Id, 25)}
                                                        {this.getSummonerSpell(p.summoner2Id, 25)}
                                                    </Col>
                                                    <Col m={2} s={2} className={'hide-on-large-only'}>
                                                        {this.getSummonerSpell(p.summoner1Id, 30)}
                                                    </Col>
                                                    <Col m={2} s={2} className={'hide-on-large-only'}>
                                                        {this.getSummonerSpell(p.summoner2Id, 30)}
                                                    </Col>
                                                </Row>
                                            </td>
                                            <td className={'td-on-mobile'}>
                                                {this.checkNull(p.item0, '30px')}
                                                {this.checkNull(p.item1, '30px')}
                                                {this.checkNull(p.item2, '30px')}
                                                {this.checkNull(p.item3, '30px')}
                                                {this.checkNull(p.item4, '30px')}
                                                {this.checkNull(p.item5, '30px')}
                                            </td>
                                            <td className={'td-on-mobile'}><a className={'white-text'} style={{cursor:'pointer'}} onClick={() => {window.location.href=`/eune/${p.summonerName}`}}><div title={p.summonerName} className={'truncate'}>{p.summonerName}</div></a></td>
                                            <td>{p.kills}/{p.deaths}/{p.assists} ({getKda(p)})</td>
                                            <td>{p.goldEarned.toLocaleString()} G</td>
                                            <td>{p.totalMinionsKilled + p.neutralMinionsKilled} ({csPerMinute(p)})</td>
                                            <td className="tooltipped" data-position="top" data-tooltip={`Psychical: ${p.physicalDamageDealtToChampions.toLocaleString()} Magic: ${p.magicDamageDealtToChampions.toLocaleString()} True: ${p.trueDamageDealtToChampions.toLocaleString()} Taken: ${p.totalDamageTaken.toLocaleString()}`}>{p.totalDamageDealtToChampions.toLocaleString()}</td>
                                            <td>{p.visionScore}</td>
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
                                        <th>Items</th>
                                        <th>Summoner</th>
                                        <th>KDA</th>
                                        <th>Gold</th>
                                        <th className='tooltipped' data-position='top' data-tooltip='Minion Score'>CS</th>
                                        <th>Damage Given</th>
                                        <th className='tooltipped' data-position='top' data-tooltip='Vision Score'>VS</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                {match.info.participants.filter((s) => s.teamId !== summonerStats.teamId).map((p) => (
                                    <tr>
                                        <td style={{paddingBottom: 0}}>
                                            <Row>
                                                <Col l={6} m={6} s={6}>
                                                    <img alt={p.championName} className={'championImageInTable'} src={`http://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/${p.championName}.png`}/>
                                                </Col>
                                                <Col l={6} className={'hide-on-med-and-down'}>
                                                    {this.getSummonerSpell(p.summoner1Id, 25)}
                                                    {this.getSummonerSpell(p.summoner2Id, 25)}
                                                </Col>
                                                <Col m={2} s={2} className={'hide-on-large-only'}>
                                                    {this.getSummonerSpell(p.summoner1Id, 30)}
                                                </Col>
                                                <Col m={2} s={2} className={'hide-on-large-only'}>
                                                    {this.getSummonerSpell(p.summoner2Id, 30)}
                                                </Col>
                                            </Row>
                                        </td>
                                        <td className={'td-on-mobile'}>
                                            {this.checkNull(p.item0, '30px')}
                                            {this.checkNull(p.item1, '30px')}
                                            {this.checkNull(p.item2, '30px')}
                                            {this.checkNull(p.item3, '30px')}
                                            {this.checkNull(p.item4, '30px')}
                                            {this.checkNull(p.item5, '30px')}
                                        </td>
                                        <td className={'td-on-mobile'}><a className={'white-text'} style={{cursor:'pointer'}} onClick={() => {window.location.href=`/eune/${p.summonerName}`}}><div title={p.summonerName} className={'truncate'}>{p.summonerName}</div></a></td>
                                        <td>{p.kills}/{p.deaths}/{p.assists} ({getKda(p)})</td>
                                        <td>{p.goldEarned.toLocaleString()} G</td>
                                        <td>{p.totalMinionsKilled + p.neutralMinionsKilled} ({csPerMinute(p)})</td>
                                        <td className="tooltipped" data-position="top" data-tooltip={`Psychical: ${p.physicalDamageDealtToChampions.toLocaleString()} Magic: ${p.magicDamageDealtToChampions.toLocaleString()} True: ${p.trueDamageDealtToChampions.toLocaleString()} Taken: ${p.totalDamageTaken.toLocaleString()}`}>{p.totalDamageDealtToChampions.toLocaleString()}</td>
                                        <td>{p.visionScore}</td>

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