import {useParams} from "react-router-dom";
import Summoner from "./Components/Summoner";
import {Col, Row} from "react-materialize";

export default function SummonerPage(){
    let {server, summonerName} = useParams();
    return(
        <>
            <div style={{height:'100px'}}></div>
            <Row className={'center container'}>
                <Col l={12} m={12} s={12}>
                    <Summoner summonerName={summonerName} server={server}/>
                </Col>
            </Row>
        </>
    )
}