import { ICalendarEventEntity } from "../event";

export class GoogleCalendarEventEntity implements ICalendarEventEntity {
    readonly id: string;

    constructor(googleEvent: GoogleAppsScript.Calendar.CalendarEvent) {
        this.id = googleEvent.getId();
    }
}
