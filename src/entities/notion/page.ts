import { File, Page, Parent, User } from "notion-api-types/responses";
import { External } from "notion-api-types/responses/files";
import { Emoji } from "notion-api-types/responses/global";
import type { Title, Date as NotionDate, RichText } from "notion-api-types/responses/properties/page";
import { NotionBot } from "../../singleton/notion/bot";
import { config } from "../../config/config";

interface Status {
    id: string;
    type: "status";
    status: {id: string, name: string, color: string};
}


type NotionPageProperties = Page["properties"]
    & {
        [key: string]: Status
    }

export class NotionPageEntity implements Page {
    object: "page";
    properties: NotionPageProperties;
    icon: File | Emoji;
    cover: External;
    parent: Parent;
    url: string;
    id: string;
    created_time: string;
    created_by: Pick<User, "object" | "id">;
    last_edited_time: string;
    last_edited_by: Pick<User, "object" | "id">;
    archived: boolean;

    constructor(private original: Page) {
        for (const key in original) {
            this[key] = original[key];
        }
    }

    get googleCalendarId(): string {
        return (this.properties[config.notion.googleCalendarIdColumn] as RichText).rich_text[0].plain_text;
    }

    get hasGoogleCalendarId(): boolean {
        return (this.properties[config.notion.googleCalendarIdColumn] as RichText).rich_text.length === 0
    }

    get status(): string {
        return (this.properties[config.notion.properties.status] as Status).status.name;
    }

    get isDeleted(): boolean {
        return this.status === 'Deleted';
    }

    get isNotUpdatedByBot(): boolean {
        return this.last_edited_by.id !== NotionBot.getInstance().bot.id
    }

    get title(): string {
        return (this.properties[config.notion.properties.title] as Title).title[0].plain_text;
    }

    get startDate(): Date {
        return new Date((this.properties[config.notion.properties.date] as NotionDate).date.start);
    }
}
