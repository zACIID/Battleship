# Chat Endpoints Documentation

## Table of Contents

- [Chat Endpoints Documentation](#chat-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [Chat](#chat)
    - [Message](#message)
  - [Endpoints](#endpoints)
    - [Retrieve Chat](#retrieve-chat)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body)
    - [Delete Chat](#delete-chat)
      - [Url Parameters](#url-parameters-1)
      - [Example Response Body](#example-response-body-1)
    - [Add User to Chat](#add-user-to-chat)
      - [Url Parameters](#url-parameters-2)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body-2)
    - [Remove User from Chat](#remove-user-from-chat)
      - [Url Parameters](#url-parameters-3)
      - [Example Response Body](#example-response-body-3)
    - [Retrieve Chat Messages](#retrieve-chat-messages)
      - [Url Parameters](#url-parameters-4)
      - [Query Parameters](#query-parameters)
      - [Example Response Body](#example-response-body-4)
    - [Add Message to Chat](#add-message-to-chat)
      - [Url Parameters](#url-parameters-5)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-5)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

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

## Endpoints

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