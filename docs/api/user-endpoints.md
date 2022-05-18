# User Endpoints Documentation

## Table of Contents

- [User Endpoints Documentation](#user-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [User](#user)
    - [UserStats](#userstats)
  - [Endpoints](#endpoints)
    - [Retrieve User](#retrieve-user)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body)
    - [Retrieve Multiple Users](#retrieve-multiple-users)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body-1)
    - [Update User](#update-user)
      - [Url Parameters](#url-parameters-1)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-2)
    - [Delete User](#delete-user)
      - [Url Parameters](#url-parameters-2)
      - [Example Response Body](#example-response-body-3)
    - [Retrieve User Stats](#retrieve-user-stats)
      - [Url Parameters](#url-parameters-3)
      - [Example Response Body](#example-response-body-4)
    - [Update User Stats](#update-user-stats)
      - [Url Parameters](#url-parameters-4)
      - [Example Request Body](#example-request-body-2)
      - [Example Response Body](#example-response-body-5)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

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

## Endpoints

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
