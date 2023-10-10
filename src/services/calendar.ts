import { ICalendarClient } from "../apiClients/calendar/calendar";
import { ICalendarEntity } from "../entities/calendar/calendar";
import { ICalendarEventEntity } from "../entities/calendar/event";
import { GoogleCalendarCalendarEntity } from "../entities/calendar/googleCalendar/calendar";
import { NotionPageEntity } from "../entities/notion/page";

export class CalendarService {

    constructor(private calendarClient: ICalendarClient){}

    getCalendar(id: string): ICalendarEntity {
        return this.calendarClient.getCalendar(id);
    }

    createOrUpdateEventWithNotionPage(calendar: ICalendarEntity, notionPage: NotionPageEntity): ICalendarEventEntity {
        return notionPage.hasGoogleCalendarId
                ? this.calendarClient.updateEventWithNotionPage(calendar, notionPage)
                : this.calendarClient.createEventFromNotionPage(calendar, notionPage);
    }
}
