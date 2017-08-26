import React, { Component, } from 'react';
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  Glyphicon,
  Grid,
  ListGroup,
  ListGroupItem,
  Media,
  OverlayTrigger,
  Panel,
  Popover,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { imagePath, } from '../util/imagePath';
import { pickGrade, } from '../util/pickGrade';
import { random, } from '../util/random';
import { range, } from '../util/range';
import { resolve, } from '../util/resolve';
const data = require('../Decrypted/filtered_character_visual.json')
  .filter(i => {
    return !(['LIMITED', 'DESTINY', 'SUPPORT'].includes(i.rarity))
      && ['3', '4', '5', '6'].includes(i.id.match(/_\d/)[0][1]);
  });

export default class Contracts extends Component {
  state = {
    jewelsSpent: 0,
    numberOfContracts: 10,
    usdSpent: 0,
    render: [],
  }

  pickHero = (i) => {
    const forcedGrade = i % 10 ? null : '4';
    const grade = !forcedGrade ? pickGrade() : forcedGrade;
    const pool = (!forcedGrade ? data : data.filter(i => i.isgachagolden))
      .filter(i => i.id.match(/_\d/)[0][1] === grade);

    return pool[random(0, pool.length - 1)];
  }

  handleSelect = (e) => {
    this.setState({ numberOfContracts: parseInt(e.target.value, 10), });
  }

  handleButton = (e) => {
    const results = range(this.state.numberOfContracts)
      .map(this.pickHero)
      .map(i => {
        const name = resolve(i.name);
        const star = i.id.match(/_\d/)[0][1];
        const className = resolve(`TEXT_CLASS_${i.classid.substring(4)}`);
        const rarity = resolve(
          `TEXT_CONFIRM_SELL_${i.rarity === 'LEGENDARY' ? (i.isgachagolden ? 'IN_GACHA' : 'LAGENDARY') : i.rarity}_HERO`
        );
        const faction = !i.domain || ['CHEN', 'MINO',].includes(i.domain)
          ? 'Unknown' // remove unreleased domains
          : resolve(
              i.domain === 'NONEGROUP' ? `TEXT_CHAMP_DOMAIN_${i.domain}_NAME` : `TEXT_CHAMPION_DOMAIN_${i.domain}`
            );
        const gender = resolve(`TEXT_EXPLORE_TOOLTIP_GENDER_${i.gender}`);
        const image = i.face_tex;

        return [name, star, className, rarity, faction, gender, image];
      });

    const jewelsSpent = this.state.numberOfContracts === 10 ? 50 : 6 + (this.state.numberOfContracts - 1) * 5;
    const usdSpent = jewelsSpent * 84.99 / 200;

    this.setState({
      jewelsSpent: parseInt(jewelsSpent + this.state.jewelsSpent, 10),
      render: this.renderResults(results),
      usdSpent: (usdSpent + parseFloat(this.state.usdSpent)).toFixed(2),
    });
  }

  renderResults = (results) => {
    return (
      <Panel>
        <ListGroup fill>
          {
            results.map((i, index) => {
              return (
                <LinkContainer key={index} to={`/cqdb/heroes/${i.slice(0, 3).join('&')}`}>
                  <ListGroupItem bsStyle={i[1] > 3 ? 'success' : ''}>
                    <Media>
                      <Grid fluid>
                        <Row>
                          <Col style={{padding: 0,}} lg={3} md={4} sm={4} xs={5}>
                            <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                              <img alt='' src={imagePath('cq-assets', `heroes/${i[i.length - 1]}.png`)} />
                            </Media.Left>
                          </Col>
                          <Col style={{padding: 0,}} lg={9} md={8} sm={8} xs={7}>
                            <Media.Body>
                              <Media.Heading>
                                {i[1] > 3 ? <b>{`${i[0]} (${i[1]}★)`}</b> : `${i[0]} (${i[1]}★)`}
                              </Media.Heading>
                              <p>{i.slice(2, i.length - 1).join(' | ')}</p>
                              {index + 1 === 10 ? <p>Guaranteed</p> : ''}
                            </Media.Body>
                          </Col>
                        </Row>
                      </Grid>
                    </Media>
                  </ListGroupItem>
                </LinkContainer>
              );
            })
          }
        </ListGroup>
      </Panel>
    );
  }

  render = () => {
    const popover = (
      <Popover id='info'>
        <h4>Rates</h4>
        <p>
          Pulls 1-9: 6★: 0.60%, 5★: 3.50%, 4★: 14.90%, 3★: 81.00%.
          <sup><a href='https://goo.gl/k62wvU'>[1]</a></sup>
          <sup><a href='https://github.com/Johj/cqdb/blob/master/src/util/pickGrade.js'>[2]</a></sup>
        </p>
        <p>
          Pull 10: Guaranteed 4★ Contract only Hero.
        </p>
        <hr />
        <h4>Ratio</h4>
        <p>
          <text>200 jewels = $84.99.</text>
        </p>
      </Popover>
    );

    const footer = (
      <OverlayTrigger overlay={popover} placement='bottom' rootClose trigger='click'>
        <Button bsStyle='link'>
          <Glyphicon glyph='info-sign' />
        </Button>
      </OverlayTrigger>
    );
      
    return (
      <Row>
        <Col lg={4} md={5} sm={12} xs={12}>
          <Panel footer={footer}>
            <Grid fluid>
              <Row>
                <Col lg={12} md={12} sm={5} xs={5}>
                  <FormGroup controlId="formControlsSelect">
                    <FormControl componentClass="select" onChange={this.handleSelect}>
                      {
                        range(10).reverse().map(i => <option key={i} value={i}>{i}</option>)
                      }
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col lg={12} md={12} sm={7} xs={7}>
                  <Button block onClick={this.handleButton}>Pull Contracts</Button>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col lg={6} md={6} sm={6} xs={6}>
                  {`Jewels: ${this.state.jewelsSpent}`}
                </Col>
                <Col lg={6} md={6} sm={6} xs={6}>                
                  {`USD: $${this.state.usdSpent}`}
                </Col>
              </Row>
            </Grid>
          </Panel>
        </Col>
        <Col lg={8} md={7} sm={12} xs={12}>
          {this.state.render}
        </Col>
      </Row>
    );
  }
}