import React, { Component, } from 'react';
import {
  Accordion,
  Col,
  Media,
  Pager,
  Panel,
  Row,
} from 'react-bootstrap';
import { LinkContainer, } from 'react-router-bootstrap';

import { resolve, } from '../util/resolve';
const heroData = require('../Decrypted/get_character_visual.json')['character_visual'].filter(i => i.type === 'HERO');
const statData = require('../Decrypted/get_character_stat.json')['character_stat'].filter(element => element['hero_type'] !== null);

export default class HeroInformation extends Component {
  state = {
    hero: {},
    pager: [],
    render: '',
    stat: {},
  }

  componentWillMount = () => {
    console.log('componentWillMount');
    this.findHeroes();
  }

  componentDidMount = () => {
    console.log('componentDidMount');
  }

  componentWillReceiveProps = () => {
    console.log('componentWillReceiveProps');
    this.findHeroes();
  }

  componentWillUpdate = () => {
    console.log('componentWillUpdate');
  }

  findTarget = () => {
    const target = window.location.pathname.split('/')[3].split('&');
    target[0] = decodeURIComponent(target[0]);
    return target;
  }

  findHero = (target, key) => {
    if (target.constructor === Array) {
      for (let i of heroData) {
        const name = resolve(i.name);
        const star = i.id.match(/_\d/)[0][1];
        const clas = resolve('TEXT_CLASS_' + i.classid.substring(4));

        if ([name, star, clas].every(j => target.indexOf(j) > -1)) {
          return i;
        }
      }
    } else {
      for (let i of heroData) {
        if (i[key] === target) {
          return i;
        }
      }
    }
    return null;
  }

  findHeroes = () => {
    const hero = this.findHero(this.findTarget());
    const stat = statData.filter(j => j.id === hero.default_stat_id)[0];

    const prevHero = this.findHero(hero.id, 'upgradetargethero');
    const nextHero = !hero.upgradetargethero ? null : this.findHero(hero.upgradetargethero, 'id');
    
    const pager = [];
    if (prevHero) {
      const name = resolve(prevHero.name);
      const star = prevHero.id.match(/_\d/)[0][1];
      const clas = resolve('TEXT_CLASS_' + prevHero.classid.substring(4));
      const image = prevHero.face_tex;

      pager.push([name, star, clas, image,]);
    }
    if (nextHero) {
      const name = resolve(nextHero.name);
      const star = nextHero.id.match(/_\d/)[0][1];
      const clas = resolve('TEXT_CLASS_' + nextHero.classid.substring(4));
      const image = nextHero.face_tex;

      pager.push([name, star, clas, image,]);
    }

    this.setState({
      hero: hero,
      pager: pager,
      stat: stat,
    }, () => this.renderInformation());
  }

  renderInformation = () => {
    const render = (
      <div>
        {this.renderGeneral()}
        {this.renderBlock()}
        {this.renderPagers()}
      </div>
    );
    this.setState({render});
  }

  renderGeneral = () => {
    return (
      <Accordion>
        <Panel header={`${resolve(this.state.hero.name)} (${this.state.stat.grade}★) `}>
          <Media>
            <Media.Body>
              <p>{resolve(this.state.hero.desc)}</p>
            </Media.Body>
            <Media.Right>
              <img src={`https://raw.githubusercontent.com/Johj/fergus/master/assets/heroes/${this.state.hero.face_tex}.png`} alt='' />
            </Media.Right>
            <Row className="show-grid">
              <Col xs={6} md={3}>
                <Media.Heading>Class</Media.Heading>
                <p>{resolve('TEXT_CLASS_' + this.state.hero.classid.substring(4))}</p>
              </Col>
              <Col xs={6} md={3}>
                <Media.Heading>Rarity</Media.Heading>
                <p>
                  {
                    resolve(
                      'TEXT_CONFIRM_SELL_' +
                      (this.state.hero.rarity === 'LEGENDARY' 
                        ? this.state.hero.isgachagolden ? 'IN_GACHA' : 'LAGENDARY'
                        : this.state.hero.rarity
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
                    ['CHEN', 'GODDESS', 'MINO', 'NOS',].includes(this.state.hero.domain) || !this.state.hero.domain
                    ? 'Unknown' // remove unreleased domains
                    : resolve(this.state.hero.domain === 'NONEGROUP'
                        ? 'TEXT_CHAMP_DOMAIN_' + this.state.hero.domain + '_NAME'
                        : 'TEXT_CHAMPION_DOMAIN_' + this.state.hero.domain
                      )
                  }
                </p>
              </Col>
              <Col xs={6} md={3}>
                <Media.Heading>Gender</Media.Heading>
                <p>{resolve('TEXT_EXPLORE_TOOLTIP_GENDER_' + this.state.hero.gender)}</p>
              </Col>
            </Row>
          </Media>
        </Panel>
      </Accordion>
    );
  }

  renderBlock = () => {
    let passive = '';
    const skill_subname = resolve(this.state.stat.skill_subname);
    const skill_subdesc = resolve(this.state.stat.skill_subdesc);
    if (skill_subname && skill_subdesc) {
      // key does not resolve as-is, modification necessary
      passive = (
        <Row className="show-grid">
          <Col xs={12} md={12}>
            <Media.Heading>
              {
                skill_subname + ' (' +
                resolve('TEXT_PASSIVE_SKILL_TOOLTIP_TYPE_' + this.state.stat.hero_type) +
                ')'
              }
            </Media.Heading>
            <p>{skill_subdesc}</p>
          </Col>
        </Row>
      );
    }

    return (
      <Accordion>
        <Panel header='Block Skill'>
          <Media>
            <Media.Body>
              <Media.Heading>
                {
                  resolve(this.state.stat.skill_name) +
                  ` (Lv. ${[1, 1, 1, 2, 2, 3][this.state.stat.grade - 1]})`
                }
              </Media.Heading>
              <p>{resolve(this.state.stat.skill_desc)}</p>

            </Media.Body>
            <Media.Right>
              <img width={66} src={`https://raw.githubusercontent.com/Johj/fergus/master/assets/blocks/${this.state.stat.skill_icon}.png`} alt='' />
            </Media.Right>
            {passive}
          </Media>
        </Panel>
      </Accordion>
    );
  }

  renderPager = (pager) => {
    const img = pager.pop();
    return (
      <LinkContainer key={`${pager.join('')}`} to={`/cqdb/heroes/${pager.join('&')}`}>
        <Pager.Item>
          <Media>
            <img src={`https://raw.githubusercontent.com/Johj/fergus/master/assets/heroes/${img}.png`} alt='' />
          </Media>
          {`${pager[0]} (${pager[1]}★)`}
        </Pager.Item>
      </LinkContainer>
    );
  }

  renderPagers = () => {
    const pagers = this.state.pager.map(this.renderPager);
    pagers.splice(1, 0, ' ');
    return (
      <Pager>
        {pagers}
      </Pager>
    );
  }

  render = () => {
    console.log('render');
    return (
      <div>
        {this.state.render}
      </div>
    );
  }
}

/*

*/