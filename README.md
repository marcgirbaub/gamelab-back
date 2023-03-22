# Gamelab

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Marc-Girbau-Final-Project-back-202301-bcn&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Marc-Girbau-Final-Project-back-202301-bcn)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Marc-Girbau-Final-Project-back-202301-bcn&metric=coverage)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Marc-Girbau-Final-Project-back-202301-bcn)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Marc-Girbau-Final-Project-back-202301-bcn&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Marc-Girbau-Final-Project-back-202301-bcn)

## Links

### Front

- [repo](https://github.com/isdi-coders-2023/Marc-Girbau-Final-Project-front-202301-bcn)

### Back

- [repo](https://github.com/isdi-coders-2023/Marc-Girbau-Final-Project-back-202301-bcn)
- [prod](https://marc-girbau-final-project-202301-bcn.onrender.com/)

## Endpoints

### USER

#### POST /users/register

- create an account in the application
- response 201
- no response body

#### POST /users/login

- fetch user token
- response 200
- token in response body

### VIDEOGAMES

#### GET /games

- fetch a list of games
- response 200
- games list in response body

#### GET /games?filter=filter

- fetch a list of games that match filter
- response 200
- games list in response body

## Protected endpoints

### VIDEOGAMES

#### GET /games/:gameId

- fetch a single game
- response 200
- game in response body

#### POST /games/create

- add a new game to the database
- response 201
- send new game in multipart/form-data
- new game in response body

#### DELETE /games/delete/:gameId

- delete a game from the database
- response 200
- deleted game in response body

#### PUT /games/update/:gameId

- update a game's information
- response 201
- send changes in multipart/form-data
- updated game in response body

#### GET /games/mygame

- fetch a list of your own games
- response 200
- games list in response body
