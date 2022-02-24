import { XMLParser } from 'fast-xml-parser';
import StudentVue from '..';
import { StudentInfo } from '../StudentVue/Client/Client.interfaces';
import RequestException from '../StudentVue/RequestException/RequestException';
import { SchoolDistrict } from '../StudentVue/StudentVue.interfaces';

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

function readable(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

describe('StudentVue', () => {
  it('Gets school districts', async () => {
    try {
      const synergy = await StudentVue.findDistricts('85757');
      expect(synergy).toEqual(
        expect.arrayContaining<SchoolDistrict>([
          {
            id: '',
            name: 'Accelerated Learning Center',
            address: 'Phoenix AZ 85028',
            parentVueUrl: 'https://az-alc.edupoint.com/',
          },
          {
            id: '',
            name: 'Catalina Foothills Unified School District #16',
            address: 'Tucson AZ 85718',
            parentVueUrl: 'https://az-cfsd16.edupoint.com',
          },
        ])
      );
    } catch (e) {
      expect(e).toMatch('No corresponding districts');
    }
  });

  it('Throws an error on invalid zipcode', async () => {
    expect.assertions(1);
    try {
      await StudentVue.findDistricts('8888888888');
    } catch (e) {
      expect((e as RequestException).message).toEqual(
        'Please enter zip code with atleast 3 characters and not more than 5 characters.'
      );
    }
  });
  it('Returns an empty array if no districts found', async () => {
    expect.assertions(2);
    try {
      const notFound = await StudentVue.findDistricts('Word');
      expect(notFound).toBe(expect.arrayContaining<SchoolDistrict>([]));
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('Throws an error on invalid district url', () => {
    return StudentVue.login('', {
      username: credentials.username,
      password: credentials.password,
    }).catch((e) => {
      expect((e as RequestException).message).toBe('District URL cannot be an empty string');
    });
  });

  it('Throws an error on invalid login credentials', () => {
    return Promise.all([
      StudentVue.login(credentials.district, { username: credentials.username, password: 'abc123' }).catch((e) => {
        expect((e as RequestException).message).toBe('The user name or password is incorrect.');
      }),
      StudentVue.login(credentials.district, { username: 'abc123', password: credentials.password }).catch((e) => {
        expect((e as RequestException).message).toBe('Invalid user id or password');
      }),
    ]);
  });

  it('Returns Client class object upon successful login', async () => {
    try {
      const [client, studentInfo] = await StudentVue.login(credentials.district, {
        username: credentials.username,
        password: credentials.password,
      });
      expect(studentInfo).toBeDefined();
      expect(client).toBeDefined();
    } catch (e) {}
  });

  it('Gets a list of messages', async () => {
    const [client] = await StudentVue.login(credentials.district, {
      username: credentials.username,
      password: credentials.password,
    });

    const messages = await client.messages();

    expect(messages).toBeDefined();
  });
});
