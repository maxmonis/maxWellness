# max-wellness.ca

This PWA allows users to track their workouts. It uses Firebase for both
authentication and data management.

This is the most recent edition of the first app I ever attempted to build, and
several previous versions are also public repos.

## Requirements

You'll need `Node.js`, `Yarn`, and `NVM (Node Version Manager)` installed on
your machine to run this app locally.

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
git clone https://github.com/maxmonis/max-wellness.ca.git
cd max-wellness.ca
```

Download all dependencies:

```
yarn
```

---

## Configuration

You'll need Firebase credentials for authentication and to connect to a
Firestore database, so create a gitignored env file:

```
touch .env.local
```

Now add your credentials to that file, these are the required keys:

```
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_APP_ID=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_MEASUREMENT_ID=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=

FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Follow the instructions on [firebase.google.com](https://firebase.google.com/)
if you need to create a new project.

---

## Development

Ensure you're using the correct Node version from the `.nvmrc` file (you should
only need to do this once per session):

```
nvm use
```

Start the app in development mode:

```
yarn dev
```

---

## Production

Create a production build of the app:

```
yarn build
```

---
