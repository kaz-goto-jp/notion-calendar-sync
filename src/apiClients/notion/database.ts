import { NotionClientHelper } from "../../helpers/notionClient";
import { EmptyNotionDatabaseEntity, INotionDatabaseEntity, NotionDatabaseEntity } from "../../entities/notion/database";
import { NotionPageEntity } from "../../entities/notion/page";
import { Block, Page } from "notion-api-types/responses";
import { constant } from "../../constant";

export type NotionQueryResult = {
    "object": string,
    "results": (NotionPageEntity | Block)[],
    "next_cursor": any,
    "has_more": boolean,
    "type": string,
    "page_or_database": any
 };

export interface INotionDatabaseClient {
    fetch(id: string): INotionDatabaseEntity;
    fetchWith(id: string, query: {}): NotionQueryResult;
    // TODO: make a type for 'properties'
    updateWith(id: string, properties: {}): {success: boolean};
}

export class NotionDatabaseClient implements INotionDatabaseClient {
    fetch(id: string): INotionDatabaseEntity {
        const result = NotionClientHelper.fetch(
            `${constant.notion.url.database}/${id}`,
            {
                headers: NotionClientHelper.headers,
                muteHttpExceptions: true
            }
        );

        if (result.getResponseCode() !== 200) {
            Logger.log(`ERROR: ${result.getContentText()}`);
            return new EmptyNotionDatabaseEntity();
        }

        return new NotionDatabaseEntity(JSON.parse(result.getContentText()));
    }

    fetchWith(id: string, query: {}): NotionQueryResult {
        const result = NotionClientHelper.fetch(
            `${constant.notion.url.database}/${id}/query`,
            {
                headers: NotionClientHelper.headers,
                method: 'post',
                payload: JSON.stringify(query),
                muteHttpExceptions: true
            }
        );

        if (result.getResponseCode() !== 200) {
            Logger.log(`ERROR: ${result.getContentText()}`);
            return;
        }

        const jsonResult = JSON.parse(result.getContentText());
        
        jsonResult.results = jsonResult.results.map(
            (item: Block | Page) => item.object === 'page' ? new NotionPageEntity(item) : item
        );

        return jsonResult;
    }

    // TODO: make a type for 'properties'
    updateWith(id: string, properties: {}): {success: boolean} {
        const result = UrlFetchApp.fetch(
            `${constant.notion.url.database}/${id}`,
            {
                headers: NotionClientHelper.headers,
                method: 'patch',
                payload: JSON.stringify(properties),
                muteHttpExceptions: true
            }
        );

        if (result.getResponseCode() !== 200) {
            Logger.log(`ERROR: ${result.getContentText()}`);
            return {success: false};
        } else {
            return {success: true};
        }
    }
}