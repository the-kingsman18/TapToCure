import { mount } from 'cypress/react18'
import About from './about'

describe('<About />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<About />)
  })
})