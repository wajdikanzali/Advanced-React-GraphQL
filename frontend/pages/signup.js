import Signup from '../components/Signup';
import styled from 'styled-components';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const signup = props => (
    <Columns>
        <Signup />
    </Columns>
)

export default signup;