export const query = `
    query {
        user{
            id
            login
            transactions (where: { type: { _eq: "xp" } }){
                path
                type
                amount
                createdAt
                objectId
            }
            progresses {
                grade
                objectId
                path
            }
            results {
                id
                objectId
                userId
                grade
                type
                createdAt
                path
            }
            objects {
                name
                type
                attrs
                createdAt
            }
        }
    }
`