# maxWellness

Allows personal trainers to track their workouts and those of their clients.

I built this website entirely by myself, and creating it is the main way I
taught myself to code before landing my first job as a frontend dev.

I've begun work on [v2 of this project](https://github.com/maxmonis/max-wellness.com).

---

## Requirements

You'll need `Node.js`, `Yarn`, and `NVM (Node Version Manager)` installed on
your machine to run this locally.

Node can be installed by following the instructions at
[nodejs.org](https://nodejs.org/).

Yarn can then be added:

```
npm install --global yarn
```

You can add NVM by following the instructions at
[@nvm-sh/nvm](https://github.com/nvm-sh/nvm).

---

## Installation

Clone the repo onto your machine and cd into it:

```
git clone https://github.com/maxmonis/maxWellness.git
cd maxWellness
```

Get the latest recommended version of Node JS (stored in `.nvmrc`):

```
nvm use
```

Download all server and client dependencies:

```
yarn devsetup
```

---

## Configuration

Add a file to hold the JWT secret and the URI of the development database on
MongoDB:

```
touch config/default.json
```

Create a JSON object in that file with a key of "mongoURI" and value of
"mongodb+srv://maxmonis:" + "9O89LVHTusqobbhF@workoutappdev." +
"2gnvx.mongodb.net/" + "?retryWrites=true&w=majority" (concatenate those strings
together, I just would like to avoid committing the actual full value).

Add a key of "jwtSecret" with a value you'd like to use as your secret. Here's
an example:

<img width="858" alt="Screen Shot 2022-11-27 at 11 45 03 AM" src="https://user-images.githubusercontent.com/51540371/204148682-502dc3ce-16bd-4b16-a2fc-6963a9f9b2a7.png">

NOTE: I'll need to whitelist your IP address to allow you to access the database, so please feel free to reach out 😊

Alternatively, you can [set up your own database on MongoDB](https://www.mongodb.com/basics/create-database) and use that URI.

---

## Development

Concurrently start the server on port 5000 and the client on port 3000:

```
nvm use
yarn dev
```

Note that you only need to run `nvm use` the first time you start it up in any
working session, since from then on you should already be using the correct
version of Node and `yarn dev` should work fine.

To start the server alone in development mode:

```
yarn serve
```

To start the app alone in development mode:

```
cd app
yarn start
```

---

## Production build

To start the server in production mode:

```
yarn start
```

To create a production build of the app:

```
cd app
yarn build
```

## Deployment

Note the `build` and `start` scripts in the root `package.json` for building and deploying the server and
client together on [render.com](https://render.com/).

Install all server and client dependencies, then build the application:

```
yarn build
```

Start the server:

```
yarn start
```
