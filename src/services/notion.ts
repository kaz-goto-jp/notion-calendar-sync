import { INotionDatabaseClient, NotionDatabaseClient, NotionQueryResult } from "../apiClients/notion/database";
import { INotionDatabaseEntity, NotionDatabaseEntity } from "../entities/notion/database";
import { INotionUserClient, NotionUserClient } from "../apiClients/notion/user";
import { NotionBot } from "../singleton/notion/bot";
import { NotionPageEntity } from "../entities/notion/page";
import { Block } from "notion-api-types/responses";

export class NotionService {

    constructor(
        private databaseClient: INotionDatabaseClient,
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
}
