import { mount } from 'cypress/react18'
import BMICalculator from './BMICalculator'

describe('<BMICalculator />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<BMICalculator />)
  })
})