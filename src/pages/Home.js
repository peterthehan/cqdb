import React, { Component, } from 'react';
import {
  Alert,
  Carousel,
  Col,
  Image,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { imagePath, } from '../util/imagePath';

export default class Home extends Component {
  renderCarouselItem = (i) => {
    return (
      <Carousel.Item key={i}>
        <img alt='' src={imagePath('cqdb', `src/assets/carousel_${i}.png`)} />
      </Carousel.Item>
    )
  }

  render = () => {
    return (
      <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Alert>
            The site is currently a work-in-progress so apologies for any missing information or inconveniences.
            Feel free to report bugs or suggest features <strong><a href='https://github.com/Johj/cqdb/issues'>here</a></strong>.
          </Alert>
          <Image alt='' responsive src={imagePath('cqdb', 'src/assets/banner.png')} />
          <Panel>
            <Media.Heading>Hello!</Media.Heading>
            <p>
              Welcome to the <a href='https://play.google.com/store/apps/details?id=com.nhnent.SKQUEST'>Crusaders Quest</a> Database!
            </p>
          </Panel>
        </Col>
        <Col lg={8} md={12} sm={12} xs={12}>
          <Panel>
            <Carousel>
              {Array.from({length: 6}, (v, i) => i).slice(1).map(this.renderCarouselItem)}
            </Carousel>
          </Panel>
        </Col>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Join Us!</Media.Heading>
            <p>Bot and cqdb Development Server</p>
            <a href='https://discord.gg/WjEFnzC'>
              <Image alt='' responsive src='https://discordapp.com/api/guilds/258167954913361930/embed.png?style=banner2' />
            </a>
            <p></p>
            <p>Official Server</p>
            <a href='https://discord.gg/6TRnyhj'>
              <Image alt='' responsive src='https://discordapp.com/api/guilds/206599473282023424/embed.png?style=banner2' />
            </a>
          </Panel>
        </Col>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>
              Add <a href='https://github.com/Johj/fergus'>Fergus</a> To Your Discord Server
            </Media.Heading>
            <a href='https://goo.gl/nDluCQ'>Invite Link</a>
          </Panel>
        </Col>
      </Row>
    );
  }
}