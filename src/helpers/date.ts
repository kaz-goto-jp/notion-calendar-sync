import { constant } from "../constant";

export namespace dateHelper {
    let currentDate: Date;
    export function getPreviousIntervalDate(): Date {
        if (currentDate === undefined) {
            const now = Date.now();
            currentDate = new Date(now - constant.interval);
        }
        return currentDate;
    }
}
