import Footer from './Footer'
import {mount} from "cypress/react18"

describe('<Footer />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(<Footer />)
  })
})