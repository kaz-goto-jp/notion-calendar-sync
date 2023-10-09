import { expect, test } from '@jest/globals';
import { dateHelper } from './date';
import { constant } from '../constant';


test('getPreviousIntervalDate succeeds', () => {
    const differenceBetweenDates = new Date().valueOf() - dateHelper.getPreviousIntervalDate().valueOf();
    expect(differenceBetweenDates).toBe(constant.interval);
})