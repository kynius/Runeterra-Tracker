import {Component} from "react";
import axios from "axios";
import {CardPanel, Container} from "react-materialize";

export default class Ranks extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            url: `https://lolapi.gadzina.biz/champion-ranks/1/${this.props.summonerId}`
        }
    }
    async componentDidMount() {
        const response = await axios.get(this.state.url);
        const json = await response.data;
        this.setState({ data: json });
    }
    render() {
        function checkRankWR(rank){
            let wr = (rank.wins / (rank.wins + rank.losses)) * 100;
            if(wr.toFixed(0) >= 50)
            {
                return <span className={'green-text'}>({wr.toFixed(0)}%)</span>
            }
            else {
                return <span className={'red-text'}>({wr.toFixed(0)}%)</span>
            }
        }
        let ranks = this.state.data;
        let solo = ranks.find((r) => r.queueType === 'RANKED_SOLO_5x5')
        let flex = ranks.find((r) => r.queueType === 'RANKED_FLEX_SR')
        return(
            <>
                {solo && (
                    <Container>
                        <CardPanel style={{borderRadius: '15px'}} className={'blue-grey'}>
                            <div className={'white-text'}>
                                {solo.queueType.replace('_', ' ').replace('_5x5', '').replace('_SR', '')}
                            </div>
                            <div>
                                <img width={'80px'} src={window.location.origin + `/RankBorders/Emblem_${solo.tier}.png`}/>
                            </div>
                            <div className={'white-text'}>
                                {solo.tier}  {solo.rank} {solo.leaguePoints}LP
                            </div>
                            <div>
                                <span className={'green-text'}>W: {solo.wins}</span> <span className={'red-text'}>L:  {solo.losses}</span> {checkRankWR(solo)}
                            </div>
                        </CardPanel>
                    </Container>
                )}
                {flex && (
                    <Container>
                        <CardPanel style={{borderRadius: '15px'}}  className={'blue-grey'}>
                            <div className={'white-text'}>
                                {flex.queueType.replace('_', ' ').replace('_5x5', '').replace('_SR', '')}
                            </div>
                            <div>
                                <img width={'80px'} src={window.location.origin + `/RankBorders/Emblem_${flex.tier}.png`}/>
                            </div>
                            <div className={'white-text'}>
                                {flex.tier}  {flex.rank} {flex.leaguePoints}LP
                            </div>
                            <div>
                                <span className={'green-text'}>W: {flex.wins}</span> <span className={'red-text'}>L:  {flex.losses}</span> {checkRankWR(flex)}
                            </div>
                        </CardPanel>
                    </Container>
                )}
            </>
        )
    }
}