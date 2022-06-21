# Authentication Endpoints Documentation

## Table of Contents

- [Authentication Endpoints Documentation](#authentication-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [LoginInfo](#logininfo)
    - [AuthenticationData](#authenticationdata)
    - [User](#user)
  - [Endpoints](#endpoints)
    - [User Login](#user-login)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body)
    - [User Registration](#user-registration)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-1)
    - [User Logout](#user-logout)
      - [Example Response](#example-response)

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

### AuthenticationData

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| userId | string | Id of the user that has just authenticated
| token | string | JWT used to authenticate requests to the api |

### User

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| userId | string | Id of the user |
| username | string | Username of the user |
| roles | string[] | List of roles assigned to the user |
| online | boolean | Status of the user |

## Endpoints

### User Login

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/auth/signin | POST | User login |

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
- [JWT](#jwt) resource representing the JWT needed for authentication

```json
{
    "userId": "user-id",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

##### Error

- Status Code: 400, 500
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
| /api/auth/signup | POST | Add a new user in the database using request body data |

#### Example Request Body

[LoginInfo](#logininfo) resource containing the information required to register to the system

```json
{
    "username": "",
    "password": ""
}
```

#### Example Response Body

##### Success

- Status Code: 201
- [User](#user) resource representing the user that has just been registered

```json
{
    "userId": "",
    "username": "",
    "roles": [ "Base" ],
    "online": true
}
```

##### Error

- Status Code: 400, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### User Logout

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/auth/signout | POST | User logout |

#### Example Response

##### Success

- Status Code: 204

##### Error

- Status Code: 400, 403
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```
