import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import UpdateButton from './styles/UpdateButton';

const Cart = () => (
        <CartStyles open>
          <header>
            <CloseButton title="close">
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
);

export default Cart;
