# API Docs

## Table of Contents

- [API Docs](#api-docs)
  - [Table of Contents](#table-of-contents)
  - [Notes](#notes)
  - [How Authentication works](#how-authentication-works)
  - [Endpoints](#endpoints)
    - [User Login](#user-login)
      - [Request body](#request-body)
      - [Response body](#response-body)
        - [Success](#success)
        - [Error](#error)
    - [User Registration](#user-registration)
      - [Request body](#request-body-1)
      - [Response body](#response-body-1)
        - [Success](#success-1)
        - [Error](#error-1)
    - [Retrieve All Users](#retrieve-all-users)
      - [Query Parameters](#query-parameters)
      - [Response body](#response-body-2)
        - [Success](#success-2)
        - [Error](#error-2)
    - [Retrieve Single User](#retrieve-single-user)
      - [Url Parameters](#url-parameters)
      - [Response body](#response-body-3)
        - [Success](#success-3)
        - [Error](#error-3)
    - [Update User](#update-user)
      - [Url Parameters](#url-parameters-1)
      - [Request body](#request-body-2)
      - [Response body](#response-body-4)
        - [Success](#success-4)
        - [Error](#error-4)
    - [Delete User](#delete-user)
      - [Url Parameters](#url-parameters-2)
      - [Response body](#response-body-5)
        - [Success](#success-5)
        - [Error](#error-5)
    - [Retrieve User Stats](#retrieve-user-stats)
      - [Url Parameters](#url-parameters-3)
      - [Response body](#response-body-6)
        - [Success](#success-6)
        - [Error](#error-6)
    - [Update User Stats](#update-user-stats)
      - [Url Parameters](#url-parameters-4)
      - [Request body](#request-body-3)
      - [Response body](#response-body-7)
        - [Success](#success-7)
        - [Error](#error-7)
    - [Retrieve User Chats (TODO)](#retrieve-user-chats-todo)
      - [Url Parameters](#url-parameters-5)
      - [Response body](#response-body-8)
        - [Success](#success-8)
        - [Error](#error-8)
    - [Update User Chats (TODO)](#update-user-chats-todo)
      - [Url Parameters](#url-parameters-6)
      - [Request body](#request-body-4)
      - [Response body](#response-body-9)
        - [Success](#success-9)
        - [Error](#error-9)
    - [Retrieve User Friends (TODO)](#retrieve-user-friends-todo)
      - [Url Parameters](#url-parameters-7)
      - [Response body](#response-body-10)
        - [Success](#success-10)
        - [Error](#error-10)
    - [Update User Friends (TODO)](#update-user-friends-todo)
      - [Url Parameters](#url-parameters-8)
      - [Request body](#request-body-5)
      - [Response body](#response-body-11)
        - [Success](#success-11)
        - [Error](#error-11)

## Notes

[To return something with POST, PUT, PATCH?](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#useful-post-responses)

## How Authentication works

define how authenticating for the API works: Basic Authentication, use of jwt and how to retrieve it, what error is returned if auth fails (401=?)

## Endpoints

### User Login

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /auth/signin | POST | User login |

#### Request body

```json
{
    "Authorization": "xxx" // TODO check header?
}
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

Status Code: **TODO** ??

```jsonI
{

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

    // This is "Base" if a normal registration is happening,
    // "Base", "Moderator" if a mod is creating another mod
    "roles": [],
    "password": ""

    // The rest of user fields are default
}
```

#### Response body

##### Success

Status Code: 201

```json
{
    "username": ""
    // TODO ritorna tutto l'oggetto?
}
```

##### Error

Status Code: **TODO** ??

```json
{
    "error": true,
    "errorMessage": ""
}
```

### Retrieve All Users

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users | GET | Retrieve all the users in the database |

[Pagination in Mongoose](https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js). </br>
req.query is then used to retrieve the query parameters

**TODO** Originale:
Returns a list of all the users, better if ordered by elo desc (useful for showing the scoreboard). Magari un endpoint un po' rischioso da fare in generale, meglio un endpoint+modello Leaderboard per esporre meno informazioni? </br>

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| limit | Integer | No | Number of users to be returned | 50 |limit <= 50 && limit >= 0 |
| page | Integer | No | Number indicating the page of results that has to be returned | 1 | page >= 1 |

#### Response body

##### Success

Status Code: 200

```json
    "users": [
        {
            // User fields
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

### Retrieve Single User

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
    "error": true,
    "errorMessage": ""
}
```

### Update User

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId | PATCH | Update a particular user with request body data |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to update |

#### Request body

```json
{
    // Only the user fields that need to be updated
    // TODO no email, password, username?
    //  come fare per stats visto che c'è anche l'endpoint apposito? 
    //  si accetta?
}
```

#### Response body

##### Success

Status Code: 200

```json
{
    // TODO ritorna i campi modificati?
}
```

##### Error

Status Codes: 404, 500

```json
{
    "error": true,
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

##### Error

Status Codes: 404, 500

```json
{
    "error": true,
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
    "error": true,
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
| userId | string | Id of the user to retrieve the statistics of |

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
    // TODO only fields that were updated?
}
```

##### Error

Status Codes: 404, 500

```json
{
    "error": true,
    "errorMessage": ""
}
```

### Retrieve User Chats (TODO)

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/chats | GET | Retrieve all the chats that the specified user is involved in |

Cosa ritorna? chat ids oppure chat intere?

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to retrieve the chats of |

#### Response body

##### Success

Status Code: 200

```json
{
    "chats": [
        {
            // Chat object
        }
        ...
    ]
}
```

##### Error

Status Codes: 404, 500

```json
{
    "error": true,
    "errorMessage": ""
}
```

### Update User Chats (TODO)

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/chats | PATCH | Update the chats for the specified user |

Come funziona questo?

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to update the chats of |

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
    // TODO only fields that were updated?
}
```

##### Error

Status Codes: 404, 500

```json
{
    "error": true,
    "errorMessage": ""
}
```

### Retrieve User Friends (TODO)

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/friends | GET | Retrieve all the friends of the specified user |

Cosa ritorna? friend ids oppure lista di users?

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to retrieve the friends of |

#### Response body

##### Success

Status Code: 200

```json
{
    "friends": [
        {
            // TODO user object ??
        }
        ...
    ]
}
```

##### Error

Status Codes: 404, 500

```json
{
    "error": true,
    "errorMessage": ""
}
```

### Update User Friends (TODO)

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/chats | PATCH | Update the friends list of the specified user |

Come funziona questo?

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to updated the friends list of |

#### Request body

```json
{
    // TODO ??
}
```

#### Response body

##### Success

Status Code: 200

```json
{
    // TODO only fields that were updated?
}
```

##### Error

Status Codes: 404, 500

```json
{
    "error": true,
    "errorMessage": ""
}
```








/users/:userId/roles                    GET
/users/:userId/roles                    PATCH



/matches                        C       POST        Create a new match
/matches/:matchId               R       GET         Return the match identified by matchId
/matches/:matchId               U       PATCH       Update information about a particular match
/matches/:matchId               D       DELETE      Delete the match identified by matchId

/matches/:matchId/stats                 GET
/matches/:matchId/stats                 PATCH


/chats                          C      POST       Create a new chat
/chats/:chatId                  R      GET        Return the chat identified by chatId
/chats/:chatId                  U      PATCH      Update the chat identified by chatId
/chats/:chatId                  D      DELETE     Delete a chat by ID

/chats/:chatId/messages                GET        
/chats/:chatId/messages                PATCH      


