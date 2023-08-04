# Notion -> Google Calendar

This is a Google Apps Script project to sync Notion and Google Calendar.

## Important

- This is ONE WAY ONLY (only from Notion to Google Calendar). No sync from Google Calendar TO Notion (yet).
- This app would add 'google-calendar-id' to your Notion database. Please hide it if you don't need it to be displayed.

## Preparation

### Notion

This app requires Notion databases to have the following columns:

- Title
- Date
- Status
    - Add 'Deleted' as a property of 'Complete' if you wish an event to be deleted from Google Calendar.
        - Create [an advanced filter](https://www.notion.so/help/views-filters-and-sorts#add-an-advanced-filter) to hide these `deleted` pages.
        - As of Notion API Version 2022-06-28, there is no way to get archived pages withou ids.

### Google Clasp

Please check the [official documentation](https://github.com/google/clasp) to set up Clasp.

### Clasp settings

- Copy `.clasp-example.json` file as `.clasp.json` and change `scriptId` and `rootDir` accordingly.
- Change `timeZone` of `appsscript.json` to your timezone.

### Configurations

Copy `src/config-example.ts` file as `config.ts` and change all the secrets.

### Google Apps Script

Create a time based trigger of an hourly base (default) for `main` function.

## Appendix

### Quotas and Limits

#### Notion

https://developers.notion.com/reference/request-limits#size-limits

#### Google Apps Script

https://developers.google.com/apps-script/guides/services/quotas