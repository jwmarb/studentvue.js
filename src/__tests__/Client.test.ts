import { XMLParser } from 'fast-xml-parser';
import StudentVue, { Client } from '../index';
import { StudentInfo } from '../StudentVue/Client/Client.interfaces';
import RequestException from '../StudentVue/RequestException/RequestException';
import { SchoolDistrict } from '../StudentVue/StudentVue.interfaces';
import url from 'url';
import readable from '../utils/readable';
import Message from '../StudentVue/Message/Message';
jest.setTimeout(60000);

/**
 * Add your user credentials from credentials.json
 * The JSON must be formatted like this:
 * {
 *  "username": "myUsername",
 *  "password": "myPassword",
 *  "district": "https://student.tusd1.org/"
 * }
 */
import credentials from './credentials.json';
import { Calendar } from '../StudentVue/Client/Interfaces/Calendar';
import { isThisMonth } from 'date-fns';
import ResourceType from '../Constants/ResourceType';
import { FileResource, Gradebook, Resource, URLResource } from '../StudentVue/Client/Interfaces/Gradebook';
import { Attendance, PeriodInfo } from '../StudentVue/Client/Interfaces/Attendance';

jest.spyOn(StudentVue, 'login').mockImplementation((districtUrl, credentials) => {
  const host = url.parse(districtUrl).host;
  const endpoint: string = `https://${host}/Service/PXPCommunication.asmx`;
  const client = new Client(
    { username: credentials.username, password: credentials.password, districtUrl: endpoint },
    `https://${host}/`
  );
  return Promise.resolve([client, null as any]);
});

let client: Client;
let messages: Message[];
let calendar: Calendar;
let gradebook: Gradebook;
let attendance: Attendance;

let resources: (URLResource | FileResource)[];

beforeAll(() => {
  return StudentVue.login(credentials.district, {
    username: credentials.username,
    password: credentials.password,
  })
    .then(([session]) => {
      return Promise.all([
        session,
        session.messages(),
        session.calendar({ interval: { start: Date.now(), end: Date.now() } }),
        session.gradebook(),
        session.attendance(),
      ]);
    })
    .then(([session, _messages, _calendar, _gradebook, _attendance]) => {
      calendar = _calendar;
      client = session;
      gradebook = _gradebook;
      messages = _messages;
      attendance = _attendance;
      resources = gradebook.courses
        .map((course) => course.marks.map((mark) => mark.assignments.map((assignment) => assignment.resources)))
        .flat(4);
      client = session;
    });
});

describe('User Info', () => {
  let studentInfo: StudentInfo;
  beforeAll(async () => {
    studentInfo = await client.studentInfo();
    return studentInfo;
  });
  it('Is defined', async () => {
    expect(studentInfo).toBeDefined();
  });
});

describe.only('User Messages', () => {
  it('Message content greater than 200 characters', () => {
    const lessThan100Chars: Message[] = [];
    for (const msg of messages) {
      if (msg.htmlContent.length < 100) lessThan100Chars.push(msg);
    }
    expect(lessThan100Chars.length).toBe(0);
    console.log(lessThan100Chars);
  });
  it('Fetches a list of messages', () => {
    expect(messages).toBeDefined();
  });

  it('Messages are an instance of Message class', async () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    expect(randomMessage).toBeInstanceOf(Message);
  });

  it('Message is marked as read', async () => {
    const unreadMessages = messages.filter((msg) => !msg.isRead());
    const unreadMessage = unreadMessages[0];
    if (unreadMessage == null) return console.warn('No unread messages found on account. Skipping test...');
    const beforeMarkAsRead = unreadMessage.isRead();

    await unreadMessage.markAsRead();

    // fetch from server again to make sure it is marked as read
    const newMessages = await client.messages();
    const updated = newMessages.find((msg) => msg.id === unreadMessage.id);
    expect(updated!.isRead()).toBe(true);
    expect(unreadMessage.isRead()).toBe(true);
    expect(beforeMarkAsRead).toBe(false);
  });

  it('Message attachment has base64 string', async () => {
    const withAttachment = messages.filter((msg) => msg.attachments.length > 0);
    if (withAttachment.length === 0) return console.warn('No messages with an attachment. Skipping test...');
    const attachment = withAttachment[0].attachments[0];

    expect(attachment.fileExtension).toBeTruthy();

    const base64 = await attachment.get();

    expect(base64).toMatch(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/); // validates base64
  });
});

describe('Calendar events', () => {
  it('is defined', async () => {
    expect(calendar).toBeDefined();
  });

  it('is events of this month', async () => {
    expect(isThisMonth(calendar.outputRange.start)).toBe(true);
    expect(isThisMonth(calendar.outputRange.end)).toBe(true);
  });
});

describe('Gradebook', () => {
  it('fetches gradebook with matching type', async () => {
    expect(gradebook).toBeDefined();
    expect(gradebook.error).toBeFalsy();
    expect(gradebook.courses.length).toBeGreaterThan(0);
    expect(gradebook.reportingPeriod.current.index).toEqual(expect.any(Number));
    expect(gradebook.reportingPeriod.available).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ index: expect.any(Number) })])
    );
    expect(resources).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: ResourceType.URL }),
        expect.objectContaining({ type: ResourceType.FILE }),
      ])
    );
  });

  it('resources have a valid URI', () => {
    expect(resources).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ file: expect.objectContaining({ uri: expect.any(String) }) })])
    );
  });

  it('URL resources have a URL', () => {
    if (resources.some((rsrc) => rsrc.type !== ResourceType.URL))
      return console.warn('No URL resources found. Skipping...');
    expect(resources).toStrictEqual(
      expect.arrayContaining([expect.objectContaining<Partial<URLResource>>({ url: expect.any(String) })])
    );
  });
});

describe('Attendance', () => {
  it('is defined', async () => {
    expect(attendance).toBeDefined();
  });
  it('periods are numbers', async () => {
    expect(attendance.periodInfos).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining<Partial<PeriodInfo>>({
          period: expect.any(Number),
        }),
      ])
    );
  });
});
