import React, { Component, } from 'react';
import {
  Carousel,
  Col,
  Image,
  Label,
  Media,
  Panel,
  Row,
} from 'react-bootstrap';

import { imagePath, } from '../util/imagePath';
import { range, } from '../util/range';

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
        <Col 
          style={{alignItems: 'center', display: 'flex', justifyContent: 'center',}}
          lg={12} md={12} sm={12} xs={12}
        >
          <Image alt='' responsive src={imagePath('cqdb', 'src/assets/banner.png')} />
        </Col>
        <Col lg={8} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Hello!</Media.Heading>
            <p>Welcome to the Crusaders Quest Database.</p>
          </Panel>
        </Col>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Database Version</Media.Heading>
            <p style={{display: 'flex', justifyContent: 'center',}}>
              <a href='https://play.google.com/store/apps/details?id=com.nhnent.SKQUEST'>
                <Label bsStyle='primary'>Android 3.9.5.KG</Label>
              </a>
              &nbsp;
              <a href='https://itunes.apple.com/us/app/crusaders-quest/id901858272'>
                <Label bsStyle='primary'>iOS 3.9.4</Label>
              </a>
            </p>
          </Panel>
        </Col>
        <Col lg={8} md={12} sm={12} xs={12}>
          <Panel>
            <Carousel>
              {range(5).map(this.renderCarouselItem)}
            </Carousel>
          </Panel>
        </Col>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>Join the Discussion</Media.Heading>
            <Row>
              <Col
                style={{display: 'flex', justifyContent: 'center',}}
                lg={12} md={12} sm={12} xs={12}
              >
                <p>
                  <a href='https://discord.gg/WjEFnzC'>
                    <Image alt='' responsive src='https://discordapp.com/api/guilds/258167954913361930/embed.png?style=banner2' />
                  </a>
                </p>
              </Col>
              <Col
                style={{display: 'flex', justifyContent: 'center',}}
                lg={12} md={12} sm={12} xs={12}
              >
                <p>
                  <a href='https://discord.gg/6TRnyhj'>
                    <Image alt='' responsive src='https://discordapp.com/api/guilds/206599473282023424/embed.png?style=banner2' />
                  </a>
                </p>
              </Col>
            </Row>
          </Panel>
        </Col>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Panel>
            <Media.Heading>
              <a href='https://github.com/Johj/fergus'>Fergus</a>
            </Media.Heading>
            <p>
              Have all the features of cqdb available inside your Discord server.
              Bot invitation link can be found <a href='https://goo.gl/nDluCQ'>here</a>.
            </p>
          </Panel>
        </Col>
      </Row>
    );
  }
}