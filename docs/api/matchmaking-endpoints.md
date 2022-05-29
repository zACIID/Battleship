# Chat Endpoints Documentation

## Table of Contents

- [Chat Endpoints Documentation](#chat-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Endpoints](#endpoints)
    - [Enqueue Player](#enqueue-player)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body)
    - [Remove Player From Queue](#remove-player-from-queue)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body-1)

## Endpoints

### Enqueue Player

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/matchmaking/queue | POST | Add a player to the matchmaking queue |

#### Example Request Body

Resource representing the id of the user to add to the queue

```json
{
    "userId": "user-id-1"
}
```

#### Example Response Body

##### Success

- Status Code: 201
- Resource representing the id of the user that was just added

```json
{
    "userId": "user-id-1"
}
```

##### Error

- Status Codes: 400, 500
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```

### Remove Player From Queue

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/matchmaking/queue/:userId | DELETE | Remove the user with the specified id from the matchmaking queue |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
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
