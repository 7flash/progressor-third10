import { Context } from "./context.ts";
import { User } from './user.ts';
import { buildInlineKeyboard } from "./layout.ts";

interface Command {
    execute(context: Context): Promise<void>;
}

export class SetLanguageCommand implements Command {
    constructor(public user: User) { }

    async execute(context: Context): Promise<void> {
        const layout = buildInlineKeyboard(['English', 'Russian']);
        await context.sendLayout("Please enter your preferred language:", layout);
        const language = await context.waitForCallbackQuery();
        console.log('execute/language', language);
        const languages = ['English', 'Russian'];
        if (!languages.includes(language)) {
            throw new Error('Invalid language');
        }
        this.user.language = language;
    }
}

export class SetNameCommand implements Command {
    constructor(public user: User) { }

    messages: Record<string, string> = {
        English: 'Please enter your name:',
        Russian: 'Пожалуйста, введите ваше имя:',
    };

    async execute(context: Context): Promise<void> {
        const language = this.user.language ?? 'English';

        await context.sendMessage(this.messages[language]);

        const name = await context.waitForMessage();
        if (name.trim() === '') {
            throw new Error('Invalid name');
        }

        this.user.name = name.trim();
    }
}

export class SetSexCommand implements Command {
    constructor(public user: User) { }

    messages: Record<string, string> = {
        English: 'Please select your sex:',
        Russian: 'Пожалуйста, выберите ваш пол:',
    };

    async execute(context: Context): Promise<void> {
        const language = this.user.language ?? 'English';

        const layout = buildInlineKeyboard(['Male', 'Female']);
        await context.sendLayout(this.messages[language], layout);

        const sex = await context.waitForCallbackQuery();
        console.log('execute/sex', sex);

        if (sex !== 'Male' && sex !== 'Female') {
            throw new Error('Invalid sex');
        }

        this.user.sex = sex;
    }
}
