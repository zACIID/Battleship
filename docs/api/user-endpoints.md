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
    - [Retrieve User's Current Match](#retrieve-user-current-match)
      - [Url Parameters](#url-parameters-1)
      - [Example Response Body](#example-response-body-current-match)
    - [Retrieve Multiple Users](#retrieve-multiple-users)
      - [Query Parameters](#query-parameters)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body-1)
    - [Update Password](#update-password)
      - [Url Parameters](#url-parameters-2)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-2)
    - [Update Username](#update-username)
      - [Url Parameters](#url-parameters-3)
      - [Example Request Body](#example-request-body-2)
      - [Example Response Body](#example-response-body-3)
    - [Delete User](#delete-user)
      - [Url Parameters](#url-parameters-4)
      - [Example Response Body](#example-response-body-4)
    - [Retrieve User Stats](#retrieve-user-stats)
      - [Url Parameters](#url-parameters-5)
      - [Example Response Body](#example-response-body-5)
    - [Update User Stats](#update-user-stats)
      - [Url Parameters](#url-parameters-6)
      - [Example Request Body](#example-request-body-3)
      - [Example Response Body](#example-response-body-6)

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
| elo | number | Elo of the user |

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
| /api/users/:userId | GET | Retrieve the user with the specified id |

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
    "online": true,
    "elo": 750
}
```

##### Error

- Status Codes: 400, 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Retrieve User Current Match

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/users/:userId/currentMatch | GET | Retrieve the current match of a user if it's InGame, otherwise it returns an empty string

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user which match is to retrieve |

#### Example Response Body Current Match

##### Success

- Status Code: 201
- [User](#user) resource with the specified id

```json
{
    "matchId": "matchid" || "" 
}
```

##### Error Current Match

- Status Codes: 400, 404, 500
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
| /api/users | GET | Retrieve the users with the ids specified in the request body |

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| ids | string | yes | User ids to retrieve, separated by "," | - | Format is: {userId1},{userId2},...,{userIdn}. *Note that there are no spaces, just ","* |

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
            "online": true,
            "elo": 750
        },
        {
            "userId": "user-id-2",
            "username": "username2",
            "roles": [
                "Base", 
                "Moderator"
            ],
            "online": true,
            "elo": 750
        },
        ...
    ]
}
```

##### Error

- Status Codes: 400, 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Update Password

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/users/:userId/password | PUT | Update the password of the user with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to update |

#### Example Request Body

Object containing the new password to set

```json
{
    "password": "new password"
}
```

#### Example Response Body

##### Success

- Status Code: 204
- Empty response

##### Error

- Status Codes: 400, 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Update Username

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/users/:userId/username | PUT | Update the username of the user with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to update |

#### Example Request Body

Object containing the new username to set

```json
{
    "username": "new username"
}
```

#### Example Response Body

##### Success

- Status Code: 204
- Resource containing the updated username

```json
{
    "username": "new username"
}
```

##### Error

- Status Codes: 400, 404, 500
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
| /api/users/:userId | DELETE | Delete the user with the provided id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to delete |

#### Example Response Body

##### Success

- Status Code: 204
- Empty response

##### Error

- Status Codes: 400, 404, 500
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
| /api/users/:userId/stats | GET | Retrieve the statistics of the specified user |

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

- Status Codes: 400, 404, 500
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
| /api/users/:userId/stats | PUT | Update the statistics of the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to update the statistics of |

#### Example Request Body

A full [UserStats](#userstats) resource that will replace the existing one

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

#### Example Response Body

##### Success

- Status Code: 200
- The [UserStats](#userstats) resource that replaced the old one

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

- Status Codes: 400, 404, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```
