import React, { Component } from "react";
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import UsersWrapper from './styles/UsersWrapper';
import SickButton from './styles/SickButton';
import { Logo, Tips } from "./styles/Utils";

import ReactTable from 'react-table';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMESSIONUPDATE',
];

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
            <User users={data.users} possiblePermissions={possiblePermissions} />
          </div>
        </div>)
    }}
  </Query>
);

class User extends React.Component {
  render() {
    const action = {
      columns: [
        {
          Header: 'ACTION',
          width: 75,
          Cell: ({ original }) => {
            return (
              <div>
                {
                  <button
                    onClick={() => { this.openVideos(original); }}
                    className="pencil"
                    title="Update"
                  />
                }
              </div>
            );
          },
        },
      ],
    };
    const permessions = (this.props.possiblePermissions).map(permission => ({
      Header: permission,
      width: 80,
      Cell: ({ original }) => {
        return (
          <div>
            {
              <label htlmfor={`${original.id}-permission-${permission}`}>
                <input type='checkbox' />
              </label>
            }
          </div>
        );
      },
    }))
    const columns = [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Email',
        accessor: 'email',
        width: 250,
      },
      ...permessions,
      action
    ];

    return (
      <UsersWrapper>
        <ReactTable
          columns={columns}
          data={this.props.users}
        >
        </ReactTable>
      </UsersWrapper>
    )
  }
}

export default Permissions;
