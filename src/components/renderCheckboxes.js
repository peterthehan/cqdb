import React from 'react';
import {
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  Panel,
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
    <Panel collapsible header='Filters' style={{marginBottom: '5px',}}>
      <Form horizontal>
        {
          Object.keys(checkboxes).map(i => (
            <FormGroup key={i}>
              <Col componentClass={ControlLabel} lg={2} md={3} sm={4} xs={12}>{i}</Col>
              <Col lg={10} md={9} sm={8} xs={12}>
                {checkboxes[i].map(j => renderCheckbox(handleCheckbox, checkboxFilters, i, j))}
              </Col>
            </FormGroup>
          ))
        }
      </Form>
    </Panel>
  );
}
