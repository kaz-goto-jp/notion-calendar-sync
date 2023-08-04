import { NotionService } from "./services/notion";
import { NotionPageEntity } from "./entities/notion/page";
import { CalendarService } from "./services/calendar"
import { GoogleCalendarClient } from "./apiClients/calendar/googleCalendar/calendar";
import { NotionDatabaseClient } from "./apiClients/notion/database";
import { NotionUserClient } from "./apiClients/notion/user";
import { EmptyNotionDatabaseEntity } from "./entities/notion/database";

function main() {
    const notionService = new NotionService(new NotionDatabaseClient(), new NotionUserClient());
    const calendarService = new CalendarService(new GoogleCalendarClient());

    notionService.instantiateBot();

    const notionPages: NotionPageEntity[] = config.notion.databases.flatMap(
        (database: config.NotionDatabase) => {
            const notionDatabase = notionService.getDatabase(database.id);

            if (notionDatabase instanceof EmptyNotionDatabaseEntity){
                return [];
            }

            notionService.updateGoogleColumnOf(notionDatabase);
            return  notionService.findTargetPagesOf(notionDatabase);
        }
    );

    const calendar = calendarService.getCalendar(config.calendar.google.id);

    notionPages.forEach(
        (page: NotionPageEntity) => {
            const googleCalendarEvent = calendarService.createOrUpdateEventWithNotionPage(calendar, page);
            page.updateGoogleCalendarId(googleCalendarEvent);
        }
    )
}
