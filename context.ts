import { InlineKeyboardButton, TelegramBot } from "https://deno.land/x/telegram_bot_api/mod.ts";
import { User } from "./user.ts";

export class Context {
    private currentStep = 0;

    constructor(
        readonly bot: TelegramBot,
        readonly user: User,
    ) { }

    async sendMessage(text: string) {
        const sentMessage = await this.bot.sendMessage({
            chat_id: this.user.chatId!,
            text,
        });
        if (!sentMessage) {
            console.error("Failed to send message");
        }
        return sentMessage;
    }

    async sendLayout(text: string, inlineKeyboard: InlineKeyboardButton[][]) {
        const sentMessage = await this.bot.sendMessage({
            chat_id: this.user.chatId!,
            text,
            reply_markup: {
                inline_keyboard: inlineKeyboard,
            }
        });
        if (!sentMessage) {
            console.error("Failed to send message");
        }
        return sentMessage;
    }

    async editMessageText(messageId: number, text: string) {
        const result = await this.bot.editMessageText({
            chat_id: this.user.chatId,
            message_id: messageId,
            text: text,
        });
        if (!result) {
            console.error("Failed to edit message");
        }
        return result;
    }

    messageHandler: ((message: string) => void) | null = null;
    callbackQueryHandler: ((data: string) => void) | null = null;

    waitForMessage(): Promise<string> {
        return new Promise((resolve) => {
            const handler = (message: string) => {
                this.messageHandler = null;
                resolve(message);
            };
            this.messageHandler = handler;
            setTimeout(() => {
                this.messageHandler = null;
                resolve("");
            }, 60000); // 60 second timeout
        });
    }

    waitForCallbackQuery(): Promise<string> {
        return new Promise((resolve) => {
            const handler = (data: string) => {
                this.callbackQueryHandler = null;
                resolve(data);
            };
            this.callbackQueryHandler = handler;
            setTimeout(() => {
                this.callbackQueryHandler = null;
                resolve("");
            }, 60000); // 60 second timeout
        });
    }
}
