import React from 'react';
import {
  Button,
  Col,
} from 'react-bootstrap';

import { countFilters, } from '../util/countFilters';

export function renderButton(handleButton, label, checkboxFilters) {
  return (
    <Col lg={4} md={4} sm={12} xs={12}>
      <Button block onClick={handleButton} style={{marginBottom: 5,}}>
        {`${label} ${countFilters(checkboxFilters)}`}
      </Button>
    </Col>
  );
}