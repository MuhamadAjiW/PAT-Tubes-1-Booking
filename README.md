# booking

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## How to run Docker
place all of the cloned repo in one folder, move `.env` and `docker-compose.yml` from config folder to the root folder, then run:
`docker compose -f ./docker-compose.yml -p "tubes-pat-all" --env-file .env up --build`

This project was created using `bun init` in bun v1.0.11. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
