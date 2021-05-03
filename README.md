# Tomorrow.io Home Assignment

## Build

1. `docker-compose build`
2. `docker-compose up`

Please wait for the message: `Database connection successfully established!` in the console before attempting to hit any endpoints.

- Port: 3000

Alternatively, the application can be run with `npm start` with the ENV `MONGODB_URI` equal to a MongoDB instance.

## Stack

- Language: Node.js
- Web Framework: Express.js
- DB: MongoDB

## Usage

The application contains three rest endpoints:

### 1. weather/data?lat=50&lon=-37.5

As described in the assignment description. In addition, returns 404 whenever invalid coordinates are queried for, or if no forecast exists for said coordinates. For example `weather/data?lat=50&lon=-37.2` will result in 404 because all the supplied data contains coordinates in increments of 0.5.

> Note: The supplied timestamp does not follow _ISO 8601_, i.e it's missing a _Z_ at the end, as a result, MongoDB assumes the timestamp is in local time and retracts 3 from the timestamp (Israel is GMT+3). It is easy to "fix" this, however, it is left as is, due to the _ISO 8601_ violation otherwise.

### 2. weather/summarize?lat=50&lon=-37.5

Same as above.

### 3. weather/reload-data

Will empty the DB and inject all the data from the supplied `csv` files.
This endpoint was not requested in the assignment description, but was added for ease of use.
It is recommended _not_ to use this endpoint in the Heroku hosted version of the application. It will work, but it will make the other endpoints rather useless till this has finished, which can take a while.

> Note: This is fairly time consuming and takes a few minutes.

## Misc

### Database Choice

Initially the application was made using PostgreSQL, because the data is rather structured and SQL is very robust. In the end, this worked locally, even with a hosted DB (Avien/Heroku), but the connection failed when the server was hosted on Heroku. Presumably this happened due to some SSL configuration problems, however, after a lot of work even getting it to work locally (having to rollback the NPM package 2 years back), the DB was discarded.

The model for the application was replaced and is currently using MongoDB as DB. The main downside of using MongoDB is the lack of transactions, but it is not clear whether this is something we truly need for the application. On the other hand, since it's realistic to assume that the application will use tremendous amounts of data, MongoDB might even be a better solution than conventional RDBMSs due to the ease of horizontal scaling.

### Potential Improvements

An obvious improvement that could be made, would be to modify the `weather/reload-data` endpoint and instead let the client supply the data directly through the body, a uri or even opening a socket to the server to stream the data. Obviously all of these options would need require an authication layer as well.

Another improvement would be to cache the data from `getForecastData`. This is the reason that it was chosen to first fetch the forecast data before calculating the summary instead of simply doing the aggregation directly in the DB. There's a tradeoff going on here. On the one hand, if we try to fetch the summary much more frequently than the forecast data, then we might be wasting a lot of network bandwidth shipping all the data back when we may never ask for the forecast data. On the other hand, by not performing the aggregates in the DB, we might be reducing some of the load on the DB and allow for more requests to be done in general.
