// export const query = `
//     query {
//         user{
//             id
//             login
//             transactions{
//                 id
//                 path
//                 type
//                 amount
//                 createdAt
//                 objectId
//             }
//             progresses {
//                 grade
//                 objectId
//                 path
//             }
//             results {
//                 id
//                 objectId
//                 userId
//                 grade
//                 type
//                 createdAt
//                 path
//             }
//             objects {
//                 name
//                 type
//                 attrs
//                 createdAt
//             }
//         }
//     }
// `

export const query = `
    query {
        user {
            id
            login
            attrs
            auditRatio
            skills: transactions(order_by: [{type: desc}, {amount: desc}] distinct_on: [type] where: {type: {_like: "skill_%"}}) {
                type
                amount
            }
            audits {
                group {
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
        event(where: {path: {_nlike: "%checkpoint%"}}) {
            path
            id
        }
        transaction(where: {_and: [{type: {_eq: "xp"}},{eventId:{_eq: 75}}]},order_by: { createdAt: desc }) {
            amount
            createdAt
            eventId
            path
            type
            userId
        }
    }
`