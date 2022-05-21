# Authentication Endpoints Documentation

## Table of Contents

- [Authentication Endpoints Documentation](#authentication-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [How API Authentication works](#how-api-authentication-works)
  - [Resources](#resources)
    - [Error](#error)
    - [LoginInfo](#logininfo)
    - [JWT](#jwt)
    - [RegistrationInfo](#registrationinfo)
    - [User](#user)
  - [Endpoints](#endpoints)
    - [User Login](#user-login)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body)
    - [User Registration](#user-registration)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-1)

## How API Authentication works

define how authenticating for the API works: Basic Authentication, use of jwt and how to retrieve it, what error is returned if auth fails (401=?)
**TODO**

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

## Endpoints

### User Login

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| api/auth/signin | POST | User login |

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
| api/auth/signup | POST | Add a new user in the database using request body data |

#### Example Request Body

[RegistrationInfo](#registrationinfo) resource containing the information required to register to the system

```json
{
    "username": "",
    "password": "",
    "roles": [],
    "online": true
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
