import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    usersConnection {
      aggregate {
        count
      }
    }
  }
`;

const PaginationsUsers = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      const count = data.usersConnection.aggregate.count;
      const pages = Math.ceil(count / perPage);
      const page = props.page;
      return (
        <PaginationStyles data-test="pagination">
          <Head>
            <title>
              adidas! — Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'permissions',
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ← Prev
            </a>
          </Link>
          <p>
            Page {props.page} of
            <span className="totalPages">{pages}</span>!
          </p>
          <p>{count} Users Total</p>
          <Link
            prefetch
            href={{
              pathname: 'permissions',
              query: { page: page + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default PaginationsUsers;
export { PAGINATION_QUERY };
