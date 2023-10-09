import { expect, jest, test } from "@jest/globals";
import { NotionClientHelper } from "./notionClient";

UrlFetchApp = jest.fn() as unknown as typeof UrlFetchApp;
UrlFetchApp.fetch = jest.fn(() => ({})) as unknown as typeof UrlFetchApp.fetch;

Utilities = jest.fn() as unknown as typeof Utilities;
Utilities.sleep = jest.fn();

jest.mock("../config/config", () => ({
    config: {
        notion: {
            secret: 'test',
        }
    }
}));

test('fetch() succeeds', () => {
    const result = NotionClientHelper.fetch('url', {headers: {some: 'a header'}});
    expect(result).toEqual({});
})
