# Moderator Endpoints Documentation

## Table of Contents

- [Moderator Endpoints Documentation](#moderator-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
  - [Endpoints](#endpoints)
    - [Create new moderator](#create-new-moderator)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body)
    - [Ban User](#ban-user)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-1)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

## Endpoints

An important thing to note is that, since these endpoints require the caller to be a moderator, an additional layer of authentication is needed. Such layer consists of verifying the information contained in the JWT that the caller authenticates with, which includes the roles of the user that calls the api.
Access is granted only if the user is a Moderator.

### Create new moderator

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/moderators/additions | POST | Check if the user is a moderator and create a new moderator using request body data |

#### Example Request Body

```json
{
    "username": "username",
    "password": "password"
}
```

#### Example Response Body

##### Success

- Status Code: 201
- resource representing the moderator that has just been registered

```json
{
    "userId": "user-id",
    "username": "username",
    "roles": ["Base", "Moderator"], 
    "online": false
}
```

##### Error

- Status Code: 403, 400
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Ban User

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/moderators/bans | POST | Check if the user is a moderator and delete a user identified by the username found in the request body |

#### Example Request Body

Resource containing the username of the user to ban

```json
{
    "username": "username"
}
```

#### Example Response Body

##### Success

- Status Code: 204
- Empty response

##### Error

- Status Codes: 403 (unauthorized) 404 (if user not found)
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```
