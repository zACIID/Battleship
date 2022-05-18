# API Docs

## Table of Contents

- [API Docs](#api-docs)
  - [Table of Contents](#table-of-contents)
  - [TODO notification endpoints?](#todo-notification-endpoints)
  - [How API Authentication works](#how-api-authentication-works)
  - [Resources](#resources)
    - [Error](#error)
    - [LoginInfo](#logininfo)
    - [JWT](#jwt)
    - [RegistrationInfo](#registrationinfo)
    - [User](#user)
    - [UserStats](#userstats)
    - [Relationship](#relationship)
    - [Role](#role)
    - [MatchInfo](#matchinfo)
    - [Match](#match)
    - [MatchStats](#matchstats)
    - [Chat](#chat)
    - [Message](#message)
  - [Authentication Endpoints](#authentication-endpoints)
    - [User Login](#user-login)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body)
    - [User Registration](#user-registration)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-1)
  - [User Endpoints](#user-endpoints)
    - [Retrieve User Leaderboard](#retrieve-user-leaderboard)
      - [Query Parameters](#query-parameters)
      - [Example Response Body](#example-response-body-2)
    - [Retrieve User](#retrieve-user)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body-3)
    - [Update User](#update-user)
      - [Url Parameters](#url-parameters-1)
      - [Example Request Body](#example-request-body-2)
      - [Example Response Body](#example-response-body-4)
    - [Delete User](#delete-user)
      - [Url Parameters](#url-parameters-2)
      - [Example Response Body](#example-response-body-5)
    - [Retrieve User Stats](#retrieve-user-stats)
      - [Url Parameters](#url-parameters-3)
      - [Example Response Body](#example-response-body-6)
    - [Update User Stats](#update-user-stats)
      - [Url Parameters](#url-parameters-4)
      - [Example Request Body](#example-request-body-3)
      - [Example Response Body](#example-response-body-7)
  - [Relationship Endpoints](#relationship-endpoints)
    - [Retrieve User Relationships](#retrieve-user-relationships)
      - [Url Parameters](#url-parameters-5)
      - [Example Response Body](#example-response-body-8)
    - [Add User Relationship](#add-user-relationship)
      - [Url Parameters](#url-parameters-6)
      - [Example Request Body](#example-request-body-4)
      - [Example Response Body](#example-response-body-9)
    - [Remove User Relationship](#remove-user-relationship)
      - [Url Parameters](#url-parameters-7)
      - [Example Request Body](#example-request-body-5)
      - [Example Response Body](#example-response-body-10)
  - [Role Endpoints](#role-endpoints)
    - [Retrieve User Roles](#retrieve-user-roles)
      - [Url Parameters](#url-parameters-8)
      - [Example Response Body](#example-response-body-11)
    - [Add User Role](#add-user-role)
      - [Url Parameters](#url-parameters-9)
      - [Example Request Body](#example-request-body-6)
      - [Example Response Body](#example-response-body-12)
    - [Remove User Role](#remove-user-role)
      - [Url Parameters](#url-parameters-10)
      - [Example Request Body](#example-request-body-7)
      - [Example Response Body](#example-response-body-13)
  - [Match Endpoints](#match-endpoints)
    - [Create Match](#create-match)
      - [Example Request Body](#example-request-body-8)
      - [Example Response Body](#example-response-body-14)
    - [Retrieve Match](#retrieve-match)
      - [Url Parameters](#url-parameters-11)
      - [Example Response Body](#example-response-body-15)
    - [Delete Match](#delete-match)
      - [Url Parameters](#url-parameters-13)
      - [Example Response Body](#example-response-body-17)
    - [Update Match Stats](#update-match-stats)
      - [Url Parameters](#url-parameters-15)
      - [Example Request Body](#example-request-body-10)
      - [Example Response Body](#example-response-body-19)
  - [Chat Endpoints](#chat-endpoints)
    - [Create Chat (TODO è necessario?)](#create-chat-todo-è-necessario)
      - [Example Request Body](#example-request-body-11)
      - [Example Response Body](#example-response-body-20)
    - [Retrieve Chat](#retrieve-chat)
      - [Url Parameters](#url-parameters-16)
      - [Example Response Body](#example-response-body-21)
    - [Update Chat (TODO è necessario?)](#update-chat-todo-è-necessario)
      - [Url Parameters](#url-parameters-17)
      - [Example Request Body](#example-request-body-12)
      - [Example Response Body](#example-response-body-22)
    - [Delete Chat](#delete-chat)
      - [Url Parameters](#url-parameters-18)
      - [Example Response Body](#example-response-body-23)
    - [Retrieve Chat Messages](#retrieve-chat-messages)
      - [Url Parameters](#url-parameters-19)
      - [Example Response Body](#example-response-body-24)
    - [Add Message to Chat](#add-message-to-chat)
      - [Url Parameters](#url-parameters-20)
      - [Example Request Body](#example-request-body-13)
      - [Example Response Body](#example-response-body-25)
    - [Remove Message from Chat (TODO? lo supportiamo?)](#remove-message-from-chat-todo-lo-supportiamo)
      - [Url Parameters](#url-parameters-21)
      - [Example Request Body](#example-request-body-14)
      - [Example Response Body](#example-response-body-26)

## TODO notification endpoints?

notifications endpoints like user/:userId/notifications?

## How API Authentication works

define how authenticating for the API works: Basic Authentication, use of jwt and how to retrieve it, what error is returned if auth fails (401=?)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | time (in Unix seconds) that the error occurred at |
| requestPath | string | path of the request that lead to this error |
| errorMsg | string | error message |

### LoginInfo

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| username | string | username credential |
| password | string | password credential |

### JWT

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| token | string | Json Web Token used to authenticate future requests |

### RegistrationInfo

| Attribute | Data Type |
| :-------- | :-------- |
| username | string | username credential |
| password | string | password credential |
| email | string | e-mail address|
| roles | string[] | list of roles to assign to the user |

### User

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| userId | string | id of the user |
| username | string | username of the user |
| email | string | e-mail address of the user |
| roles | string[] | list of roles assigned to the user |

TODO capire se mettere anche notifications, relationships, stats

### UserStats

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| elo | number | elo of the user |
| topElo | number | highest elo reached by the user |
| wins | number | total number of victories of the user |
| losses | number | total number of losses of the user |
| shipsDestroyed | number | total number of ships destroyed by the user |
| totalShots | number | total number of shots of the user |
| totalHits | number | total number of hits by the user |

### Relationship

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| friendId | string | id of some friend user |
| chatId | string | id of the chat with the above friend |

### Role

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| role | string | Either "Base", "Moderator" or "Admin" |

### MatchInfo

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| player1 | string | id of player #1 of the match |
| player2 | string | id of player #2 of the match |

### Match

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| player1 | string | id of player #1 of the match |
| player2 | string | id of player #2 of the match |
| playerChat | [Chat](#chat) **TODO** oppure id? | TODO |
| observerChat | [Chat](#chat) **TODO** oppure id? | TODO |

### MatchStats
**TODO** ha senso questo oggetto (e i relativi endpoints) se quando finisce il match noi cancelliamo tutto? mi sembra un oggetto sensato solo se c'è la possibilità di mantenerlo, tipo con la cronologia match (che però non implementiamo)?

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| winner | string | id of player that won the match |
| startTime | number | time (in Unix seconds) that the match started at |
| endTime | number | time (in Unix seconds) that the match ended at |
| totalShots | number | total shots fired during the match |
| shipsDestroyed | number | number of ships destroyed during the match |

### Chat

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| users | string[] | ids of the users involved in the chat |
| messages | [Message](#message)[] | messages exchanged in the chat |

### Message

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| author | string | id of the user that sent this message |
| content | string | id of player #1 of the match |
| timestamp | string | id of player #2 of the match |

## Authentication Endpoints

### User Login

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /auth/signin | POST | User login |

#### Example Request Body

[LoginInfo](#logininfo) resource containing required login credentials

```json
{
    // TODO login con email o username?
    //  e se si usa username, a cosa serve email?
    "username": "username",
    "password": "password"
}
```

#### Example Response Body

##### Success

- Status Code: 200
- [JWT](#jwt) resource

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

##### Error

- Status Code: 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### User Registration

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /auth/signup | POST | Add a new user in the database using request body data |

#### Example Request Body

[RegistrationInfo](#registrationinfo) resource containing the information required to register to the system

```json
{
    "username": "",
    "password": "",
    "email": "",
    "roles": [],
    "online": true if it's a plain user registration, false if a moderator is creating another moderator
}
```

#### Example Response Body

##### Success

- Status Code: 201
- [User](#user)

```json
{
    "userId": "",
    "username": "",
    "email": "",
    "roles": [],
    "online": 

}
```

##### Error

- Status Code: 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

## User Endpoints

### Retrieve User Leaderboard

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /leaderboard | GET | Retrieve part of the leaderboard |

[Pagination in Mongoose](https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js).
**req.query*** is then used to retrieve the query parameters

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| limit | Integer | No | Number of users to be returned | 50 |limit <= 50 && limit >= 0 |
| page | Integer | No | Number indicating the page of results that has to be returned | 1 | page >= 1 |

#### Example Response Body

##### Success

Status Code: 200

```json
    "leaderboard": [
        {
            // Leaderboard records obj
            "userId": "",
            "username": "",
            "elo": 0
        },
        ...
    ],
    "nextPage": "url to the next page of results"
```

##### Error

- Status Code: 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Retrieve User

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId | GET | Retrieve the user with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to retrieve |

#### Example Response Body

##### Success

Status Code: 200

```json
{
    // User fields
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Update User

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId | PATCH | Update the match with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to update |

#### Example Request Body

Only the [User](#user) fields that need to be updated

```json
{
    "username": "new username",
    "password": "new password"
    // Other fields that do not need an update can be omitted
}
```

#### Example Response Body

##### Success

Status Code: 200

```json
{
    // All the updated fields
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Delete User  

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId | DELETE | Delete the user with the provided id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to delete |

#### Example Response Body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Retrieve User Stats

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/stats | GET | Retrieve the statistics of the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to retrieve the statistics of |

#### Example Response Body

##### Success

Status Code: 200

```json
{
    // User stat object
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Update User Stats

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/stats | PATCH | Update the statistics of the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to update the statistics of |

#### Example Request Body

Only the [UserStats](#userstats) fields that need to be updated

```json
{
    "elo": 2500,
    "hits": 4000,
    "shipsDestroyed": 120
    // Other fields that do not need an update can be omitted
}
```

#### Example Response Body

##### Success

Status Code: 200

```json
{
    // All the updated stats field
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

## Relationship Endpoints

### Retrieve User Relationships

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/relationships | GET | Retrieve the relationships of the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to retrieve the relationships of |

#### Example Response Body

##### Success

Status Code: 200

```json
{
    "relationships": [
        {
            "friendId": "",
            "chatId": "",
        }
        ...
    ]
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Add User Relationship

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/relationships | POST | Add a relationship to the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to add the relationship to |

#### Example Request Body

[Relationship](#relationship) resource representing the relationship to add

```json
{
    "friendId": "some-friend-id",
    "chatId": "some-chat-id"
}
```

#### Example Response Body

##### Success

Status Code: 201

```json
{
    // Created relationship obj
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Remove User Relationship

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/relationships | DELETE | Remove a social relationship from the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to remove the relationship from |

#### Example Request Body

[Relationship](#relationship) resource representing the relationship to remove

```json
{
    "friendId": "",
    "chatId": ""
}
```

#### Example Response Body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

## Role Endpoints

### Retrieve User Roles

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/roles | GET | Retrieve the roles of the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to retrieve the roles of |

#### Example Response Body

##### Success

Status Code: 200

```json
{
    "roles": [] // Base, Moderator, Admin
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Add User Role

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/roles | POST | Add a role to the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to add the role to |

#### Example Request Body

[Role](#role) resource representing the role to add

```json
{
    "role": "Moderator"
}
```

#### Example Response Body

##### Success

- Status Code: 201
- [Role](#role) resource representing the role that was just added

```json
{
    "role": "role that was added"
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Remove User Role

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/roles | DELETE | Remove a role from the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to remove the role from |

#### Example Request Body

[Role](#role) resource representing the role to be removed

```json
{
    "role": "Moderator"
}
```

#### Example Response Body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

## Match Endpoints

### Create Match

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches | POST | Create a new match |

#### Example Request Body

[MatchInfo](#matchinfo) containing the information about the match to create

```json
{
    "player1": "player1-id",
    "player2": "player2-id"
}
```

#### Example Response Body

##### Success

- Status Code: 201
- [Match](#match) resource representing the match that has just been created

```json
{
    "player1": "player1-id",
    "player2": "player2-id",
    "playerChat": "players-chat-id",
    "observersChat": "observers-chat-id"
}
```

##### Error

- Status Code: 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Retrieve Match

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches/:matchId | GET | Retrieve the match with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the match to retrieve |

#### Example Response Body

##### Success

Status Code: 200

```json
{
    // Match obj
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Delete Match  

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches/:matchId | DELETE | Delete the match with the provided id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| matchId | string | Id of the match to delete |

#### Example Response Body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Update Match Stats

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches/:matchId/stats | PATCH | Update the statistics of the specified match |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the match to update the statistics of |

#### Example Request Body

Only the [MatchStats](#matchstats) fields that need to be updated

```json
{
    "winner": "id of the winner",
    "totalShots": 16,
    "shipsDestroyed": 8
}
```

#### Example Response Body

##### Success

Status Code: 200

```json
{
    // The entire updated object -> useful to show the endgame results
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

## Chat Endpoints

### Create Chat (TODO è necessario?)

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats | POST | Create a new chat |

#### Example Request Body

```json
{
    // Chat info obj
}
```

#### Example Response Body

##### Success

Status Code: 201

```json
{
    // Chat obj
}
```

##### Error

- Status Code: 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Retrieve Chat

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId | GET | Retrieve the chat with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the chat to retrieve |

#### Example Response Body

##### Success

Status Code: 201

```json
{
    // Chat obj
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Update Chat (TODO è necessario?)

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId | PATCH | Update the chat with the specified id |

**TODO** Mi chiedo se sia necessario, perché noi abbiamo già endpoint POST e DELETE per aggiungere e deletare messaggi.

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the chat to update |

#### Example Request Body

```json
{
    // Chat fields that need to be updated
}
```

#### Example Response Body

##### Success

Status Code: 200

```json
{
    // All the updated fields
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Delete Chat  

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId | DELETE | Delete the chat with the provided id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the chat to delete |

#### Example Response Body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Retrieve Chat Messages

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId/messages  | GET | Retrieve the messages of the specified chat |

**TODO** some form of pagination since messages tend to accumulate fast?

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the chat to retrieve the messages of |

#### Example Response Body

##### Success

Status Code: 200

```json
{
    "messages": [
        {
            // Message obj
        }
        ...
    ]
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Add Message to Chat

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId/messages | POST | Add a message to the specified chat |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the chat to add the message to |

#### Example Request Body

[Message](#message) resource representing the message to add to the chat

```json
{
    // Message obj
}
```

#### Example Response Body

##### Success

Status Code: 201

```json
{
    // Created message obj
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Remove Message from Chat (TODO? lo supportiamo?)

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId/messages | DELETE | Remove a message from the specified chat |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the chat to remove the message from |

#### Example Request Body

[Message](#message) resource representing the message to delete from the chat

```json
{
    // Message obj to delete
}
```

#### Example Response Body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600, // Unix seconds timestamp
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```
