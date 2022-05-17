# API Docs

## Table of Contents

- [API Docs](#api-docs)
  - [Table of Contents](#table-of-contents)
  - [How API Authentication works](#how-api-authentication-works)
  - [Model](#model)
    - [UserInfo](#userinfo)
    - [User](#user)
    - [UserStats](#userstats)
  - [Authentication Endpoints](#authentication-endpoints)
    - [User Login](#user-login)
      - [Request body](#request-body)
      - [Response body](#response-body)
    - [User Registration](#user-registration)
      - [Request body](#request-body-1)
      - [Response body](#response-body-1)
  - [User Endpoints](#user-endpoints)
    - [Retrieve User Leaderboard](#retrieve-user-leaderboard)
      - [Query Parameters](#query-parameters)
      - [Response body](#response-body-2)
    - [Retrieve User](#retrieve-user)
      - [Url Parameters](#url-parameters)
      - [Response body](#response-body-3)
    - [Update User](#update-user)
      - [Url Parameters](#url-parameters-1)
      - [Request body](#request-body-2)
      - [Response body](#response-body-4)
    - [Delete User](#delete-user)
      - [Url Parameters](#url-parameters-2)
      - [Response body](#response-body-5)
    - [Retrieve User Stats](#retrieve-user-stats)
      - [Url Parameters](#url-parameters-3)
      - [Response body](#response-body-6)
    - [Update User Stats](#update-user-stats)
      - [Url Parameters](#url-parameters-4)
      - [Request body](#request-body-3)
      - [Response body](#response-body-7)
  - [Relationship Endpoints](#relationship-endpoints)
    - [Retrieve User Relationships](#retrieve-user-relationships)
      - [Url Parameters](#url-parameters-5)
      - [Response body](#response-body-8)
    - [Add User Relationship](#add-user-relationship)
      - [Url Parameters](#url-parameters-6)
      - [Request body](#request-body-4)
      - [Response body](#response-body-9)
    - [Remove User Relationship](#remove-user-relationship)
      - [Url Parameters](#url-parameters-7)
      - [Request body](#request-body-5)
      - [Response body](#response-body-10)
  - [Role Endpoints](#role-endpoints)
    - [Retrieve User Roles](#retrieve-user-roles)
      - [Url Parameters](#url-parameters-8)
      - [Response body](#response-body-11)
    - [Add User Role](#add-user-role)
      - [Url Parameters](#url-parameters-9)
      - [Request body](#request-body-6)
      - [Response body](#response-body-12)
    - [Remove User Role](#remove-user-role)
      - [Url Parameters](#url-parameters-10)
      - [Request body](#request-body-7)
      - [Response body](#response-body-13)
  - [Match Endpoints](#match-endpoints)
    - [Create Match](#create-match)
      - [Request body](#request-body-8)
      - [Response body](#response-body-14)
    - [Retrieve Match](#retrieve-match)
      - [Url Parameters](#url-parameters-11)
      - [Response body](#response-body-15)
    - [Update Match](#update-match)
      - [Url Parameters](#url-parameters-12)
      - [Request body](#request-body-9)
      - [Response body](#response-body-16)
    - [Delete Match](#delete-match)
      - [Url Parameters](#url-parameters-13)
      - [Response body](#response-body-17)
    - [Retrieve Match Stats](#retrieve-match-stats)
      - [Url Parameters](#url-parameters-14)
      - [Response body](#response-body-18)
    - [Update Match Stats](#update-match-stats)
      - [Url Parameters](#url-parameters-15)
      - [Request body](#request-body-10)
      - [Response body](#response-body-19)
  - [Chat Endpoints](#chat-endpoints)
    - [Create Chat (TODO è necessario?)](#create-chat-todo-è-necessario)
      - [Request body](#request-body-11)
      - [Response body](#response-body-20)
    - [Retrieve Chat](#retrieve-chat)
      - [Url Parameters](#url-parameters-16)
      - [Response body](#response-body-21)
    - [Update Chat (TODO è necessario?)](#update-chat-todo-è-necessario)
      - [Url Parameters](#url-parameters-17)
      - [Request body](#request-body-12)
      - [Response body](#response-body-22)
    - [Delete Chat](#delete-chat)
      - [Url Parameters](#url-parameters-18)
      - [Response body](#response-body-23)
    - [Retrieve Chat Messages](#retrieve-chat-messages)
      - [Url Parameters](#url-parameters-19)
      - [Response body](#response-body-24)
    - [Add Message to Chat](#add-message-to-chat)
      - [Url Parameters](#url-parameters-20)
      - [Request body](#request-body-13)
      - [Response body](#response-body-25)
    - [Remove Message from Chat (TODO? lo supportiamo?)](#remove-message-from-chat-todo-lo-supportiamo)
      - [Url Parameters](#url-parameters-21)
      - [Request body](#request-body-14)
      - [Response body](#response-body-26)

## How API Authentication works

define how authenticating for the API works: Basic Authentication, use of jwt and how to retrieve it, what error is returned if auth fails (401=?)

## Model

### UserInfo

```json
{
    "username": "",
    "email": "",
    "roles": [],
    "password": ""
}
// Rest of the fields are defaults, so they are not to be provided
```

### User

```json
{
    "username": "",
    "email": "",
    "roles": [],
    "password": ""
}
// Rest of the fields are defaults, so they are not to be provided
```

### UserStats

```json
{
    "top_elo": 0,
    "elo": 0,
    "wins": 0,
    "losses": 0,
    "ships_destroyed": 0,
    "total_shots": 0,
    "hits": 0
}
```


## Authentication Endpoints

### User Login

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /auth/signin | POST | User login |

#### Request body

```json
{
    "email": "",
    "password": ""
}
```

#### Response body

##### Success

Status Code: 200

```json
{
    "token": "json web token"
}
```

##### Error

Status Code: 500

```json
{
    "errorMessage": ""
}
```

### User Registration

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /auth/signup | POST | Add a new user in the database using request body data |

#### Request body

```json
{
    "username": "",
    "email": "",
    "roles": [],
    "password": ""
}
// Rest of the fields are defaults, so they are not to be provided
```

#### Response body

##### Success

Status Code: 201

```json
{
    "userId": ""
    "email": "",
    "roles": [],
    "password": "",

}
```

##### Error

Status Code: 500

```json
{
    "errorMessage": ""
}
```

## User Endpoints

### Retrieve User Leaderboard

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /leaderboard | GET | Retrieve part of the leaderboard |

[Pagination in Mongoose](https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js). </br>
*req.query* is then used to retrieve the query parameters

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| limit | Integer | No | Number of users to be returned | 50 |limit <= 50 && limit >= 0 |
| page | Integer | No | Number indicating the page of results that has to be returned | 1 | page >= 1 |

#### Response body

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

Status Code: 500

```json
{
    "error": true,
    "errorMessage": ""
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

#### Response body

##### Success

Status Code: 200

```json
{
    // User fields
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
{
    // User fields that need to be updated
}
```

#### Response body

##### Success

Status Code: 200

```json
{
    // All the updated fields
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Response body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Response body

##### Success

Status Code: 200

```json
{
    // User stat object
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
{
    // field of the stats object that need to be updated
}
```

#### Response body

##### Success

Status Code: 200

```json
{
    // All the updated stats field
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Response body

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

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
// Relationship obj
{
    "friendId": "",
    "chatId": ""
}
```

#### Response body

##### Success

Status Code: 201

```json
{
    // Created relationship obj
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
// Relationship obj to delete
{
    "friendId": "",
    "chatId": ""
}
```

#### Response body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Response body

##### Success

Status Code: 200

```json
{
    "roles": [] // Base, Moderator, Admin
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
{
    "role": "role to add" // either Base, Moderator, Admin
}
```

#### Response body

##### Success

Status Code: 201

```json
{
    "role": "role that was added"
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
{
    "role": "role to remove" // either Base, Moderator, Admin
}
```

#### Response body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
}
```

## Match Endpoints

### Create Match

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches | POST | Create a new match |

#### Request body

```json
{
    // Match info obj
}
```

#### Response body

##### Success

Status Code: 201

```json
{
    // Match obj
}
```

##### Error

Status Code: 500

```json
{
    "errorMessage": ""
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

#### Response body

##### Success

Status Code: 200

```json
{
    // Match obj
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
}
```

### Update Match

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches/:matchId | PATCH | Update the match with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| matchId | string | Id of the match to update |

#### Request body

```json
{
    // Match fields that need to be updated
}
```

#### Response body

##### Success

Status Code: 200

```json
{
    // All the updated fields
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Response body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
}
```

### Retrieve Match Stats

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches/:matchId/stats | GET | Retrieve the statistics of the specified match |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| matchId | string | Id of the match to retrieve the statistics of |

#### Response body

##### Success

Status Code: 200

```json
{
    // Match stat object
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
{
    // field of the stats object that need to be updated
}
```

#### Response body

##### Success

Status Code: 200

```json
{
    // All the updated stats field
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
}
```

## Chat Endpoints

### Create Chat (TODO è necessario?)

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats | POST | Create a new chat |

#### Request body

```json
{
    // Chat info obj
}
```

#### Response body

##### Success

Status Code: 201

```json
{
    // Chat obj
}
```

##### Error

Status Code: 500

```json
{
    "errorMessage": ""
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

#### Response body

##### Success

Status Code: 201

```json
{
    // Chat obj
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
{
    // Chat fields that need to be updated
}
```

#### Response body

##### Success

Status Code: 200

```json
{
    // All the updated fields
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Response body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Response body

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

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
{
    // Message obj
}
```

#### Response body

##### Success

Status Code: 201

```json
{
    // Created message obj
}
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
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

#### Request body

```json
{
    // Message obj to delete
}
```

#### Response body

##### Success

Status Code: 204

```json
// empty response
```

##### Error

Status Codes: 404, 500

```json
{
    "errorMessage": ""
}
```
