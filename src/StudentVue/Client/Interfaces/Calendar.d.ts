import EventType from '../../../Constants/EventType';

/**
 * Options to provide in `Client.calendar()` method
 */
export declare interface CalendarOptions {
  /**
   * The interval between two dates in the calendar
   */
  interval: {
    /**
     * The start interval
     */
    start: Date | number;

    /**
     * The end interval
     */
    end: Date | number;
  };

  /**
   * The number of fetches that should occur per asynchronous task. StudentVUE does not send ALL events within a school year, but rather it sends all events within a month.
   * @description
   * ```js
   * // { concurrency: 1 }
   * ```
   * Fetch events of one month at a time
   *
   * ```js
   * // { concurrency: 7 } -> this is the default
   * ```
   * Fetch events of 7 months at a time
   *
   * If you set concurrency to `8` or more, it will throw an error because it will time out
   */
  concurrency?: number | null;
}

/**
 * Calendar of the school
 */
export declare interface Calendar {
  /**
   * The date of the school
   */
  schoolDate: {
    /**
     * The date that indicates the start of school
     */
    start: Date | number;

    /**
     * The date that indicates the last day of school
     */
    end: Date | number;
  };

  /**
   * The date range of the events
   */
  outputRange: {
    /**
     * The beginning date of events range
     */
    start: Date | number;

    /**
     * The end date of events range
     */
    end: Date | number;
  };

  /**
   * The list of school events
   * @type {(AssignmentEvent | HolidayEvent | RegularEvent)[]}
   */
  events: (AssignmentEvent | HolidayEvent | RegularEvent)[];
}

/**
 * A school event
 */
export declare interface Event {
  /**
   * The date of the event
   */
  date: Date;

  /**
   * The title of the event
   */
  title: string;

  /**
   * The type of the event
   * @type {EventType}
   */
  type: EventType;

  /**
   * The time the event take places
   */
  startTime: string;
}

/**
 * An event that contains an assignment
 */
export declare interface AssignmentEvent extends Event {
  /**
   * The AGU of the event
   */
  agu?: string;

  /**
   * The link of the event
   */
  link?: string;

  /**
   * The DGU of the event
   */
  dgu?: string;

  /**
   * The view type of the event
   */
  viewType?: string;

  /**
   * The Add Link Data of the event
   */
  addLinkData?: string;
}

/**
 * An event that is held in a holiday. Students may not have school in this event
 */
export type HolidayEvent = Event

/**
 * An event that is not anything special, hence Regular. Synergy Server Maintenance event type uses this event
 */
export declare interface RegularEvent extends Event {
  /**
   * The AGU of the event
   */
  agu?: string;

  /**
   * The DGU of the event
   */
  dgu?: string;

  /**
   * The link of the event
   */
  link?: string;

  /**
   * The type of view in the event
   */
  viewType?: string;

  /**
   * The Add Link Data of the event
   */
  addLinkData?: string;

  /**
   * The description of the event
   */
  description?: string;
}
