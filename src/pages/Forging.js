import React, { Component, } from 'react';
import {
  Button,
  Col,
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
const data = require('../Decrypted/filtered_weapon_sbw.json')
  .filter(i => i.grade === 4 && i.rarity === 'LEGENDARY');

export default class Forging extends Component {
  state = {
    goldSpent: 0,
    ironSpent: 0,
    numberOfWeapons: 10,
    powderSpent: 0,
    render: [],
    weaponType: 'Sword',
  }

  pickConversions = () => {
    const options = ['Attack', 'Defense', 'Function',];
    return [
      options[random(0, options.length - 1)],
      options[random(0, options.length - 1)],
    ];
  }

  pickWeapon = (i) => {
    const pool = data
      .filter(i => i.categoryid.toLowerCase().includes(this.state.weaponType.toLowerCase()));

    return pool[random(0, pool.length - 1)];
  }

  handleNumberSelect = (e) => {
    this.setState({ numberOfWeapons: parseInt(e.target.value, 10), });
  }

  handleWeaponSelect = (e) => {
   this.setState({ weaponType: e.target.value, }); 
  }

  handleButton = (e) => {
    const dict = {
      'Sword': 'Warrior',
      'Hammer': 'Paladin',
      'Bow': 'Archer',
      'Gun': 'Hunter',
      'Staff': 'Wizard',
      'Orb': 'Priest',
    };
    const results = range(this.state.numberOfWeapons)
      .map(this.pickWeapon)
      .map(i => {
        const weaponName = resolve(i.name);
        const conversion = this.pickConversions();
        const heroName = resolve(`TEXT_${i.reqhero_ref}_NAME`);
        const star = 4;
        const className = dict[this.state.weaponType];
        const weaponImage = i.skin_tex;

        return [weaponName, conversion, heroName, star, className, weaponImage,];
      });

    const goldSpent = 7500 * this.state.numberOfWeapons;
    const ironSpent = 4000 * this.state.numberOfWeapons;
    const powderSpent = 350 * this.state.numberOfWeapons;

    this.setState({
      goldSpent: goldSpent + this.state.goldSpent,
      ironSpent: ironSpent + this.state.ironSpent,
      powderSpent: powderSpent + this.state.powderSpent,
      render: this.renderResults(results),
    });
  }

  renderResults = (results) => {
    return (
      <Panel>
        <ListGroup fill>
          {
            results.map((i, index) => {
              return (
                <LinkContainer key={index} to={`/cqdb/heroes/${i.slice(2, 5).join('&')}`}>
                  <ListGroupItem>
                    <Media>
                      <Grid fluid>
                        <Row>
                          <Col style={{padding: 0,}} lg={3} md={4} sm={4} xs={5}>
                            <Media.Left style={{display: 'flex', justifyContent: 'center',}}>
                              <img alt='' src={imagePath('cq-assets', `sbws/${i[i.length - 1]}.png`)} />
                            </Media.Left>
                          </Col>
                          <Col style={{padding: 0,}} lg={9} md={8} sm={8} xs={7}>
                            <Media.Body>
                              <Media.Heading>
                                {`${i[0]} / ${i[2]}`}
                              </Media.Heading>
                              <p>{i[1].join(', ')}</p>
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


  renderOptions = (i) => {
    return <option key={i} value={i}>{i}</option>;
  }

  render = () => {
    return (
      <Row>
        <Col lg={4} md={4} sm={12} xs={12}>
          <Panel>
            <Grid fluid>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <FormGroup controlId="formControlsSelect">
                    <FormControl componentClass="select" onChange={this.handleNumberSelect}>
                      {range(10).reverse().map(this.renderOptions)}
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <FormGroup controlId="formControlsSelect">
                    <FormControl componentClass="select" onChange={this.handleWeaponSelect}>
                      {['Sword', 'Hammer', 'Bow', 'Gun', 'Staff', 'Orb',].map(this.renderOptions)}
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Button block onClick={this.handleButton}>Forge Sbws</Button>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col lg={6} md={6} sm={6} xs={6}>
                  {`Gold: ${this.state.goldSpent}`}
                </Col>
                <Col lg={6} md={6} sm={6} xs={6}>                
                  {`Iron: ${this.state.ironSpent}`}
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>                
                  {`Crystal Powder: ${this.state.powderSpent}`}
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