import React from 'react';
import {
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormGroup,
} from 'react-bootstrap';

function renderCheckbox(handleCheckbox, checkboxFilters, category, label) {
  const isChecked = checkboxFilters[category][label];
  return (
    <Checkbox defaultChecked={isChecked} inline key={`${label}${isChecked}`} name={`${category}&${label}`} onChange={handleCheckbox}>
      {label}
    </Checkbox>
  );
}

export function renderCheckboxes(handleCheckbox, checkboxFilters, checkboxes) {
  return (
    <Form horizontal>
      {
        Object.keys(checkboxes).map(i => (
          <FormGroup key={i}>
            <Col componentClass={ControlLabel} lg={2} md={2} sm={2} xs={12}>{i}</Col>
            <Col lg={10} md={10} sm={10} xs={12}>
              {checkboxes[i].map(j => renderCheckbox(handleCheckbox, checkboxFilters, i, j))}
            </Col>
          </FormGroup>
        ))
      }
    </Form>
  );
}
