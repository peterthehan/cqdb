import React from 'react';
import {
  Col,
  Button,
  Modal,
} from 'react-bootstrap';

export function renderModal(handleButton, showModal, title, render) {
  return (
    <Col lg={12} md={12} sm={12} xs={12}>
      <Modal show={showModal} onHide={handleButton}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {render}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleButton}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
}