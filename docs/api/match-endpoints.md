# Match Endpoints Documentation

## Table of Contents

- [Match Endpoints Documentation](#match-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [MatchInfo](#matchinfo)
    - [Match](#match)
    - [PlayerState](#playerstate)
    - [BattleshipGrid](#battleshipgrid)
    - [Ship](#ship)
    - [GridCoordinates](#gridcoordinates)
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
    - [Update Player Grid](#update-player-grid)
      - [Url Parameters](#url-parameters-2)
      - [Example Request Body](#example-request-body-2)
      - [Example Response Body](#example-response-body-3)
    - [Fire Shot](#fire-shot)
      - [Url Parameters](#url-parameters-3)
      - [Example Request Body](#example-request-body-3)
      - [Example Response Body](#example-response-body-4)
    - [Set Ready State](#set-ready-state)
      - [Url Parameters](#url-parameters-4)
      - [Example Request Body](#example-request-body-4)
      - [Example Response Body](#example-response-body-5)

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
| player1 | string | s |
| player2 | string | Id of player #2 of the match |

### Match

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| matchId | string | Id of the match |
| player1 | [PlayerState](#playerstate) | Resource representing the game state of player #1 |
| player2 | [PlayerState](#playerstate) | Resource representing the game state of player #2 |
| playersChat | string | Id of the players chat |
| observersChat | string | Id of the observers chat |
| stats | [MatchStats](#matchstats) | Stats of the match |

### PlayerState

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| playerId | string | Id of the player that this resource refers to |
| grid | [BattleshipGrid](#battleshipgrid) | Resource representing the player's grid |

### BattleshipGrid

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| ships | [Ship](#ship)[] | Array of ship resources that represents the ships placed by the player on his grid |
| shotsReceived | [GridCoordinates](#gridcoordinates) | Array of coordinates that represents the shots received by the player on his grid |

### Ship

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| coordinates | [GridCoordinates](#gridcoordinates)[] | Array of coordinates that represent the grid cells where the ship has been placed. To the i-th coordinate corresponds the i-th cell occupied by the ship, starting from its beginning |
| type | string | Type of the ship. Can be either *Destroyer*, *Cruiser*, *Battleship* or *Carrier* |

### GridCoordinates

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| row | number | Row number in the closed interval [0, 9] |
| col | number | Column number in the closed interval [0, 9] |

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
| /api/matches | POST | Create a new match |

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
- [Match](#match) resource representing the match that has just been created.
**Note:** that *winner* and *endTime* are `null` because they are not decided yet.

```json
{
    "matchId": "match-id",
    "player1": {
        "playerId": "player-1-id",
        "grid": {
            "ships": [],
            "shots": []
        }
    },
    "player2": {
        "playerId": "player-2-id",
        "grid": {
            "ships": [],
            "shots": []
        }
    },
    "playersChat": "players-chat-id",
    "observersChat": "observers-chat-id",
    "stats": {
        "winner": null,
        "startTime": 1651881600,
        "endTime": null,
        "shipsDestroyed": 0,
        "totalShots": 0
    }
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
| /api/matches/:matchId | GET | Retrieve the match with the specified id |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| matchId | string | Id of the match to retrieve |

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
| /api/matches/:matchId/stats | PATCH | Update the statistics of the specified match |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| matchId | string | Id of the match to update the statistics of |

#### Example Request Body

A [MatchStats](#matchstats) resource, without the startTime field, that will replace the old one.

```json
{
    "winner": "winner-user-id",
    "endTime": 1651881600,
    "shipsDestroyed": 5,
    "totalShots": 40
}
```

#### Example Response Body

##### Success

- Status Code: 200
- The [MatchStats](#matchstats) resource, without the startTime field, that replaced the old one

```json
{
    "winner": "winner-user-id",
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

### Update Player Grid

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/matches/:matchId/players/:userId/grid | PUT | Update the grid of the specified player of the match |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| matchId | string | Id of the match to update the grid of |
| userId | string | Id of the player to update the grid of |

#### Example Request Body

A full [BattleshipGrid](#battleshipgrid) resource that will replace the old one.

```json
{
    "ships": [
        {
            "coordinates": [
                {"row": 0, "col": 1},
                {"row": 0, "col": 2}
            ],
            "type": "Destroyer"
        },
        ...
    ],
    "shotsReceived": [
        {"row": 0, "col": 1}
    ]
}
```

#### Example Response Body

##### Success

- Status Code: 200
- The full [MatchStats](#matchstats) resource that replaced the old one

```json
{
    "ships": [
        {
            "coordinates": [
                {"row": 0, "col": 1},
                {"row": 0, "col": 2}
            ],
            "type": "Destroyer"
        },
        ...
    ],
    "shotsReceived": [
        {"row": 0, "col": 1}
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

### Fire Shot

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/matches/:matchId/players/:userId/shotsFired | POST | Add a shot made by the specified player |

#### Url Parameters

| Name    | Data Type | Description |
|:--------| :-------- | :---------- |
| matchId | string | Id of the match to fire the shot in |
| userId  | string | Id of the player that fires the shot |

#### Example Request Body

A [GridCoordinates](#gridcoordinates) resource representing the coordinates of the shot

```json
{
    "row": 0,
    "col": 1
}
```

#### Example Response Body

##### Success

- Status Code: 201
- The [GridCoordinates](#gridcoordinates) resource representing the shot that was just fired

```json
{
    "row": 0,
    "col": 1
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

### Set Ready State

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/matches/:matchId/players/:userId/ready | PUT | Change the ready state of the player in the match |

#### Url Parameters

| Name    | Data Type | Description |
|:--------| :-------- | :---------- |
| matchId | string | Id of the match where player is playing |
| userId  | string | Id of the player whose state needs to be changed |

#### Example Request Body

An object containing a boolean, which represents the new ready state of the player

```json
{
    "ready": true
}
```

#### Example Response Body

##### Success

- Status Code: 200
- An object containing a boolean, which represents the updated ready state of the player

```json
{
    "ready": true
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
