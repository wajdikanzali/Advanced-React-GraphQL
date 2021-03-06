import React, { Component } from 'react';
import Form from './styles/Form';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
    state = {
        email: '',
        name: '',
        password: '',
    };
    saveToState = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <Mutation 
                mutation={SIGNUP_MUTATION} 
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signup, { error, loading }) => (
                    <Form 
                        methode="post" 
                        onSubmit={ async e => {
                        e.preventDefault();
                        await signup();
                        this.setState({ email: '', name: '', password: '' })
                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Singup For An Account</h2>
                            <Error error={error} />
                            <label htmlFor="email">
                                Email
                        <input
                                    type="email"
                                    name="email"
                                    placeholder="email"
                                    value={this.state.email} onChange={this.saveToState}
                                />
                            </label>
                            <label htmlFor="name">
                                Name
                        <input
                                    type="text"
                                    name="name"
                                    placeholder="name"
                                    value={this.state.name}
                                    onChange={this.saveToState}
                                />
                            </label>
                            <label htmlFor="password">
                                Password
                        <input
                                    type="password"
                                    name="password"
                                    placeholder="password"
                                    value={this.state.password} onChange={this.saveToState}
                                />
                            </label>
                            <button type="submit">sign Up!</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}

export default Signup;
