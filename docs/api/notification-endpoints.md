# Notification Endpoints Documentation

## Table of Contents

- [Notification Endpoints Documentation](#notification-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [Notification](#notification)
    - [Retrieve Notifications](#retrieve-notifications)
      - [Url Parameters](#url-parameters)
      - [Query Parameters](#query-parameters)
      - [Example Response Body](#example-response-body)
    - [Add Notification](#add-notification)
      - [Url Parameters](#url-parameters-1)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body-1)
    - [Remove Notification](#remove-notification)
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

### Notification

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| type | string | type of the notification |
| sender | string | Id of the user that generated the notification |

### Retrieve Notifications

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/notifications | GET | Retrieve the notifications of the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to retrieve the notifications of |

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| limit | Integer | No | Maximum number of notifications to be returned | 100 | limit <= 500 && limit >= 0 |
| skip | Integer | No | Number of notifications to skip before starting to select users to send | 0 | skip >= 0 |

#### Example Response Body

##### Success

- Status Code: 200
- Array of [Notification](#notification) resources that were sent to the specified user, of maximum length *limit*

```json
{
    "notifications": [
        {
            "id": "notification-id",
            "type": "FriendRequest",
            "sender": "sender-id"
        }
        ...
    ],
    "nextPage": "baseUrl/users/:userId/notifications?limit=500&skip=500"
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

### Add Notification

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/notifications | POST | Add a notification to the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to add the notification to |

#### Example Request Body

[Notification](#notification) resource representing the notification to add to the user

```json
{
    "type": "FriendRequest",
    "sender": "sender-id"
}
```

#### Example Response Body

##### Success

- Status Code: 201
- [Notification](#notification) resource that was just added to the user

```json
{
    "id": "notification-id",
    "type": "FriendRequest",
    "sender": "sender-id"
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

### Remove Notification

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /users/:userId/notifications/:notificationId | DELETE | Remove the notification from the specified user |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the user to remove the notification from |
| notificationId | string | Id of the notification to remove |

#### Example Request Body

[Notification](#notification) resource to remove from the user

```json
{
    "type": "FriendRequest",
    "sender": "sender-id"
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
