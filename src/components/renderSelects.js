import React from 'react';
import {
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from 'react-bootstrap';

function renderSelect(category, label) {
  return <option key={label} value={label}>{label}</option>;
}

export function renderSelects (handles, defaultValues, selects) {
  return (
    <Form horizontal>
      {
        Object.keys(selects).map((i, index) => (
          <FormGroup key={i}>
            <Col componentClass={ControlLabel} lg={2} md={2} sm={2} xs={12}>{i}</Col>
            <Col lg={10} md={10} sm={10} xs={12}>
              <FormControl componentClass="select" defaultValue={defaultValues[index]} onChange={handles[index]}>
                {selects[i].map(j => renderSelect(i, j))}
              </FormControl>
            </Col>
          </FormGroup>
        ))
      }
    </Form>
  );
}