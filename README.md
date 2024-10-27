# WhisperVote


This project was created as part of the course "IT-Projekt" at the Ostfalia University of Applied Sciences in Suderburg.
All four projects are parts of the WhisperVote application.

## Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Docker](https://www.docker.com/get-started)

## Getting Started

### Clone the repository

```sh
git clone https://github.com/Drizein/whispervote.frontend.nuxt.git
cd whispervote.frontend.nuxt
```

### Set the environment variables

modify the `docker-compose.yml` file to set the environment variables for the MariaDB container and the .NET application.

```sh
      NUXT_PUBLIC_APIS_AUTH: 'http://localhost:9912'
      NUXT_PUBLIC_APIS_SIGNATURE: 'http://localhost:9914'
      NUXT_PUBLIC_APIS_VOTE: 'http://localhost:9913'
```

### Run the Docker container

```sh
docker compose up -d
```








# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
