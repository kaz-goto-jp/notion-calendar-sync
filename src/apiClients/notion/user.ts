import { constant } from "../../constant";
import { NotionClientHelper } from "../../helpers/notionClient";
import { Bot } from "notion-api-types/responses/users";

export interface INotionUserClient {
    getBotUser(): Bot;
}

export class NotionUserClient implements INotionUserClient {
    getBotUser(): Bot {
        const result = NotionClientHelper.fetch(
            `${constant.notion.url.bot}`,
            {
                headers: NotionClientHelper.headers,
                method: 'get',
                muteHttpExceptions: true
            }
        );

        if (result.getResponseCode() !== 200) {
            throw new Error(`ERROR: ${result.getContentText()}`);
        }

        return JSON.parse(result.getContentText());
    }
}
