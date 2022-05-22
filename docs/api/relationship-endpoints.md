# Relationship Endpoints Documentation

## Table of Contents

- [Relationship Endpoints Documentation](#relationship-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [Relationship](#relationship)
    - [Retrieve User Relationships](#retrieve-user-relationships)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body)
    - [Add User Relationship](#add-user-relationship)
      - [Url Parameters](#url-parameters-1)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body-1)
    - [Remove User Relationship](#remove-user-relationship)
      - [Url Parameters](#url-parameters-2)
      - [Example Response Body](#example-response-body-2)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

### Relationship

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| friendId | string | Id of some friend user |
| chatId | string | Id of the chat with the above friend |

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
| /users/:userId/relationships | POST | Add a relationship to the specified user, chat will be automatically created |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to add the relationship to |

#### Example Request Body

[Relationship](#relationship) resource representing the relationship to add

```json
{
    "friendId": "friend-id-1",
}
```

#### Example Response Body

##### Success

- Status Code: 201
- The [Relationship](#relationship) resource that has just been created

```json
{
    "friendId": "friend-id-1"
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
| /users/:userId/relationships/:friendId | DELETE | Remove the social relationship with the specified friend from the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to remove the relationship from |
| friendId | string | Id of friend whose relationship is to remove |

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
