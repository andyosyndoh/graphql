# GraphQL Profile Page

## Objectives

The project fetches user data from [Zone 01 kisumu](https://learn.zone01kisumu.ke) and displays user data in a nice format.

- API Endpoint: [`https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql`](https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql)
- Authentication is required via **JWT (JSON Web Token)** obtained from the login [endpoint](https://learn.zone01kisumu.ke/api/auth/signin).

## Features

- **User Authentication**
  - Login using either `username:password` or `email:password`.
  - JWT-based authentication with **Bearer token** for GraphQL queries.
- **Profile Data Display**
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

### Fetch Skills

```graphql
{
  skills: transactions(
    where: { type: { _like: "skill_%" } }
    order_by: [{ amount: desc }]
  ) {
    type
    amount
  }
}
```

### Fetch XP Transactions

```graphql
{
  transaction(
    where: { _and: [{ eventId: { _eq: 75 } }] }
    order_by: { createdAt: desc }
  ) {
    amount
    createdAt
    eventId
    path
    type
    userId
  }
}
```

### Fetch Audit Data

```graphql
{
  audits(
    order_by: { createdAt: desc }
    where: {
      closedAt: { _is_null: true }
      group: { captain: { canAccessPlatform: { _eq: true } } }
    }
  ) {
    closedAt
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
    private {
      code
    }
  }
}
```

### Fetch level

```graphql
{
  events(where: { eventId: { _eq: 75 } }) {
    level
  }
}
```

### Fetch Grades

```graphql
{
  progress(
    where: { _and: [{ grade: { _is_null: false } }, { eventId: { _eq: 75 } }] }
    order_by: { createdAt: desc }
  ) {
    id
    createdAt
    eventId
    grade
    path
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
