import { NotionPageEntity } from "../../notion/page";
import { ICalendarEntity } from "../calendar";
import { GoogleCalendarEventEntity } from "./event";

export class GoogleCalendarCalendarEntity implements ICalendarEntity {
    readonly id: string;

    constructor(readonly googleCalendar: GoogleAppsScript.Calendar.Calendar) {
        this.id = googleCalendar.getId();
    }

    createEventFromNotionPage(notionPage: NotionPageEntity): GoogleCalendarEventEntity {
        const googleCalendarEvent = this.googleCalendar.createAllDayEvent(
            notionPage.title,
            notionPage.startDate,
            {description: notionPage.url}
        );
        return new GoogleCalendarEventEntity(googleCalendarEvent);
    }

    /**
     * Since using [Advance Calendar Service](https://developers.google.com/apps-script/advanced/calendar) would be more complicated,
     * the 'update' of an event is to delete the existing event and create a new one.
     */
    updateEventWithNotionPage(notionPage: NotionPageEntity): GoogleCalendarEventEntity {
        const deletingEvent = this.googleCalendar.getEventById(notionPage.googleCalendarId);

        if (deletingEvent !== null) {
            try {
                deletingEvent.deleteEvent();
            } catch (error) {
                // Continue to create an event even if it is failed to delete an event from the calendar
                Logger.log(`ERROR: ${error}`);
            }
        }

        return notionPage.isDeleted ? null : this.createEventFromNotionPage(notionPage);
    }

    createOrUpdateWithNotionPage(notionPage: NotionPageEntity): GoogleCalendarEventEntity {
        return notionPage.hasGoogleCalendarId
                ? this.createEventFromNotionPage(notionPage)
                : this.updateEventWithNotionPage(notionPage);
    }
}
