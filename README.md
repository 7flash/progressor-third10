# Telegram Character Creation Bot

This is a TypeScript project that creates a Telegram bot to help users create a character by asking them a series of questions and storing their answers. The bot uses the [Deno](https://deno.land/) runtime and the [Telegram Bot API](https://core.telegram.org/bots/api).

## Getting Started

To use this bot, you'll need to create a new bot on Telegram and obtain an API token. You can follow the [official instructions](https://core.telegram.org/bots#6-botfather) to create a bot and obtain its token.

Once you have the token, clone this repository to your local machine:

```
git clone https://github.com/7flash/progressor-third11.git
```


Then create a file called `.env` in the root directory of the project and add the following line, replacing `YOUR_API_TOKEN` with the API token you obtained from Telegram:

```
BOT_TOKEN=YOUR_API_TOKEN
```


Next, install the dependencies:

```
deno cache --reload --lock=lock.json --lock-write mod.ts
```


Finally, run the bot using the following command:

```
deno run --allow-net --allow-env --allow-read --unstable main.ts
```
