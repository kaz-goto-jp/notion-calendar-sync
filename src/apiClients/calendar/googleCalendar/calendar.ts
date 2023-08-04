import { ICalendarEventEntity } from "../../../entities/calendar/event";
import { GoogleCalendarCalendarEntity } from "../../../entities/calendar/googleCalendar/calendar";
import { GoogleCalendarEventEntity } from "../../../entities/calendar/googleCalendar/event";
import { NotionPageEntity } from "../../../entities/notion/page";
import { ICalendarClient } from "../calendar";

export class GoogleCalendarClient implements ICalendarClient {
    getCalendar(id: string): GoogleCalendarCalendarEntity {
        return new GoogleCalendarCalendarEntity(CalendarApp.getCalendarById(id));
    }

    createEventFromNotionPage(calendar: GoogleCalendarCalendarEntity, notionPage: NotionPageEntity): ICalendarEventEntity {
        // While not the best approach due to the direct interaction with the Google Calendar API in the entity,
        // I've chosen this approach because it centralizes calendar retrieval and avoids redundant calls to
        // `getCalendar()` in every method call.
        const googleCalendarEvent = calendar.googleCalendar.createAllDayEvent(
            notionPage.title,
            notionPage.startDate,
            {description: notionPage.url}
        );
        return new GoogleCalendarEventEntity(googleCalendarEvent);
    }


    /**
     * Since using [Advance Calendar Service](https://developers.google.com/apps-script/advanced/calendar) would be more complicated,
     * 'updating' an event is to delete the existing event and create a new one.
     */
    updateEventWithNotionPage(calendar: GoogleCalendarCalendarEntity, notionPage: NotionPageEntity): GoogleCalendarEventEntity {

        // @see googleCalendarEvent in createEventFromNotionPage()
        const deletingEvent = calendar.googleCalendar.getEventById(notionPage.googleCalendarId);

        if (deletingEvent !== null) {
            try {
                deletingEvent.deleteEvent();
            } catch (error) {
                // Proceed to event creation even if deleting fails
                Logger.log(`ERROR: ${error}`);
            }
        }

        return notionPage.isDeleted ? null : this.createEventFromNotionPage(calendar, notionPage);
    }
}