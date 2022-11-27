# maxWellness

Allows personal trainers to track their workouts and those of their clients.

I ([Max Monis](https://github.com/maxmonis)) built this project entirely by
myself, and this is probably at least the tenth iteration. Working on it is the
main way I taught myself to code before landing my first job as a frontend dev
and I'm very fond of it, although there's certainly room for improvement.

This infrastructure is set up for deployment on `Heroku`, but it is no longer
active since their free tier was removed. I'll create a new green field version
but am leaving this repo because it was a ton of work and is my baby.

---

## Requirements

You'll need `Node.js`, `Yarn`, and `NVM (Node Version Manager)` installed on
your machine to run this locally.

Node can be installed by following the instructions at
[nodejs.org](https://nodejs.org/).

Yarn can then be added

```
npm install --global yarn
```

You can add NVM by following the instructions at
[@nvm-sh/nvm](https://github.com/nvm-sh/nvm).

---

## Installation

Clone the repo onto your machine and cd into it

```
git clone https://github.com/maxmonis/maxWellness.git
cd maxWellness
```

Get the latest recommended version of Node JS (stored in `.nvmrc`)

```
nvm use
```

Download all server and client dependencies

```
yarn devsetup
```

---

## Configure app

Add a file to hold the key and secret of the development database on MongoDB

```
touch config/default.json
```

Add a JSON object in that file with a key of "mongoURI" and value of
"mongodb+srv://maxmonis:" + "9O89LVHTusqobbhF@workoutappdev." +
"2gnvx.mongodb.net/" + "?retryWrites=true&w=majority" (concatenate those strings
together, I just would like to avoid committing the actual full value).

Add a key of "jwtSecret" with a value you'd like to use as your secret.

<img width="858" alt="Screen Shot 2022-11-27 at 11 45 03 AM" src="https://user-images.githubusercontent.com/51540371/204148682-502dc3ce-16bd-4b16-a2fc-6963a9f9b2a7.png">

---

## Running the project

Concurrently start the server on port 5000 and the client on port 3000

```
nvm use
yarn dev
```

Note that you only need to run `nvm use` the first time you start it up in any
working session, since from then on you should already be using the correct
version of Node and `yarn dev` should work fine.

---

## Creating a production build

The server can be started using

```
yarn start
```

For a production build of the app run

```
cd app
yarn build
```

Note the `heroku-postbuild` script for building and deploying the server and
client together. This is where it was hosted until they got rid of their free
tier. I will be adding a v2 of this project shortly and will link to that repo
in this readMe once it's ready.
