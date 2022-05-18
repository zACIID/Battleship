# Role Endpoints Documentation

## Table of Contents

- [Role Endpoints Documentation](#role-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [Role](#role)
  - [Endpoints](#endpoints)
    - [Retrieve User Roles](#retrieve-user-roles)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body)
    - [Add User Role](#add-user-role)
      - [Url Parameters](#url-parameters-1)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body-1)
    - [Remove User Role](#remove-user-role)
      - [Url Parameters](#url-parameters-2)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-2)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

### Role

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| role | string | Either "Base", "Moderator" or "Admin" |

## Endpoints

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
