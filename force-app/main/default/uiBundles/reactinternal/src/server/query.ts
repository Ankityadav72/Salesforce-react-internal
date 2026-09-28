import { gql } from "@salesforce/platform-sdk";

export const ACCOUNTS_QUERY = gql`
  query Accounts($first: Int) {
    uiapi {
      query {
        Account(first: $first, orderBy: { Name: { order: ASC } }) {
          edges {
            node {
              Id
              Name { value }
              Industry { value }
              Phone { value }
            }
          }
        }
      }
    }
  }
`;

export const CONTACTS_QUERY = gql`
  query Contacts($first: Int) {
    uiapi {
      query {
        Contact(first: $first, orderBy: { LastName: { order: ASC } }) {
          edges {
            node {
              Id
              Name { value }
              Email { value }
              Account { Name { value } }
            }
          }
        }
      }
    }
  }
`;

export const OPPORTUNITIES_QUERY = gql`
  query Opportunities($first: Int) {
    uiapi {
      query {
        Opportunity(first: $first, orderBy: { CloseDate: { order: ASC } }) {
          edges {
            node {
              Id
              Name { value }
              StageName { value }
              Amount { value displayValue }
              CloseDate { value }
            }
          }
        }
      }
    }
  }
`;