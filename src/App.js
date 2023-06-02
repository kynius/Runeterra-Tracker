import React, {useRef} from 'react';
import { useNavigate } from "react-router-dom";
import {Col, Row} from "react-materialize";

export const ddragonVersion = "13.11.1";

export default function App() {
    const inputRef = useRef(null)
    let region = "eune";
    let navigate = useNavigate()
  return (
        <div>
            <div style={{height:'100px'}}></div>
          <div>
            <Row className={'center'}>
              <Col l={6} offset={"l3 m2"} m={8} s={12}>
                <nav>
                  <div className="nav-wrapper">
                    <form onSubmit={() => navigate(`/${region}/${inputRef.current.value}`)}>
                      <div className="input-field blue lighten-2">
                        <input id="search" type="search" ref={inputRef} required/>
                        <label className="label-icon" form="search"><button type={"submit"} style={{background:'none', border:'none'}}><i class="material-icons">search</i></button></label>
                        <i className="material-icons">close</i>
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