# Match Endpoints Documentation

## Table of Contents

- [Match Endpoints Documentation](#match-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [MatchInfo](#matchinfo)
    - [Match](#match)
    - [MatchStats](#matchstats)
  - [Endpoints](#endpoints)
    - [Create Match](#create-match)
      - [Example Request Body](#example-request-body)
      - [Example Response Body](#example-response-body)
    - [Retrieve Match](#retrieve-match)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body-1)
    - [Update Match Stats](#update-match-stats)
      - [Url Parameters](#url-parameters-1)
      - [Example Request Body](#example-request-body-1)
      - [Example Response Body](#example-response-body-2)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

### MatchInfo

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| player1 | string | Id of player #1 of the match |
| player2 | string | Id of player #2 of the match |

### Match

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| matchId | string | Id of the match |
| player1 | string | Id of player #1 of the match |
| player2 | string | Id of player #2 of the match |
| playersChat | string | Id of the players chat |
| observersChat | string | Id of the observers chat |
| stats | [MatchStats](#matchstats) | Stats of the match |

### MatchStats

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| winner | string | Id of player that won the match |
| startTime | number | Time (in Unix seconds) that the match started at |
| endTime | number | Time (in Unix seconds) that the match ended at |
| totalShots | number | Total shots fired during the match |
| shipsDestroyed | number | Number of ships destroyed during the match |

## Endpoints

### Create Match

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches | POST | Create a new match |

#### Example Request Body

[MatchInfo](#matchinfo) containing the information about the match to create

```json
{
    "player1": "player1-id",
    "player2": "player2-id"
}
```

#### Example Response Body

##### Success

- Status Code: 201
- [Match](#match) resource representing the match that has just been created

```json
{
    "matchId": "match-id",
    "player1": "player1-id",
    "player2": "player2-id",
    "playersChat": "players-chat-id",
    "observersChat": "observers-chat-id"
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

### Retrieve Match

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches/:matchId | GET | Retrieve the match with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the match to retrieve |

#### Example Response Body

##### Success

- Status Code: 200
- [Match](#match) resource with the specified id

```json
{
    "matchId": "match-id",
    "player1": "player1-id",
    "player2": "player2-id",
    "playersChat": "players-chat-id",
    "observersChat": "observers-chat-id",
    "stats": {
        "winner": "winner-user-id",
        "startTime": 1651881600,
        "endTime": 1651881600,
        "shipsDestroyed": 5,
        "totalShots": 40
    }
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

### Update Match Stats

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /matches/:matchId/stats | PUT | Update the statistics of the specified match |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| userId | string | Id of the match to update the statistics of |

#### Example Request Body

A full [MatchStats](#matchstats) resource that will replace the old one.

```json
{
    "winner": "winner-user-id",
    "startTime": 1651881600,
    "endTime": 1651881600,
    "shipsDestroyed": 5,
    "totalShots": 40
}
```

#### Example Response Body

##### Success

- Status Code: 200
- The full [MatchStats](#matchstats) resource that replaced the old one

```json
{
    "winner": "winner-user-id",
    "startTime": 1651881600,
    "endTime": 1651881600,
    "shipsDestroyed": 5,
    "totalShots": 40
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
