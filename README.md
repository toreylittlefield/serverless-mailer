# Serverless Mailer

A simple email sender using nodemailer and Turso database.

- Nodemailer is used to send emails.
- Turso database is used to store email templates.
- Netlify to host the serverless functions and is AWS Lambda compatible.

## Installation

```bash
pnpm install # Install the dependencies
```

## Usage

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables or use npx/pndm dlx to create the `.env` file.

See https://www.dotenv.org/docs/quickstart for CLI commands

Example:

```bash
pnpm dlx dotenv-vault@latest push # push to dotenv-vault
pnpm dlx dotenv-vault@latest pull # pull from dotenv-vault
```

See list of `pnpm run env:` commands in the `package.json` file.

---

## Turso Database

Turso is a simple database that uses SQLite3. It has a generous free tier.
See https://turso.tech/ for more information.

You can use the Turso database to store email templates.

Open the `./scripts/db.ts` file to create the database and tables.

```bash
pnpm run db:create # Create the database
```

Modify the `dump.sql` file to change the database schema and/or populate the tables.

---

## Local Development

```bash
pnpm run dev # Start the server
```

---

## Build

```bash
pnpm run build # Build the project
```

Output will be in the `./dist` directory.

---

## Test

```bash
pnpm run test # Run the tests
```

### Coverage

```bash
pnpm run coverage # Run the tests with coverage
```

---

## Deploy to Netlify from CLI (Optional)

```bash
pnpm run deploy # Deploy to Netlify
```

or push to your repository and Netlify will automatically deploy the changes.
