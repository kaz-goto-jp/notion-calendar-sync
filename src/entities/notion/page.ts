import { File, Page, PageProperty, Parent, User } from "notion-api-types/responses";
import { External } from "notion-api-types/responses/files";
import { Emoji } from "notion-api-types/responses/global";
import { NotionPageClient } from "../../apiClients/notion/page";
import type { Title, Date as NotionDate, RichText } from "notion-api-types/responses/properties/page";
import { GoogleCalendarEventEntity } from "../calendar/googleCalendar/event";
import { NotionBot } from "../../singleton/notion/bot";

export type NotionPageProperties = Page["properties"]
    & {
        [config.notion.properties.title]: Title,
        [config.notion.properties.date]: NotionDate,
        [config.notion.googleCalendarIdColumn]: RichText,
        [config.notion.properties.status]: {id: string, type: "status", status: {id: string, name: string, color: string}}
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
    
    private pageClient: NotionPageClient;

    constructor(private original: Page) {
        for (const key in original) {
            this[key] = original[key];
        }
        // TODO: DI
        this.pageClient = new NotionPageClient;
    }

    get googleCalendarId(): string {
        return this.properties[config.notion.googleCalendarIdColumn].rich_text[0].plain_text;
    }

    get hasGoogleCalendarId(): boolean {
        return this.properties[config.notion.googleCalendarIdColumn].rich_text.length === 0
    }

    updateGoogleCalendarId(calendar: GoogleCalendarEventEntity) {
        const calendarId = calendar !== null ? calendar.id : '';
        return this.pageClient.updateGoogleCalendarId(this.id, calendarId);
    }

    get status(): string {
        return this.properties[config.notion.properties.status].status.name;
    }

    get isDeleted(): boolean {
        return this.status === 'Deleted';
    }

    get isNotUpdatedByBot(): boolean {
        return this.last_edited_by.id !== NotionBot.getInstance().bot.id
    }

    get title(): string {
        return this.properties[config.notion.properties.title].title[0].plain_text;
    }

    get startDate(): Date {
        return new Date(this.properties[config.notion.properties.date].date.start);
    }
}
