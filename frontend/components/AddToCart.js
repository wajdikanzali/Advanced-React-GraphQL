import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
    mutation addToCart($id: ID!) {
        addToCart(id: $id) {
            id
        }
    }
`;

class AddToCart extends Component {
    // update = (apolloCache, payload) => {
    //     const { item } = this.props;
	// 	console.log('TCL: AddToCart -> update -> item', item)
    //     const data = apolloCache.readQuery({ query: CURRENT_USER_QUERY });
    //     const itemToAdd = {
    //         id: item.id,
    //         item,
    //         quantity: 1,
    //         __typename: "CartItem"
    //     }
    //       data.me.cart.push(itemToAdd);
    //       apolloCache.writeQuery({ query: CURRENT_USER_QUERY, data})
    // }

    render() {
        const { item } = this.props;
        return (
        <Mutation
          mutation={ADD_TO_CART_MUTATION}
          variables={{ id: item.id }}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        //   update={this.update}
        //   optimisticResponse={{
        //     __typename: 'Mutation',
        //     addToCart: {
        //         __typename: 'CartItem',
        //         id: item.id,
        //     },
        // }}
        >
          {(addToCart, {loading}) => <button disabled={loading} onClick={addToCart}>Add{loading && 'ing'} To Cart</button>}
        </Mutation>
        )
    }
}

export default AddToCart;
