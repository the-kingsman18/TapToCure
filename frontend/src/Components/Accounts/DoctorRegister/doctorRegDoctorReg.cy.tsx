/// <reference types="cypress" />
import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';
import DoctorReg from '../DoctorRegister/doctorReg'; // Adjust the path accordingly

describe('DoctorReg Component', () => {
  beforeEach(() => {
    // Mount the component with MemoryRouter
    mount(
      <MemoryRouter initialEntries={[{ pathname: '/doctor', state: { id: "test-id" } }]}>
        <DoctorReg />
      </MemoryRouter>
    );
  });

  it('should display the registration form with all fields', () => {
    cy.get('.registercontainer').should('exist');
    cy.get('input[name="Degree"]').should('exist');
    cy.get('select[name="speciality"]').should('exist');
    cy.get('input[name="experience"]').should('exist');
    cy.get('input[name="medicalLicense"]').should('exist');
    cy.get('select[name="state"]').should('exist');
    cy.get('select[name="city"]').should('exist');
    cy.get('input[name="clinicAddress"]').should('exist');

    cy.get('input[name="profileimage"]').should('exist');
    cy.get('.registerbutton').should('exist');
  });

  it('should validate form fields and show error messages', () => {
    cy.get('.registerbutton').click();
  
    cy.get('.errormessage').should('contain', 'Degree is a required field');
    cy.get('.errormessage').should('contain', 'speciality is a required field');
    cy.get('.errormessage').should('contain', 'experience is a required field');
    cy.get('.errormessage').should('contain', 'medicalLicense is a required field');
    cy.get('.errormessage').should('contain', 'state is a required field');
    cy.get('.errormessage').should('contain', 'city is a required field');
    cy.get('.errormessage').should('contain', 'clinicAddress is a required field');
    cy.get('.errormessage').should('contain', 'about is a required field');
    cy.get('.errormessage').should('contain', 'Profile image is required');
  });

  it('should allow typing in text fields', () => {
    cy.get('input[name="Degree"]').type('MBBS').should('have.value', 'MBBS');
    cy.get('input[name="experience"]').type('5').should('have.value', '5');
    cy.get('input[name="medicalLicense"]').type('123456').should('have.value', '123456');
    cy.get('input[name="clinicAddress"]').type('123 Main St').should('have.value', '123 Main St');
    
  });

  it('should allow selecting options from dropdowns', () => {
   
   
    cy.get('select[name="state"]').select('Karnataka').should('have.value', 'Karnataka');
    cy.get('select[name="city"]').select('Bengaluru').should('have.value', 'Bengaluru');
  });



  it('should submit the form successfully', () => {
    cy.get('input[name="Degree"]').type('MBBS');
   
    cy.get('input[name="experience"]').type('5');
    cy.get('input[name="medicalLicense"]').type('123456');
    cy.get('select[name="state"]').select('Karnataka');
    cy.get('select[name="city"]').select('Bengaluru');
    cy.get('input[name="clinicAddress"]').type('123 Main St');
   
    
   
    
    cy.get('.registerbutton').click();

    // Add assertions to verify successful form submission
    // For example, check if the navigation happened or if a success message is shown
  });
});
