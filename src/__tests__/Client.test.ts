import { XMLParser } from 'fast-xml-parser';
import StudentVue, { Client } from '../StudentVue/StudentVue';
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

beforeAll(async () => {
  const [session] = await StudentVue.login(credentials.district, {
    username: credentials.username,
    password: credentials.password,
  });
  messages = await session.messages();
  client = session;

  return { client, messages };
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

describe('User Messages', () => {
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

describe.only('Calendar events', () => {
  it('gets all events within school year', async () => {
    // expect(calendar.events.length).toBeGreaterThan(0);
    const calendar = await client.calendar({ interval: { start: new Date('10/01/21'), end: new Date('5/01/22') } });
    console.log(calendar);
    expect(calendar).toBeDefined();
  });
});
