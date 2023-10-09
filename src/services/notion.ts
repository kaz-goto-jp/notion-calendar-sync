import { INotionDatabaseClient, NotionQueryResult } from "../apiClients/notion/database";
import { INotionDatabaseEntity } from "../entities/notion/database";
import { INotionUserClient } from "../apiClients/notion/user";
import { NotionBot } from "../singleton/notion/bot";
import { NotionPageEntity } from "../entities/notion/page";
import { Block } from "notion-api-types/responses";
import { INotionPageClient } from "../apiClients/notion/page";
import { ICalendarEventEntity } from "../entities/calendar/event";
import { dateHelper } from "../helpers/date";
import { config } from "../config/config";

export class NotionService {

    constructor(
        private databaseClient: INotionDatabaseClient,
        private pageClient: INotionPageClient,
        private userClient: INotionUserClient
    ) {}

    getDatabase(id: string): INotionDatabaseEntity {
        return this.databaseClient.fetch(id);
    }

    instantiateBot() {
        NotionBot.createInstance(this.userClient.getBotUser());
    }

    updateGoogleColumnOf(database: INotionDatabaseEntity): void {
        if (database.doesntHaveGoogleCalendarIdColumn) {
            const properties = {
                properties: {
                    [config.notion.googleCalendarIdColumn]: {'rich_text': {}}
                }
            };

            const result = this.databaseClient.updateWith(database.id, properties);

            if (result.success) {
                Logger.log(`added ${config.notion.googleCalendarIdColumn} column to the notion database!`);
            }
        }
    }

    findTargetPagesOf(database: INotionDatabaseEntity, start_cursor?: string): NotionPageEntity[] {
        const query = {
            filter: {
                and: [
                    {timestamp: 'last_edited_time', last_edited_time: {after: dateHelper.getPreviousIntervalDate().toJSON()}}
                ]
            }
        };

        if (start_cursor !== undefined) {
            query['start_cursor'] = start_cursor;
        }

        const fetchedResult: NotionQueryResult = this.databaseClient.fetchWith(database.id, query);

        if (fetchedResult === null || fetchedResult === undefined) return;

        const fetchedPages: NotionPageEntity[] = fetchedResult.results
                                        .filter((item: Block | NotionPageEntity ) => item.object === 'page')
                                        .filter((item: NotionPageEntity) => item.isNotUpdatedByBot) as NotionPageEntity[];
        
        const pages: NotionPageEntity[] = [];

        if (fetchedPages !== null && fetchedPages.length) {
            pages.push(...fetchedPages);
        }

        if (fetchedResult.has_more) {
            const morePages = this.findTargetPagesOf(database, fetchedResult.next_cursor);
            pages.push(...morePages);
        }

        return pages;
    }

    updateGoogleCalendarId(page: NotionPageEntity, calendar: ICalendarEventEntity) {
        const calendarId = calendar !== null ? calendar.id : '';
        return this.pageClient.updateGoogleCalendarId(page.id, calendarId);
    }
}
