import React, { Component, } from 'react';
import {
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  ListGroup,
  ListGroupItem,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { imagePath, } from '../util/imagePath';
import { random, } from '../util/random';
import { range, } from '../util/range';
import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_character_visual.json')
  .character_visual
  .filter(i => {
    return i.type === 'HERO'
      && !(['LIMITED', 'DESTINY', 'SUPPORT'].includes(i.rarity))
      && ['3', '4', '5', '6'].includes(i.id.match(/_\d/)[0][1]);
  });

export default class Contracts extends Component {
  state = {
    amount: 10,
    jewelsSpent: 0,
    usdSpent: 0,
    render: [],
  }

  componentWillMount = () => {}

  pickGrade = () => {
    const roll = Math.random();
    if (roll >= 0 && roll <= 0.81) {
      return '3';
    } else if (roll > 0.81 && roll <= 0.81 + 0.149) {
      return '4';
    } else if (roll > 0.81 + 0.149 && roll <= 0.81 + 0.149 + 0.035) {
      return '5';
    }
    return '6';
  }

  pickHero = (i) => {
    const forcedGrade = i % 10 ? null : '4';
    const grade = !forcedGrade ? this.pickGrade() : forcedGrade;
    let pool = !forcedGrade
      ? data
      : data.filter(i => i.isgachagolden);
    pool = pool.filter(i => i.id.match(/_\d/)[0][1] === grade);
    
    return pool[random(0, pool.length - 1)];
  }


  handleButton = (e) => {
    const results = range(this.state.amount)
      .map(this.pickHero)
      .map(i => {
        const name = resolve(i.name);
        const star = i.id.match(/_\d/)[0][1];
        const className = resolve(`TEXT_CLASS_${i.classid.substring(4)}`);
        const image = i.face_tex;

        return [name, star, className, image];
      });

    const jewelsSpent = this.state.amount === 10 ? 50 : 6 + (this.state.amount - 1) * 5;
    const usdSpent = jewelsSpent * 84.99 / 200;

    this.setState({
      jewelsSpent: parseInt(jewelsSpent + this.state.jewelsSpent, 10),
      usdSpent: (usdSpent + parseFloat(this.state.usdSpent)).toFixed(2),
      render: this.renderResults(results),
    });
  }

  renderResults = (results) => {
    return (
      <Panel>
      <ListGroup fill>
      {results.map((i, index) => {
        return (
          <LinkContainer key={index} to={`/cqdb/heroes/${i.slice(0, 3).join('&')}`}>
            <ListGroupItem bsStyle={i[1] > 3 ? 'success' : ''}>
              <Media>
                <Grid fluid>
                  <Row>
                    <Col style={{padding: 0,}} lg={2} md={3} sm={4} xs={5}>
                      <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                        <img alt='' src={imagePath('cq-assets', `heroes/${i[3]}.png`)} />
                      </Media.Left>
                    </Col>
                    <Col style={{padding: 0,}} lg={10} md={9} sm={8} xs={7}>
                      <Media.Body>
                        <Media.Heading>
                          {i[1] > 3 ? <b>{`${i[0]} (${i[1]}★)`}</b> : `${i[0]} (${i[1]}★)`}
                        </Media.Heading>
                        {index + 1 === 10 ? <p>Guaranteed</p> : ''}
                      </Media.Body>
                    </Col>
                  </Row>
                </Grid>
              </Media>
            </ListGroupItem>
          </LinkContainer>
        );
      })}
      </ListGroup>
      </Panel>
    );
  }

  handleSelect = (e) => {
    this.setState({ amount: parseInt(e.target.value, 10), });
  }

  render = () => {
    const footer = (
      <p>
        <a href='https://goo.gl/k62wvU'>
          6★: 0.60%, 5★: 3.50%, 4★: 14.90%, 3★: 81.00%.
        </a>
        <br />
        200 jewels = $84.99.
      </p>
    );
      
    return (
      <Row>
        <Col lg={4} md={4} sm={12} xs={12}>
          <Panel footer={footer}>
            <Grid fluid>
              <Row>
                <Col lg={12} md={12} sm={6} xs={6}>
                  <FormGroup controlId="formControlsSelect">
                    <FormControl componentClass="select" onChange={this.handleSelect}>
                      {
                        range(10).reverse().map(i => <option key={i} value={i}>{i}</option>)
                      }
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col lg={12} md={12} sm={6} xs={6}>
                  <Button block onClick={this.handleButton}>Pull Contracts</Button>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col lg={6} md={6} sm={6} xs={6}>
                  {`Jewels spent: ${this.state.jewelsSpent}`}
                </Col>
                <Col lg={6} md={6} sm={6} xs={6}>                
                  {`USD spent: \$${this.state.usdSpent}`}
                </Col>
              </Row>
            </Grid>
          </Panel>
        </Col>
        <Col lg={8} md={8} sm={12} xs={12}>
          {this.state.render}
        </Col>
      </Row>
    );
  }
}