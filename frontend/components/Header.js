import Nav from './Nav';
import Link from 'next/link';
import styled from 'styled-components';

const Logo = styled.div`
    @media (max-width: 1300px) {
        margin: 0;
        text-align: center;
    }
`;

const StyledHeader = styled.header`
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
  }
`;

const Header = () => (
    <StyledHeader>
        <div className='bar'>
            <Logo>
                <Link href='/'>
                    <img src="/static/adidas-logo.png" />
                </Link>
            </Logo>
            <Nav />
        </div>
        <div className='sub-bar'>
            <p>Search</p>
        </div>
        <div>Cart</div>
    </StyledHeader>
);

export default Header;