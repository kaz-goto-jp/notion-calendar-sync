import { ICalendarEntity } from "../../entities/calendar/calendar";
import { ICalendarEventEntity } from "../../entities/calendar/event";
import { NotionPageEntity } from "../../entities/notion/page";

export interface ICalendarClient {
    getCalendar(id: string): ICalendarEntity;
    
    createEventFromNotionPage(calendar: ICalendarEntity, notionPage: NotionPageEntity): ICalendarEventEntity;

    updateEventWithNotionPage(calendar: ICalendarEntity, notionPage: NotionPageEntity): ICalendarEventEntity;
}