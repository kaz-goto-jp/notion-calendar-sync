export namespace NotionClientHelper {
    export const headers: GoogleAppsScript.URL_Fetch.HttpHeaders = {
        'Authorization': `Bearer ${constant.notion.secret}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
    };

    export const fetch = (url: string, request: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.HTTPResponse => {
        const result = UrlFetchApp.fetch(url, request);
        // wait for a while to avoid hitting Notion request limitation
        Utilities.sleep(500);
        return result;
    }
}
