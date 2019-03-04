import React from 'react';
import CartStyles from './styles/CartStyles';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import UpdateButton from './styles/UpdateButton';

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
    <Mutation mutation={TOGGLE_CART_MUTATION}>
        {toggleCart => (
            <Query query={LOCAL_STATE_QUERY}>
                {({ data }) => (
                    <CartStyles open={data.cartOpen}>
                        <header>
                            <CloseButton onClick={toggleCart} title="close">
                                &times;
                            </CloseButton>
                            <Supreme>Your Cart</Supreme>
                            <p>
                                You Have in your cart.
                            </p>
                        </header>
                        <footer>
                            <p>pppp</p>
                            <UpdateButton>Checkout</UpdateButton>
                        </footer>
                    </CartStyles>
                )}
            </Query>
        )}
    </Mutation>
);

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
