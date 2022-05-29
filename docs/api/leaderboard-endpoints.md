# Leaderboard Endpoints Documentation

## Table of Contents

- [Leaderboard Endpoints Documentation](#leaderboard-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [LeaderboardEntry](#leaderboardentry)
  - [Endpoints](#endpoints)
    - [Retrieve Leaderboard](#retrieve-leaderboard)
      - [Query Parameters](#query-parameters)
      - [Example Response Body](#example-response-body)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

### LeaderboardEntry

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| userId | string | Id of the user that this leaderboard entry refers to |
| username | string | Name of the user that this leaderboard entry refers to |
| elo | number | Elo of the user that this leaderboard entry refers to |

## Endpoints

### Retrieve Leaderboard

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/leaderboard | GET | Retrieve part of the leaderboard, which is ordered by elo |

#### Query Parameters

| Name | Data Type | Required | Description | Default | Constraints |
| :--- | :-------- | :------- | :---------- | :------ | :---------- |
| limit | Integer | No | Maximum number of users to be returned | 50 | limit <= 50 && limit >= 0 |
| skip | Integer | No | Number of users to skip before starting to select users to send | 0 | skip >= 0 |

#### Example Response Body

##### Success

- Status Code: 200
- Array of [LeaderboardEntry](#leaderboardentry) resources, of maximum length *limit*

```json
    "leaderboard": [
        {
            "userId": "",
            "username": "",
            "elo": 0
        },
        ...
    ],
    "nextPage": "baseUrl/leaderboard?limit=50&skip=50"
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
