import React from 'react';
import CartStyles from './styles/CartStyles';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import User from './User';
import Supreme from './styles/Supreme';
import Error from './ErrorMessage';
import CloseButton from './styles/CloseButton';
import UpdateButton from './styles/UpdateButton';
import CartItem from './CartItem';
import CalcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;
const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = () => (
    <User>{({ data: { me } }) => {
        if(!me) return null;
        return(
        <Mutation mutation={TOGGLE_CART_MUTATION}>
            {toggleCart => (
                <Query query={LOCAL_STATE_QUERY}>
                    {({ data }) => (
                        <CartStyles open={data.cartOpen}>
                            <header>
                                <CloseButton onClick={toggleCart} title="close">
                                    &times;
                                </CloseButton>
                                <Supreme>{me.name}'s' Cart</Supreme>
                                <p>
                                    You Have {me.cart.length} Item
                                    {me.cart.length === 1 ? '' : 's' } in
                                    your cart.
                                </p>
                            </header>
                            <ul>
                                {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />)}
                            </ul>
                            <footer>
                                <p>{formatMoney(CalcTotalPrice(me.cart))}</p>
                                <UpdateButton>Checkout</UpdateButton>
                            </footer>
                        </CartStyles>
                    )}
                </Query>
            )}
        </Mutation>
      );
    }}
  </User>
);

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
