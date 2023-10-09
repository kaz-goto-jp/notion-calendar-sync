import { Database, DatabaseProperty, File, User } from "notion-api-types/responses";
import { External } from "notion-api-types/responses/files";
import { Emoji } from "notion-api-types/responses/global";
import { PageId, Workspace } from "notion-api-types/responses/parents";
import { Text } from "notion-api-types/responses/rich-texts";
import { config } from "../../config/config";

export interface INotionDatabaseEntity extends Database {
    object: "database";
    title: [Text];
    properties: { [key: string]: DatabaseProperty; };
    icon: File | Emoji;
    cover: External;
    parent: PageId | Workspace;
    url: string;
    id: string;
    created_time: string;
    created_by: Pick<User, "object" | "id">;
    last_edited_time: string;
    last_edited_by: Pick<User, "object" | "id">;
    archived: boolean;
    readonly hasGoogleCalendarIdColumn: boolean;
    readonly doesntHaveGoogleCalendarIdColumn: boolean;
}

abstract class NotionDatabaseBase implements INotionDatabaseEntity {
    object: "database";
    title: [Text];
    properties: { [key: string]: DatabaseProperty; };
    icon: File | Emoji;
    cover: External;
    parent: PageId | Workspace;
    url: string;
    id: string;
    created_time: string;
    created_by: Pick<User, "object" | "id">;
    last_edited_time: string;
    last_edited_by: Pick<User, "object" | "id">;
    archived: boolean;

    private _hasGoogleCalendarIdColumn: boolean;
    public get hasGoogleCalendarIdColumn(): boolean {
        return this._hasGoogleCalendarIdColumn;
    }
    private _doesntHaveGoogleCalendarIdColumn: boolean;
    public get doesntHaveGoogleCalendarIdColumn(): boolean {
        return this._doesntHaveGoogleCalendarIdColumn;
    }
}

export class NotionDatabaseEntity extends NotionDatabaseBase {
    constructor(private original: Database) {
        super();
        for (const key in original) {
            this[key] = original[key];
        }
    }

    get hasGoogleCalendarIdColumn() {
        return config.notion.googleCalendarIdColumn in this.properties
    }

    get doesntHaveGoogleCalendarIdColumn() {
        return !this.hasGoogleCalendarIdColumn
    }
}

export class EmptyNotionDatabaseEntity extends NotionDatabaseBase {
}
