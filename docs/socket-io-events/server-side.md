# Socket.io Server-Side Events Documentation

## Table of Contents

- [Socket.io Server-Side Events Documentation](#socketio-server-side-events-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Message](#message)
    - [FriendOnline](#friendonline)
    - [MatchFound](#matchfound)
    - [Notification](#notification)
    - [StateChanged](#statechanged)
    - [GenericEventMessage](#genericeventmessage)
    - [ShipsUpdate](#shipsupdate)
    - [Ship](#ship)
    - [GridCoordinates](#gridcoordinates)
    - [Shot](#shot)
  - [Events](#events)
    - [New Chat Message](#new-chat-message)
    - [Friend Online](#friend-online)
    - [Match Found](#match-found)
    - [Notification Received](#notification-received)
    - [Player Positioning State Changed](#player-positioning-state-changed)
    - [Positioning Phase Completed](#positioning-phase-completed)
    - [Player Ships Updated](#player-ships-updated)
    - [Shot Fired](#shot-fired)

<style>
table th:first-of-type {
    width: 20%;
}
table th:nth-of-type(2) {
    width: 40%;
}
table th:nth-of-type(3) {
    width: 40%;
}
</style>

## Resources

### Message

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| author | string | Id of the user that sent the message |
| timestamp | number | Timestamp in unix seconds |
| content | string | Content of the message |

### FriendOnline

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| friendId | string | Id of the friend that has just logged in |

### MatchFound

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| matchId | string | Id of the match that has just been created (found) |

### Notification

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| sender | string | Id of the user that generated the notification |
| type | string | Type of the notification |

### StateChanged

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| playerId | string | Id of the player that changed his state |
| ready | boolean | Value of the updated state of the player |

### GenericEventMessage

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| message | string | Generic info message sent by an event, containing non-critical data |

### ShipsUpdate

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| ships | [Ship](#ship)[] | Array containing information about the ships on some battleship grid |

### Ship

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| coordinates | [GridCoordinates](#gridcoordinates)[] | Array containing the coordinates of each *piece* of the ship. The i-th coordinate corresponds to the i-th piece. |
| type | string | Type of the ship |

### GridCoordinates

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| row | number | Row number in the closed interval [0, 9] |
| col | number | Column number in the closed interval [0, 9] |

### Shot

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| playerId | string | Id of the player that fired the shot |
| coordinates | [GridCoordinates](#gridcoordinates) | Coordinates where the shot has been fired |

## Events

### New Chat Message

| Event name | Description | Event Data |
| :--------- | :---------- | :--------- |
| chat-message | When POST request to add a message is received by the server, this event is raised, so that every user in that chat is notified that there is a new message. | With this event, a [Message](#message) resource is sent, which represents the message that was just added to the chat. |

### Friend Online

| Event name | Description | Event Data |
| :--------- | :---------- | :--------- |
| friend-online | Every time a user logs in, all his friends are notified that he is now online. | With this event, a [FriendOnline](#friendonline) resource is sent, which contains the id of the user that has just logged in. This way, his friends know which user is now online |

### Match Found

| Event name | Description | Event Data |
| :--------- | :---------- | :--------- |
| match-found | This event can be raised by the server in two occasions: </br> 1. The matchmaking engine finds a suitable pair of players and arranges a match between them; </br> 2. A user accepts a match request coming from another user, and a match between the two is created. </br> In both cases, both players of the match will be notified by this event, whose data sent will contain the id of the match that has been created. | With this event, a [MatchFound](#matchfound) resource is sent, which contains the id of match user that has been created. </br> This way, the players can retrieve the match by querying the api. |

### Notification Received

| Event name | Description | Event Data |
| :--------- | :---------- | :--------- |
| notification-received | Every time a user sends some request to another user, the latter is notified by the server that he has a new notification. More specifically, this happens after the server receives a request on the *Add Notification* endpoint. | With this event, a [Notification](#notification) resource is sent, which contains information about the notification that has just been added to the user. |

### Player Positioning State Changed

| Event name | Description | Event Data |
| :--------- | :---------- | :--------- |
| player-state-changed | This event is raised by the server when a player queries the api to change his *ready* state, which means that his positioning is completed. If only one player is ready, the opposing player and all the spectators are notified of this state change. In case both players are ready, however, another event is raised: [Positioning Phase Completed](#positioning-phase-completed). | With this event, a [StateChanged](#statechanged) resource is sent, which contains information about the new state of the opposing player. |

### Positioning Phase Completed

| Event name | Description | Event Data |
| :--------- | :---------- | :--------- |
| positioning-completed | This event is raised by the server when a player queries the api to change his *ready* state, only if both players have declared that they are *ready*, meaning that they have finished their positioning phase. Both players will then be notified that the positioning phase has been completed and can move on to play the actual game. Also, spectators will be notified, so that they know that the actual game is starting. </br> The main purpose of this event is letting the server synchronize when the two players can actually start the game, rather than having both players carefully listening for state changes of the opponent and try to start the next phase of the game at the same time. | A [GenericEventMessage](#genericeventmessage) resource containing the message *"positioning completed"*. |

### Player Ships Updated

| Event name | Description | Event Data |
| :--------- | :---------- | :--------- |
| player-ships-updated | This event is raised by the server when a player updates the positioning of his ships. More specifically, this happens when the *Update Grid* endpoint is called, which should happen after a player is done positioning his ships on the grid. </br> The opposing player is notified of this event, so that he can update his game state accordingly. | With this event, a [ShipsUpdate](#shipsupdate) resource is sent, which contains information about the updated positions of the ships of the opposing player. |

### Shot Fired

| Event name | Description | Event Data |
| :--------- | :---------- | :--------- |
| shot-fired | This event is raised by the server when a player queries the api to fire a shot on the opposing side's grid. The player that receives the shot, along with every player that is spectating the match, is notified, so him and the spectators can update their game state accordingly. | With this event, a [Shot](#shot) resource is sent, which contains information about the shot that has been just fired. |