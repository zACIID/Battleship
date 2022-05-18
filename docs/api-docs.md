# API Docs

## Table of Contents

- [API Docs](#api-docs)
  - [Table of Contents](#table-of-contents)
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
    - [Notification](#notification)
    - [LeaderboardEntry](#leaderboardentry)
  - [Authentication Endpoints](#authentication-endpoints)
    - [User Login](#user-login)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body)
    - [User Registration](#user-registration)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-1)
  - [User Endpoints](#user-endpoints)
    - [Retrieve User](#retrieve-user)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body-2)
    - [Retrieve Multiple Users](#retrieve-multiple-users)
      - [Example Request Body](#example-request-body-2)
      - [Example Response Body](#example-response-body-3)
    - [Update User](#update-user)
      - [Url Parameters](#url-parameters-1)
      - [Example Request Body](#example-request-body-3)
      - [Example Response Body](#example-response-body-4)
    - [Delete User](#delete-user)
      - [Url Parameters](#url-parameters-2)
      - [Example Response Body](#example-response-body-5)
    - [Retrieve User Stats](#retrieve-user-stats)
      - [Url Parameters](#url-parameters-3)
      - [Example Response Body](#example-response-body-6)
    - [Update User Stats](#update-user-stats)
      - [Url Parameters](#url-parameters-4)
      - [Example Request Body](#example-request-body-4)
      - [Example Response Body](#example-response-body-7)
  - [Relationship Endpoints](#relationship-endpoints)
    - [Retrieve User Relationships](#retrieve-user-relationships)
      - [Url Parameters](#url-parameters-5)
      - [Example Response Body](#example-response-body-8)
    - [Add User Relationship](#add-user-relationship)
      - [Url Parameters](#url-parameters-6)
      - [Example Request Body](#example-request-body-5)
      - [Example Response Body](#example-response-body-9)
    - [Remove User Relationship](#remove-user-relationship)
      - [Url Parameters](#url-parameters-7)
      - [Example Request Body](#example-request-body-6)
      - [Example Response Body](#example-response-body-10)
  - [Role Endpoints](#role-endpoints)
    - [Retrieve User Roles](#retrieve-user-roles)
      - [Url Parameters](#url-parameters-8)
      - [Example Response Body](#example-response-body-11)
    - [Add User Role](#add-user-role)
      - [Url Parameters](#url-parameters-9)
      - [Example Request Body](#example-request-body-7)
      - [Example Response Body](#example-response-body-12)
    - [Remove User Role](#remove-user-role)
      - [Url Parameters](#url-parameters-10)
      - [Example Request Body](#example-request-body-8)
      - [Example Response Body](#example-response-body-13)
  - [Notification Endpoints](#notification-endpoints)
    - [Retrieve Notifications](#retrieve-notifications)
      - [Url Parameters](#url-parameters-11)
      - [Query Parameters](#query-parameters)
      - [Example Response Body](#example-response-body-14)
    - [Add Notification](#add-notification)
      - [Url Parameters](#url-parameters-12)
      - [Example Request Body](#example-request-body-9)
      - [Example Response Body](#example-response-body-15)
    - [Remove Notification](#remove-notification)
      - [Url Parameters](#url-parameters-13)
      - [Example Request Body](#example-request-body-10)
      - [Example Response Body](#example-response-body-16)
  - [Match Endpoints](#match-endpoints)
    - [Create Match](#create-match)
      - [Example Request Body](#example-request-body-11)
      - [Example Response Body](#example-response-body-17)
    - [Retrieve Match](#retrieve-match)
      - [Url Parameters](#url-parameters-14)
      - [Example Response Body](#example-response-body-18)
    - [Delete Match](#delete-match)
      - [Url Parameters](#url-parameters-15)
      - [Example Response Body](#example-response-body-19)
    - [Update Match Stats](#update-match-stats)
      - [Url Parameters](#url-parameters-16)
      - [Example Request Body](#example-request-body-12)
      - [Example Response Body](#example-response-body-20)
    - [Retrieve Chat](#retrieve-chat)
      - [Url Parameters](#url-parameters-17)
      - [Example Response Body](#example-response-body-21)
    - [Delete Chat](#delete-chat)
      - [Url Parameters](#url-parameters-18)
      - [Example Response Body](#example-response-body-22)
    - [Add User to Chat](#add-user-to-chat)
      - [Url Parameters](#url-parameters-19)
      - [Example Request Body](#example-request-body-13)
      - [Example Response Body](#example-response-body-23)
    - [Remove User from Chat](#remove-user-from-chat)
      - [Url Parameters](#url-parameters-20)
      - [Example Response Body](#example-response-body-24)
    - [Retrieve Chat Messages](#retrieve-chat-messages)
      - [Url Parameters](#url-parameters-21)
      - [Query Parameters](#query-parameters-1)
      - [Example Response Body](#example-response-body-25)
    - [Add Message to Chat](#add-message-to-chat)
      - [Url Parameters](#url-parameters-22)
      - [Example Request Body](#example-request-body-14)
      - [Example Response Body](#example-response-body-26)
  - [Leaderboard Endpoints](#leaderboard-endpoints)
    - [Retrieve Leaderboard](#retrieve-leaderboard)
      - [Query Parameters](#query-parameters-2)
      - [Example Response Body](#example-response-body-27)

## How API Authentication works

define how authenticating for the API works: Basic Authentication, use of jwt and how to retrieve it, what error is returned if auth fails (401=?)
TODO

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

### LoginInfo

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| username | string | Username credential |
| password | string | Password credential |

### JWT

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| token | string | Json Web Token used to authenticate future requests |

### RegistrationInfo

| Attribute | Data Type |
| :-------- | :-------- |
| username | string | Username credential |
| password | string | Password credential |
| roles | string[] | List of roles to assign to the user |
| online | boolean | Status of the user right after registration. True if a normal user is registering, because after that he is automatically redirected to the home page, false in other cases such as a moderator creating another moderator account. |

### User

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| userId | string | Id of the user |
| username | string | Username of the user |
| roles | string[] | List of roles assigned to the user |
| online | boolean | Status of the user |

### UserStats

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| elo | number | Elo of the user |
| topElo | number | Highest elo reached by the user |
| wins | number | Total number of victories of the user |
| losses | number | Total number of losses of the user |
| shipsDestroyed | number | Total number of ships destroyed by the user |
| totalShots | number | Total number of shots of the user |
| totalHits | number | Total number of hits by the user |

### Relationship

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| friendId | string | Id of some friend user |
| chatId | string | Id of the chat with the above friend |

### Role

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| role | string | Either "Base", "Moderator" or "Admin" |

### MatchInfo

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| player1 | string | Id of player #1 of the match |
| player2 | string | Id of player #2 of the match |

### Match

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| matchId | string | Id of the match |
| player1 | string | Id of player #1 of the match |
| player2 | string | Id of player #2 of the match |
| playersChat | string | Id of the players chat |
| observersChat | string | Id of the observers chat |
| stats | [MatchStats](#matchstats) | Stats of the match |

### MatchStats

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| winner | string | Id of player that won the match |
| startTime | number | Time (in Unix seconds) that the match started at |
| endTime | number | Time (in Unix seconds) that the match ended at |
| totalShots | number | Total shots fired during the match |
| shipsDestroyed | number | Number of ships destroyed during the match |

### Chat

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| chatId | string | Id of the chat |
| users | string[] | Ids of the users involved in the chat |
| messages | [Message](#message)[] | Messages exchanged in the chat |

### Message

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| author | string | Id of the user that sent this message |
| content | string | Content of the message |
| timestamp | number | Time (in Unix seconds) that the message was sent at |

### Notification

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| type | string | type of the notification |
| sender | string | Id of the user that generated the notification |

### LeaderboardEntry

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| userId | string | Id of the user that this leaderboard entry refers to |
| username | string | Name of the user that this leaderboard entry refers to |
| elo | number | Elo of the user that this leaderboard entry refers to |

## Authentication Endpoints

### User Login

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /auth/signin | POST | User login |

#### Example Request Body

[LoginInfo](#logininfo) resource containing required login credentials

```json
{
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
    "timestamp": 1651881600,
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
    "online": true
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
    "online": true
}
```

##### Error

- Status Code: 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

## User Endpoints

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

- Status Code: 200
- [User](#user) resource with the specified id

```json
{
    "userId": "user-id-1",
    "username": "username",
    "roles": [
        "Base", 
        "Moderator"
    ],
    "online": true
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Retrieve Multiple Users

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users | GET | Retrieve the user with the ids specified in the request body |

**TODO** se un id non è valido, si lancia un 404 o si ritornano solo gli user trovati? io dico 404

#### Example Request Body

Object representing the ids of the users to retrieve

```json
{
    "userIds": [
        "user-id-1",
        "user-id-2"
    ]
}
```

#### Example Response Body

##### Success

- Status Code: 200
- [User](#user) resource with the specified id

```json
{
    "users": [
        {
            "userId": "user-id-1",
            "username": "username1",
            "roles": [
                "Base", 
                "Moderator"
            ],
            "online": true
        },
        {
            "userId": "user-id-2",
            "username": "username2",
            "roles": [
                "Base", 
                "Moderator"
            ],
            "online": true
        },
        ...
    ]
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

Only the [User](#user) fields that need to be updated, except *userId*

```json
{
    "username": "new username",
    "password": "new password"
}
```

#### Example Response Body

##### Success

- Status Code: 200
- Only the [User](#user) fields that have been updated

```json
{
    "username": "new username",
    "password": "new password"
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 204
- Empty response

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 200
- [UserStats](#userstats) resource that refers to the specified user

```json
{
    "elo": 2500,
    "topElo": 3000,
    "wins": 189,
    "losses": 121,
    "shipsDestroyed": 1000,
    "totalShots": 12463,
    "totalHits": 6213
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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
}
```

#### Example Response Body

##### Success

- Status Code: 200
- Only the [UserStats](#userstats) fields that have been updated

```json
{
    "elo": 2500,
    "hits": 4000,
    "shipsDestroyed": 120
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 200
- Array of [Relationship](#relationship) resources referring to the specified user

```json
{
    "relationships": [
        {
            "friendId": "friend-id-1",
            "chatId": "chat-with-friend-id",
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
    "timestamp": 1651881600,
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
    "friendId": "friend-id-1",
    "chatId": "chat-with-friend-id"
}
```

#### Example Response Body

##### Success

- Status Code: 201
- The [Relationship](#relationship) resource that has just been created

```json
{
    "friendId": "friend-id-1",
    "chatId": "chat-with-friend-id"
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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
    "friendId": "friend-id-1",
    "chatId": "chat-with-friend-id"
}
```

#### Example Response Body

##### Success

- Status Code: 204
- Empty response

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 200
- Resource representing the roles of the specified user

```json
{
    "roles": []
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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
- [Role](#role) resource representing the role that has just been added

```json
{
    "role": "Moderator
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 204
- Empty response

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

## Notification Endpoints

### Retrieve Notifications

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/notifications | GET | Retrieve the notifications of the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to retrieve the notifications of |

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| limit | Integer | No | Maximum number of notifications to be returned | 100 | limit <= 500 && limit >= 0 |
| skip | Integer | No | Number of notifications to skip before starting to select users to send | 0 | skip >= 0 |

#### Example Response Body

##### Success

- Status Code: 200
- Array of [Notification](#notification) resources that were sent to the specified user, of maximum length *limit*

```json
{
    "notifications": [
        {
            "type": "FriendRequest",
            "sender": "sender-id"
        }
        ...
    ],
    "nextPage": "baseUrl/users/:userId/notifications?limit=500&skip=500"
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Add Notification

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/notifications | POST | Add a notification to the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to add the notification to |

#### Example Request Body

[Notification](#notification) resource representing the notification to add to the user

```json
{
    "type": "FriendRequest",
    "sender": "sender-id"
}
```

#### Example Response Body

##### Success

- Status Code: 201
- [Notification](#notification) resource that was just added to the user

```json
{
    "type": "FriendRequest",
    "sender": "sender-id"
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Remove Notification

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/notifications | DELETE | Remove the notification from the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to remove the notification from |

#### Example Request Body

[Notification](#notification) resource to remove from the user

```json
{
    "type": "FriendRequest",
    "sender": "sender-id"
}
```

#### Example Response Body

##### Success

- Status Code: 204
- Empty response

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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
    "matchId": "match-id",
    "player1": "player1-id",
    "player2": "player2-id",
    "playersChat": "players-chat-id",
    "observersChat": "observers-chat-id"
}
```

##### Error

- Status Code: 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 200
- [Match](#match) resource with the specified id

```json
{
    "matchId": "match-id",
    "player1": "player1-id",
    "player2": "player2-id",
    "playersChat": "players-chat-id",
    "observersChat": "observers-chat-id",
    "stats": {
        "winner": "winner-user-id",
        "startTime": 1651881600,
        "endTime": 1651881600,
        "shipsDestroyed": 5,
        "totalShots": 40
    }
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 204
- Empty response

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 200
- Only the [MatchStats](#matchstats) fields that have been updated

```json
{
    "winner": "id of the winner",
    "totalShots": 16,
    "shipsDestroyed": 8
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 201
- [Chat](#chat) resource with the specified id

```json
{
    "chatId": "chat-id",
    "users": [
        "user-id-1", "user-id-2"
    ],
    "messages": [
        {
            "author": "author-user-id",
            "timestamp": 1651881600,
            "content": "message"
        },
        ...
    ]
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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

- Status Code: 204
- Empty response

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Add User to Chat

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId/users | POST | Add the user with the provided id (in the request body) to the specified chat |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the user to add to the chat |

#### Example Request Body

Resource representing the id of the user to add to the chat

```json
{
    "userId": "user-id-1"
}
```

#### Example Response Body

##### Success

- Status Code: 200
- Resource representing the id of the user that was just added

```json
{
    "userId": "user-id-1"
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Remove User from Chat

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId/users/:userId | DELETE | Remove the user with the specified id from the specified chat |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the chat to remove the user from |
| userId | string | Id of the user to remove from the chat |

#### Example Response Body

##### Success

- Status Code: 204
- Empty response

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Retrieve Chat Messages

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /chats/:chatId/messages | GET | Retrieve the messages of the specified chat |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| chatId | string | Id of the chat to retrieve the messages of |

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| limit | Integer | No | Maximum number of messages to be returned | 100 | limit <= 500 && limit >= 0 |
| skip | Integer | No | Number of users to skip before starting to select users to send | 0 | skip >= 0 |

#### Example Response Body

##### Success

- Status Code: 200
- Array of [Message](#message) resources that were sent in the specified chat, of maximum length *limit*

```json
{
    "messages": [
        {
            "author": "author-user-id",
            "content": "message",
            "timestamp": 1651881600
        }
        ...
    ],
    "nextPage": "baseUrl/chats/:chatId/messages?limit=100&skip=100"
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
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
    "author": "author-user-id",
    "content": "message",
    "timestamp": 1651881600
}
```

#### Example Response Body

##### Success

- Status Code: 201
- [Message](#message) resource that was just added to the chat

```json
{
    "author": "author-user-id",
    "content": "message",
    "timestamp": 1651881600
}
```

##### Error

- Status Codes: 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

## Leaderboard Endpoints

### Retrieve Leaderboard

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /leaderboard | GET | Retrieve part of the leaderboard, which is ordered by elo |

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| limit | Integer | No | Maximum number of users to be returned | 50 | limit <= 50 && limit >= 0 |
| skip | Integer | No | Number of users to skip before starting to select users to send | 0 | skip >= 0 |

#### Example Response Body

##### Success

- Status Code: 200
- Array of [LeaderboardEntry](#leaderboardentry) resources, of maximum length *limit*

```json
    "leaderboard": [
        {
            "userId": "",
            "username": "",
            "elo": 0
        },
        ...
    ],
    "nextPage": "baseUrl/leaderboard?limit=50&skip=50"
```

##### Error

- Status Code: 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```
