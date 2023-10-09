import { constant } from "../../constant";
import { config } from "../../config/config";
import { NotionClientHelper } from "../../helpers/notionClient";

export interface INotionPageClient {
    updateGoogleCalendarId(pageId: string, calendarId: string): void;
}

export class NotionPageClient implements INotionPageClient {
    updateGoogleCalendarId(pageId: string, calendarId: string): void {
        const result = NotionClientHelper.fetch(
            `${constant.notion.url.page}/${pageId}`,
            {
                headers: NotionClientHelper.headers,
                method: 'patch',
                payload: JSON.stringify({
                    properties: {
                        [config.notion.googleCalendarIdColumn]: {
                            rich_text: [{text: {content: calendarId}}]
                        }
                    }
                }),
                muteHttpExceptions: true
            }
        );

        if (result.getResponseCode() !== 200) {
            Logger.log(`ERROR: ${result.getContentText()}`);
        }
    }
}
