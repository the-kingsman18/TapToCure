import Contact from './contact'
import {mount} from "cypress/react18"

describe('<Contact />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<Contact />)
  })
})