import { XMLParser } from 'fast-xml-parser';
import StudentVue from '..';
import { SchoolDistrict } from '../StudentVue/StudentVue.interfaces';

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
    await expect(StudentVue.findDistricts('8888888888')).rejects.toThrow(
      'Please enter zip code with atleast 3 characters and not more than 5 characters.'
    );
  });
});
