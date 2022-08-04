import React, {useRef} from 'react';
import {
    useNavigate, Link
} from "react-router-dom";
import {Col, Row} from "react-materialize";

export default function App() {
    const inputRef = useRef(null)
    let summonerName, region = "eune";
    let navigate = useNavigate()
  return (
        <div>
            <div style={{height:'100px'}}></div>
          <div>
            <Row className={'center'}>
              <Col l={6} offset={"l3 m2"} m={8} s={12}>
                <nav>
                  <div class="nav-wrapper">
                    <form onSubmit={() => navigate(`/${region}/${inputRef.current.value}`)}>
                      <div class="input-field blue lighten-2">
                        <input id="search" type="search" ref={inputRef} required/>
                        <label class="label-icon" for="search"   ><button type={"submit"} style={{background:'none', border:'none'}}><i class="material-icons">search</i></button></label>
                        <i class="material-icons">close</i>
                      </div>
                    </form>
                  </div>
                </nav>
              </Col>
            </Row>
          </div>
        </div>
  );
}