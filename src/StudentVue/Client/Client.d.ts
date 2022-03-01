import { LoginCredentials } from '../../utils/soap/Client/Client.interfaces';
import soap from '../../utils/soap/soap';
import { StudentInfo } from './Client.interfaces';
import Message from '../Message/Message';
import { Calendar, CalendarOptions } from './Interfaces/Calendar';
import { Gradebook } from './Interfaces/Gradebook';
import { Attendance } from './Interfaces/Attendance';
export default class Client extends soap.Client {
    private hostUrl;
    constructor(credentials: LoginCredentials, hostUrl: string);
    /**
     * Returns the attendance of the student
     * @returns Returns an Attendance object
     * @example
     * ```js
     * client.attendance()
     *  .then(console.log); // -> { type: 'Period', period: {...}, schoolName: 'University High School', absences: [...], periodInfos: [...] }
     * ```
     */
    attendance(): Promise<Attendance>;
    /**
     * Returns the gradebook of the student
     * @param reportingPeriodIndex The timeframe that the gradebook should return
     * @returns Returns a Gradebook object
     * @example
     * ```js
     * const gradebook = await client.gradebook();
     * console.log(gradebook); // { error: '', type: 'Traditional', reportingPeriod: {...}, courses: [...] };
     *
     * await client.gradebook(0) // Some schools will have ReportingPeriodIndex 0 as "1st Quarter Progress"
     * await client.gradebook(7) // Some schools will have ReportingPeriodIndex 7 as "4th Quarter"
     * ```
     */
    gradebook(reportingPeriodIndex?: number): Promise<Gradebook>;
    messages(): Promise<Message[]>;
    /**
     * Gets the info of a student
     * @returns StudentInfo object
     * @example
     * ```js
     * studentInfo().then(console.log) // -> { student: { name: 'Evan Davis', nickname: '', lastName: 'Davis' }, ...}
     * ```
     */
    studentInfo(): Promise<StudentInfo>;
    private fetchEventsWithinInterval;
    /**
     *
     * @param options Options to provide for calendar method. This is optional
     * @returns Returns a Calendar object
     * @example
     * ```js
     * client.calendar({ interval: { start: new Date('5/1/2022'), end: new Date('8/1/2021') }, concurrency: null }); // -> Limitless concurrency (not recommended)
     *
     * const calendar = await client.calendar();
     * console.log(calendar); // -> { schoolDate: {...}, outputRange: {...}, events: [...] }
     * ```
     */
    calendar(options: CalendarOptions): Promise<Calendar>;
}
