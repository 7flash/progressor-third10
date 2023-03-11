import { TelegramBot, UpdateType } from "https://deno.land/x/telegram_bot_api/mod.ts";

const botToken = Deno.env.get("BOT_TOKEN");
if (!botToken) {
    console.error("BOT_TOKEN environment variable is not provided");
    Deno.exit(1);
}

export const bot = new TelegramBot(botToken);