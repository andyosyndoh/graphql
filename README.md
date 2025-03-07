# GraphQL Profile Page

## Objectives
The goal of this project is to learn and practice **GraphQL** by creating a personal profile page using data retrieved from the platform's GraphQL API.

- API Endpoint: [`https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql`](https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql)
- Authentication is required via **JWT (JSON Web Token)** obtained from the login endpoint.
- The profile page must display **at least three** user-selected pieces of information and include **two SVG-based statistical graphs**.

## Features
- **User Authentication**
  - Login using either `username:password` or `email:password`.
  - JWT-based authentication with **Bearer token** for GraphQL queries.
  - Display an appropriate error message for incorrect credentials.
  - Provide a **logout** option.
- **Profile Data Display**
  - Retrieve and display user information such as:
    - **Basic Identification (ID, login, etc.)**
    - **XP earned**
    - **Grades & skills**
    - **Audit details**
- **Graphical Data Visualization**
    - **XP Progress Over Time**
    - **Audit Ratio**
- **Hosting**
  - The project has been hosted on [`Railway`](https://graphql-production-a3fc.up.railway.app/)

## Setup Instructions
### 1. Clone the repository
```sh
  git https://learn.zone01kisumu.ke/git/aosindo/graphql.git
  cd graphql
```
Open Live Server

### 4. Open in Browser
Navigate to `http://localhost:port` or the hosted URL.

## GraphQL Query Examples
### Fetch User ID and Login
```graphql
{
  user {
    id
    login
  }
}
```

### Fetch XP Transactions
```graphql
{
  transaction(where: { type: { _eq: "xp" } }) {
    id
    amount
    createdAt
    path
  }
}
```

### Fetch Audit Data
```graphql
{
  audits(order_by: { createdAt: desc }, where: { closedAt: { _is_null: true } }) {
    closedAt
    closureType
    group {
      captain {
        canAccessPlatform
      }
      captainId
      captainLogin
      path
      createdAt
      updatedAt
      members {
        userId
        userLogin
      }
    }
  }
}
```

## Example Data Format
```json
{
  "data": {
    "transaction": [
      { "type": "xp", "amount": 500 },
      { "type": "xp", "amount": -300 },
      { "type": "xp", "amount": 200 }
    ]
  }
}
```

