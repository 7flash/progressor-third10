import { UpdateType } from "https://deno.land/x/telegram_bot_api/mod.ts";
import { bot } from './bot.ts'
import { SetLanguageCommand, SetNameCommand, Command, SetSexCommand } from "./commands.ts";
import { Context } from "./context.ts";
import { InMemoryUserStorage, User } from "./user.ts";

interface Message {
    message_id: number;
    text?: string;
    chat: {
        id: number;
    };
}

const users: InMemoryUserStorage = new InMemoryUserStorage();
const contexts = new Map<number, Context>();

const commands = [
    { command: "/start", description: "Start the bot" },
    { command: "/help", description: "Get help" },
];

await bot.setMyCommands({
    commands: commands.map(({ command, description }) => ({ command, description })),
});

async function executeCommand<T extends Command>(
    user: User,
    context: Context,
    CommandConstructor: new (user: User) => T,
): Promise<void> {
    const command = new CommandConstructor(user);
    await command.execute(context);
    await users.updateUser(command.user);
}

bot.on(UpdateType.Message, async ({ message }) => {
    try {
        const { chat } = message;
        if (!chat) {
            console.error("Error processing message: chat is undefined or null");
            return;
        }

        const { id: userId } = message.from!;
        const { id: chatId } = chat;
        const text = message?.text || "";
        console.log('message', userId, chatId, text);

        let context = contexts.get(Number(userId));

        if (!context) {
            // if user is not in the users list, create a new context
            let user = await users.getUser(Number(userId));
            if (!user) {
                user = await users.createUser({
                    chatId: String(chatId),
                });
            }
            context = new Context(bot, user);
            contexts.set(userId, context);

            await Promise.resolve()
                .then(() => executeCommand(user!, context!, SetLanguageCommand))
                .then(() => executeCommand(user!, context!, SetNameCommand))
                .then(() => executeCommand(user!, context!, SetSexCommand))
                .catch((err) => {
                    throw `${err} (User ${user?.id})`;
                });

            context.sendMessage(`Welcome to the character creation bot.`);
            return;
        }

        // if context is waiting for a message
        if (context.messageHandler) {
            context.messageHandler(text);
            return;
        }
    } catch (err) {
        console.error(`Error processing message: ${err}`);
    }
});

interface CallbackQuery {
    callback_query: {
        message?: {
            chat?: { id: number };
            message_id?: number;
            text?: string;
        };
        data: string;
    };
}

bot.on(UpdateType.CallbackQuery, ({ callback_query }: CallbackQuery) => {
    try {
        const { message, data } = callback_query!;

        const { chat } = message!;
        if (!chat) {
            console.error("Error processing message: chat is undefined or null");
            return;
        }

        const { id: userId } = message!.from!;
        const { id: chatId } = chat;
        console.log('callbackQuery', userId, chatId, data);

        if (userId != 6263297236) {
            throw 'remember userId is unknown in the callback by default'
        }

        const context = contexts.get(chatId);
        if (!context) {
            throw new Error(`User in chat ${chatId} has no context.`);
        }

        if (context.callbackQueryHandler) {
            context.callbackQueryHandler(data);
        }
    } catch (err) {
        console.error(`Error processing callback query: ${err}`);
    }
});

bot.run({
    polling: true,
});
