# User Endpoints Documentation

## Table of Contents

- [User Endpoints Documentation](#user-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [Resources](#resources)
    - [Error](#error)
    - [MongoDbApiCredentials](#mongodbapicredentials)
    - [Get MongoDb Api Credentials](#get-mongodb-api-credentials)
      - [Url Parameters](#url-parameters)
      - [Example Response Body](#example-response-body)

## Resources

### Error

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| timestamp | number | Time (in Unix seconds) that the error occurred at |
| requestPath | string | Path of the request that lead to this error |
| errorMsg | string | Error message |

### MongoDbApiCredentials

| Attribute | Data Type | Description |
| :-------- | :-------- | :---------- |
| userId | string | Id of the user |

### Get MongoDb Api Credentials

| Endpoint | Method | Description |
| :------- | :----- | :---------- |
| /api/testing/mongoDbApi/credentials | GET | Retrieve the necessary information, including secrets such as the api-key, to access the MongoDb data Api. This endpoint is available in the testing phase only, and allows the client to directly access the database. This is useful for integration-testing purposes. |

#### Url Parameters

| Name | Data Type | Description |
| :--- | :-------- | :---------- |
| apiBaseUrl | string | Base url of the api |
| clusterName | string | Name of the atlas cluster that contains the testing database(s) |
| apiKey | string | Api Key used to authenticate requests with the api |

#### Example Response Body

##### Success

- Status Code: 200
- A [MongoDbApiCredentials](#mongodbapicredentials) resource

```json
{
    "apiBaseUrl": "http://base/url",
    "clusterName": "cluster-name",
    "apiKey": "api-key"
}
```

##### Error

- Status Codes: 400
- [Error](#error) resource

```json
{
    "timestamp": 1651881600,
    "errorMessage": "some error message",
    "requestPath": "error/request/path"
}
```
