# Nuxt + NuxtUI + Nuxt-Auth-Utils template

This is a template for a Nuxt project with NuxtUI and Nuxt-Auth-Utils. Initial auth with GitHub is set up.

## Features

- [Nuxt 3](https://nuxt.com/)
- [NuxtUI](https://ui.nuxt.com/)
- [Nuxt-Auth-Utils](https://nuxt.com/modules/auth-utils#nuxt-auth-utils)
- [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

## Install

```bash
npm ci
```

## Setup your .env variables

Copy the `.env.example` file to `.env` and fill in the variables.

```bash
cp .env.example .env
```

To learn how to set up your own GitHub App (to retrieve the auth credentials), see the official documentation:
https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app

### Authentication

Set your `NUXT_OAUTH_GITHUB_CLIENT_ID` and `NUXT_OAUTH_GITHUB_CLIENT_SECRET` in the `.env` file.

For `nuxt-auth-utils` to work properly and set valid sessions, you must provide a `NUXT_SESSION_PASSWORD` in the `.env` file. Follow the official documentation for more information:
https://nuxt.com/modules/auth-utils#quick-setup

### Database

This template provides a `docker-compose.yaml` file, which allows you to spin up a postgres database for development purposes.
Provide custom `DB_USER`, `DB_PASSWORD` and `DB_NAME` in the `.env` file or use the default values. These variables will also be used by the nuxt application to connect to the database.

```bash

## Dev Server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## preview

```bash
npm run preview
```