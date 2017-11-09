import React from 'react';
import {
  Button,
  Col,
} from 'react-bootstrap';

import { countFilters, } from '../util/countFilters';

export function renderButton(handleButton, label, checkboxFilters = {}) {
  const numCheckboxFilters = countFilters(checkboxFilters);
  return (
    <Col lg={4} md={6} sm={12} xs={12}>
      <Button block onClick={handleButton} style={{marginBottom: 5,}}>
        {label + (!numCheckboxFilters ? '' : ` (${numCheckboxFilters})`)}
      </Button>
    </Col>
  );
}
