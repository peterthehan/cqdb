import React, { Component, } from 'react';
import {
  Col,
  Grid,
  Image,
  ListGroup,
  ListGroupItem,
  Media,
  PageHeader,
  Pager,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { resolve, } from '../util/resolve';
const data = require('../Decrypted/get_character_visual.json')['character_visual'].filter(i => i.type === 'HERO');

export default class HeroInformation extends Component {
  state = {
    display: '',
    info: {},
    pager: [],
    target: [],
  }

  componentWillMount = () => {
    this.initializeTarget();
    this.findHeroes();
  }

  initializeTarget = () => {
    const target = window.location.pathname.split('/')[3].split('&');
    target[0] = decodeURIComponent(target[0]);
    target.forEach(i => this.state.target.push(i));
  }

  findHeroes = () => {
    let info;
    let pager = [];
    let flag = false;
    for (let i of data) {
      const name = resolve(i.name);
      const star = i.id.match(/_\d/)[0][1];
      const clas = resolve('TEXT_CLASS_' + i.classid.substring(4));
      const path = [name, star, clas];

      pager.push(path);
      if (pager.length >= 3) {
        pager.splice(0, 1);
      }

      if (flag) {
        break;
      }

      if ([name, star, clas].every(j => this.state.target.indexOf(j) > -1)) {
              const name = resolve(i.name);
      const star = i.id.match(/_\d/)[0][1];
      const clas = resolve('TEXT_CLASS_' + i.classid.substring(4));
      const rarity = resolve(
        'TEXT_CONFIRM_SELL_' +
        (i.rarity === 'LEGENDARY' 
          ? i.isgachagolden ? 'IN_GACHA' : 'LAGENDARY'
          : i.rarity
        ) +
        '_HERO'
      );
      const faction = ['CHEN', 'GODDESS', 'MINO', 'NOS',].includes(i.domain) || !i.domain
        ? 'Unknown' // remove unreleased domains
        : resolve(i.domain === 'NONEGROUP'
            ? 'TEXT_CHAMP_DOMAIN_' + i.domain + '_NAME'
            : 'TEXT_CHAMPION_DOMAIN_' + i.domain
          );
      const gender = resolve('TEXT_EXPLORE_TOOLTIP_GENDER_' + i.gender);
        info = i;
        pager.splice(-1, 1);
        flag = true;
      }
    }
    this.setState({
      info: info,
      pager: pager,
    }, () => {
      console.log('a', this.state.info, this.state.pager);
      this.renderInformation();
    });
  }

  renderInformation = () => {
    const display = (
      <div>
        <Panel>
          <Media>
            <Media.Body>
              <Media.Heading>{`${this.state.target[0]} (${this.state.target[1]}★) `}</Media.Heading>
              <p>{resolve(this.state.info.desc)}</p>
            </Media.Body>
            <Media.Right>
              <img src={`https://raw.githubusercontent.com/Johj/fergus/master/assets/heroes/${this.state.info.face_tex}.png`} alt="Image"/>
            </Media.Right>
          </Media>

          <Media>
            <Row className="show-grid">
              <Col xs={6} md={3}>
                <Media.Heading>Class</Media.Heading>
                <p>{this.state.target[2]}</p>
              </Col>
              <Col xs={6} md={3}>
                <Media.Heading>Rarity</Media.Heading>
                <p>
                  {
                    resolve(
                      'TEXT_CONFIRM_SELL_' +
                      (this.state.info.rarity === 'LEGENDARY' 
                        ? this.state.info.isgachagolden ? 'IN_GACHA' : 'LAGENDARY'
                        : this.state.info.rarity
                      ) +
                      '_HERO'
                    )
                  }
                </p>
              </Col>
              <Col xs={6} md={3}>
                <Media.Heading>Faction</Media.Heading>
                <p>
                  {
                    ['CHEN', 'GODDESS', 'MINO', 'NOS',].includes(this.state.info.domain) || !this.state.info.domain
                    ? 'Unknown' // remove unreleased domains
                    : resolve(this.state.info.domain === 'NONEGROUP'
                        ? 'TEXT_CHAMP_DOMAIN_' + this.state.info.domain + '_NAME'
                        : 'TEXT_CHAMPION_DOMAIN_' + this.state.info.domain
                      )
                  }
                </p>
              </Col>
              <Col xs={6} md={3}>
                <Media.Heading>Gender</Media.Heading>
                <p>{resolve('TEXT_EXPLORE_TOOLTIP_GENDER_' + this.state.info.gender)}</p>
              </Col>
            </Row>
          </Media>
        </Panel>

        <Panel>

        </Panel>
      </div>
    );

    this.setState({display});
  }

  render = (props) => {
    return (
      <div>
        {this.state.display}
      </div>
    );
  }
}

/*
  createPager = (pager) => (
    <LinkContainer key={`${pager[0]}&${pager[1]}&${pager[2]}`} to={`/cqdb/heroes/${pager[0]}&${pager[1]}&${pager[2]}`}>
      <Pager.Item key={`${pager[0]}${pager[1]}`} onClick={this.forceUpdate}>
        {`${pager[0]} (${pager[1]}★)`}
      </Pager.Item>
    </LinkContainer>
  )

  createPagers = () => {
    const pagers = this.state.pager.map(this.createPager);
    pagers.splice(1, 0, ' ');
    return (
      <Pager>
        {pagers}
      </Pager>
    );
  }
*/