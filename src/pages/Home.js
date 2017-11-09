import React, { Component, } from 'react';
import {
  Col,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { imagePath, } from '../util/imagePath';

export default class Home extends Component {
  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12} style={{alignItems: 'center', display: 'flex', justifyContent: 'center',}}>
          <img alt='' src={imagePath('src/assets/banner', 'cqdb')} style={{maxWidth: '100%',}} />
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Hello!</Media.Heading>
            Welcome to the Crusaders Quest Database.
          </Panel>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Join the Discussion!</Media.Heading>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
              <a href='https://discord.gg/WjEFnzC'>
                <img alt='cqdb Discord Server' src='https://discordapp.com/api/guilds/258167954913361930/embed.png?style=banner2' />
              </a>
              <a href='https://discord.gg/6TRnyhj'>
                <img alt='Crusaders Quest Discord Server' src='https://discordapp.com/api/guilds/206599473282023424/embed.png?style=banner2' />
              </a>
            </div>
          </Panel>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Fergus</Media.Heading>
            <a href='https://github.com/Johj/fergus'>Fergus</a> is a Discord bot for Crusaders Quest. Enjoy all the features of cqdb inside your Discord server!
            Bot invitation link can be found <a href='https://goo.gl/nDluCQ'>here</a>.
          </Panel>
        </Col>
      </Row>
    );
  }
}
