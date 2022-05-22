# Moderator Endpoints Documentation

## Table of Contents

- [Moderator Endpoints Documentation](#moderator-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
  - [Endpoints](#endpoints)
    - [Create new moderator](#create-new-moderator)
      - [Url Parameters](#url-parameters)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body)
    - [Ban User](#ban-user)
      - [Url Parameters](#url-parameters-1)
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

### Create new moderator

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /moderators/:userId/action/create | POST | Check if the user is a moderator and create a new user using request body data |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the moderator who is creating a new user |

#### Example Request Body

```json
{
    "username": "",
    "password": "",
    "roles": [],    // containing "Moderator" by default
    "online": true
}
```

#### Example Response Body

##### Success

- Status Code: 201
- resource representing the moderator that has just been registered

```json
{
    "userId": "",
    "username": "",
    "roles": [], 
    "online": true
}
```

##### Error

- Status Code: 403 (if unauthorized), 500 (general server error)
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
| /moderators/:userId/action/remove | POST | Check if the user is a moderator and delete a user identified by the id found in the request body |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the moderator who is deleting another user |

#### Example Request Body

[Role](#role) resource representing the role to add

```json
{
    "userId": ""
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
