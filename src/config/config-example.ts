import { CalendarConfig, NotionConfig } from "./configTypes";

/** 
 * !!!!!! COPY/RENAME THIS FILE AND CHANGE THE NAMESPACE NAME TO 'config' !!!!!
*/
export namespace config_example {
    // Calendar
    export const calendar: CalendarConfig = {
        google: {
            id: 'Your Google Calendar ID'
        }
    };

    // Notion
    export const notion: NotionConfig = {
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
    };
}