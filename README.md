# Serverless Mailer

A simple email sender using nodemailer and Turso database.

- Nodemailer is used to send emails.
- Turso database is used to store email templates.

## Installation

```bash
pnpm install
```

## Usage

Create a `.env` file in the root directory and add the following environment variables or use npx/pndm dlx to create the `.env` file.

Open the `./scripts/db.ts` file to create the database and tables.

```bash
pnpm run db:create # Create the database
```

## Local Development

```bash
pnpm run dev # Start the server
```

## Build

```bash
pnpm run build # Build the project
```

Output will be in the `./dist` directory.
