// deno-lint-ignore-file no-unused-vars
import { assertEquals, assertExists } from "https://deno.land/std/testing/asserts.ts";
import {
    TelegramBot,
    Update,
    UpdateType,
    EditMessageText,
    AnswerCallbackQuery,
    Message,
    MessageUpdate,
    CallbackQuery,
    SendMessage, // added import
} from "https://deno.land/x/telegram_bot_api/mod.ts";

import { Context } from "../context.ts";

class MockBot implements TelegramBot {
}

const bot = new MockBot();
const user = { id: 123, name: "John" };

Deno.test("waitForMessage", async () => {

});

Deno.test("waitForCallbackQuery", async () => {

});
