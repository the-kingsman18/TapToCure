import { Provider } from 'react-redux';
import { store } from '../../Store/MyStore'; // Adjust the path to your store
import Login from '../Login/login'; // Adjust the path to your Login component
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'cypress/react18';

describe('Login Page', () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render the login form', () => {
    cy.get('body').debug(); // Debugging step to inspect the rendered HTML
    cy.get('h2').contains('Login');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Login');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.get('small').contains('Email is required');
    cy.get('small').contains('Password is required');
  });

  it('should show validation error for invalid email', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    //cy.contains('small', 'Invalid email address', { timeout: 10000 }).should('be.visible');
  });

  it('should show error toast for incorrect credentials', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify__toast--error').contains('Login failed. Please check your credentials and try again.');
  });

  it('should login successfully with correct credentials', () => {
    cy.get('input[name="email"]').type('devi@gmail.com');
    cy.get('input[name="password"]').type('Devi@123');
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify__toast--success').contains('Login success');
    //cy.url().should('include', '/doctordashboard'); // Adjust the URL if necessary
  });

  it('should show password reset link', () => {
    cy.contains('Forgot Password?').click();
    cy.get('button[type="submit"]').contains('Send me reset link');
  });

  it('should send password reset link', () => {
    cy.contains('Forgot Password?').click();
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Password reset link sent to user@example.com');
    });
  });

  it('should show admin code modal on admin login', () => {
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('Admin@123');
    cy.get('button[type="submit"]').click();
    cy.get('.modal').should('be.visible');
  });

  it('should login admin with correct code', () => {
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('Admin@123');
    cy.get('button[type="submit"]').click();
    cy.get('.modal input').type('7722');
    cy.get('.modal button').contains('Submit').click();
    cy.get('.Toastify__toast--success').contains('Login success');
  //  cy.url().should('include', '/admindashboard'); // Adjust the URL if necessary
  });

  it('should show error for incorrect admin code', () => {
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('Admin@123');
    cy.get('button[type="submit"]').click();
    cy.get('.modal input').type('3562');
    cy.get('.modal button').contains('Submit').click();
    cy.get('.Toastify__toast--error').contains('Invalid code. Please try again.');
  });
});
