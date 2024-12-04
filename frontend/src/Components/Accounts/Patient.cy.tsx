/// <reference types="cypress" />

import { mount } from 'cypress/react18';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from '../Store/MyStore'; // Adjust the path accordingly
import Patient from '../Accounts/Patient'; // Adjust the path accordingly
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

describe('Patient Component', () => {
  beforeEach(() => {
    // Mount the component with Redux Provider and MemoryRouter
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/patient', state: { id: 'test-id' } }]}>
          <Routes>
            <Route path="/patient" element={<Patient />} />
          </Routes>
          <ToastContainer />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render the registration form with all fields', () => {
    cy.get('.register-container').should('exist');
    cy.get('input[name="bloodGroup"]').should('exist');
    cy.get('input[name="height"]').should('exist');
    cy.get('input[name="weight"]').should('exist');
    cy.get('input[name="age"]').should('exist');
    cy.get('select[name="state"]').should('exist');
    cy.get('select[name="city"]').should('exist');
    cy.get('input[name="address"]').should('exist');
    cy.get('input[name="emergencyContact"]').should('exist');
    cy.get('.register-button').should('exist');
  });

  

  it('should allow typing in text fields', () => {
    cy.get('input[name="bloodGroup"]').type('A+ve').should('have.value', 'A+ve');
    cy.get('input[name="height"]').type('170').should('have.value', '170');
    cy.get('input[name="weight"]').type('65').should('have.value', '65');
    cy.get('input[name="age"]').type('25').should('have.value', '25');
    cy.get('input[name="address"]').type('123 Main St').should('have.value', '123 Main St');
    cy.get('input[name="emergencyContact"]').type('1234567890').should('have.value', '1234567890');
  });

  it('should allow selecting options from dropdowns', () => {
    cy.get('select[name="state"]').select('Karnataka').should('have.value', 'Karnataka');
    cy.get('select[name="city"]').select('Bengaluru').should('have.value', 'Bengaluru');
  });

  it('should submit the form successfully with valid data', () => {
    cy.get('input[name="bloodGroup"]').type('A+ve');
    cy.get('input[name="height"]').type('170');
    cy.get('input[name="weight"]').type('65');
    cy.get('input[name="age"]').type('25');
    cy.get('select[name="state"]').select('Karnataka');
    cy.get('select[name="city"]').select('Bengaluru');
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('input[name="emergencyContact"]').type('1234567890');
    cy.get('.register-button').click();

    // Add assertions to verify successful form submission can be added here if needed
  });
});

