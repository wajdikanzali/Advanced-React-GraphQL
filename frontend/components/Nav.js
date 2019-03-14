import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { Mutation } from 'react-apollo';
import User from './User';
import Signout from './Signout';
import styled from 'styled-components';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';

const UserName = styled.div`
  color: green;
`;

const Nav = () => (
    <User>
         {({ data: { me } }) => (
       <NavStyles>
           <UserName> {me && me.name} </UserName>
        <Link href="/items">
            <a>Shop</a>
        </Link>
        {me && (
            <>
        <Link href="/sell">
            <a>Sell</a>
        </Link>
        <Link href="/orders">
            <a>Ordres</a>
        </Link>
        <Signout />
        </>
        )}
        {!me && (
        <Link href="/signup">
            <a>Signup</a>
        </Link>
        )}
        <Mutation mutation={TOGGLE_CART_MUTATION}>
        {toggleCart => (
            <button onClick={toggleCart}>
            My Cart
            {me && (
                <CartCount count={me.cart.reduce((acc, totalQuantity) => acc + totalQuantity.quantity ,0)} />
            )}
            </button>
        )}
        </Mutation>
    </NavStyles>
       )}
    </User>
);

export default Nav;