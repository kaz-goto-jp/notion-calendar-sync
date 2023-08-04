import { Bot } from "notion-api-types/responses/users";

export class NotionBot {
    private static _instance: NotionBot;

    private constructor(readonly bot: Bot) {}

    public static getInstance() {
        if (this._instance === undefined) {
            throw new Error('Bot not instantiated')
        }
        return this._instance;
    }

    public static createInstance(bot: Bot): void {
        if (this._instance !== undefined) {
            throw new Error('Bot already exists');
        }
        this._instance = new NotionBot(bot);
    }
}
