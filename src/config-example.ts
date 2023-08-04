/** 
 * !!!!!! COPY/RENAME THIS FILE AND CHANGE THE NAMESPACE NAME TO 'config' !!!!!
*/
namespace config_example {
    // Calendar
    type CalendarConfig = {[key: string]: {id: string}}
    export const calendar: CalendarConfig = {
        google: {
            id: 'Your Google Calendar ID'
        }
    } as const;

    // Notion
    export type NotionDatabase = {id: string};
    export const notion = {
        secret: 'Notion API Secret',
        databases: [
            {id: "database id"},
            {id: "another database id if you wish"},
        ],
        properties: {
            title: "name of your title colmn",
            date: "name of your date colmn",
            status: "name of your status colmn"
        },
        googleCalendarIdColumn: 'google-calendar-id' // Change the name of Google Calendar ID Column if you need to.
    } as const;
}