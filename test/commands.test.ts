import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { TelegramBot } from "https://deno.land/x/telegram_bot_api/mod.ts";
import { SetLanguageCommand } from "../commands.ts";
import { Context } from "../context.ts";
import { InMemoryUserStorage } from "../user.ts";

const bot = {
    sendMessage: () => { },
} as unknown as TelegramBot;

Deno.test("SetLanguageCommand sets user language", async () => {
    const users = new InMemoryUserStorage();
    const user = await users.createUser({});
    const context = new Context(bot, user);

    // Mock user input
    context.waitForMessage = async () => {
        await Promise.resolve();
        return "Russian";
    }

    const command = new SetLanguageCommand(user);
    await command.execute(context);

    assertEquals(user.language, "Russian");
});

Deno.test("SetLanguageCommand throws error for invalid language", async () => {
    const users = new InMemoryUserStorage();
    const user = await users.createUser({});
    const context = new Context(bot, user);

    // Mock user input
    context.waitForMessage = async () => {
        await Promise.resolve();
        return "French"; // Invalid language
    }

    const command = new SetLanguageCommand(user);
    await assertThrowsAsync(async () => {
        await command.execute(context);
    });
});

async function assertThrowsAsync(fn: () => Promise<void>) {
    try {
        await fn();
    } catch (_) {
        return;
    }
    throw new Error(`Expected error to be thrown but no error was thrown.`);
}
