import React, { Component } from "react";
import { Query, Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Table from './styles/Table';
import Form from './styles/Form';
import UpdateButton from './styles/UpdateButton';
import PropTypes from 'prop-types';

const Columns = styled.div`
  padding: 5px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>
      return (
        <div>
          <Error error={error} />
          <div>
            <h2>Manage Permissions</h2>
            {data.users.map(user => <UserPermissions user={user} key={user.id} />)}
          </div>
        </div>)
    }}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };
  state = {
    permissions: this.props.user.permissions,
  };
  handlePermissionChange = (e) => {
    const checkbox = e.target;
    let updatedPermissions = [...this.state.permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
    }
    this.setState({ permissions: updatedPermissions });
  };
  render() {
    const { user } = this.props;
    return (
      <Columns>
        <Form>
          <fieldset>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <Mutation
                  mutation={UPDATE_PERMISSIONS_MUTATION}
                  variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id,
                  }}
                >
                  {(updatePermissions, { loading, error }) => (
                    <>
                      {error && <tr><td colspan="8"><Error error={error} /></td></tr>}
                      < tr >
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        {possiblePermissions.map(permission => (
                          <td key={`${permission.id}-permission-${permission}`}>
                            <label htlmfor={`${permission.id}-permission-${permission}`}>
                              <input
                                id={`${user.id}-permission-${permission}`}
                                type="checkbox"
                                checked={this.state.permissions.includes(permission)}
                                value={permission}
                                onChange={this.handlePermissionChange}
                              />
                            </label>
                          </td>
                        ))}
                        <td>
                          <UpdateButton type="button" disabled={loading} onClick={updatePermissions}>
                            Updat{loading ? 'ing' : 'e'}
                          </UpdateButton>
                        </td>
                      </tr>
                    </>
                  )
                  }
                </Mutation>
              </tbody>
            </Table>
          </fieldset>
        </Form>
      </Columns>


    )
  }
}

// class User extends React.Component {
//   render() {
//     const action = {
//       columns: [
//         {
//           Header: 'ACTION',
//           width: 75,
//           Cell: ({ original }) => {
//             return (
//               <div>
//                 {
//                   <button
//                     className="pencil"
//                     title="Update"
//                   />
//                 }
//               </div>
//             );
//           },
//         },
//       ],
//     };
//     const permessions = (this.props.possiblePermissions).map(permission => ({
//       Header: permission,
//       width: 80,
//       Cell: ({ original }) => {
//         return (
//           <div>
//             {
//               <label htlmfor={`${original.id}-permission-${permission}`}>
//                 <input
//                   id={`${original.id}-permission-${permission}`}
//                   type='checkbox'
//                   // checked={this.state.selected[`${original.id}-permission-${permission}`] === true}
//                   checked={original.permissions.includes(permission)}
//                   value={permission}
//                   onChange={() => this.handlePermissionChange(`${original.id}-permission-${permission}`)}
//                 />
//               </label>
//             }
//           </div>
//         );
//       },
//     }))
//     const columns = [
//       {
//         Header: 'Name',
//         accessor: 'name'
//       },
//       {
//         Header: 'Email',
//         accessor: 'email',
//         width: 250,
//       },
//       ...permessions,
//       action
//     ];

//     return (
//       <UsersWrapper>
//         <ReactTable
//           columns={columns}
//           data={this.props.users}
//         >
//         </ReactTable>
//       </UsersWrapper>
//     )
//   }
// }

export default Permissions;
