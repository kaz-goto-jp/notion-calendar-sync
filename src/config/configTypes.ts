export type CalendarConfig = {[key: string]: {id: string}};
export type NotionDatabase = {id: string};
export type NotionProperties = {
    title: string,
    date: string,
    status: string
};
export type NotionConfig = {
    secret: string,
    databases: NotionDatabase[],
    properties: NotionProperties,
    googleCalendarIdColumn: string
}