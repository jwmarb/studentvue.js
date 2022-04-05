import cache from '../utils/cache/cache';
import XMLFactory from '../utils/XMLFactory/XMLFactory';

describe('XMLFactory', () => {
  it('Properly escapes xml', () => {
    const factory =
      new XMLFactory(`<Assignment GradebookID="" Measure="Lab: x vs. t of a Toy Car" Type="Laboratory" Date="8/9/2021" DueDate="8/11/2021" Score="20 out of 20.0000" ScoreType="Raw Score" Points="20.00 / 
    20.0000" Notes="" TeacherID="" StudentID="" MeasureDescription="We did this lab together, so just turning it in gives full credit. To turn in, take a good picture of the lab in your lab notebook and upload it onto the Class Notebook page under the assignment in Teams. Then click "Turn In" on the assignment on Teams." HasDropBox="false" DropStartDate="8/24/2021" DropEndDate="8/25/2021">`);

    jest.spyOn(factory, 'encodeAttribute');

    const encoded = factory.encodeAttribute('MeasureDescription', 'HasDropBox');
    expect(encoded.toString())
      .toBe(`<Assignment GradebookID="" Measure="Lab: x vs. t of a Toy Car" Type="Laboratory" Date="8/9/2021" DueDate="8/11/2021" Score="20 out of 20.0000" ScoreType="Raw Score" Points="20.00 / 
    20.0000" Notes="" TeacherID="" StudentID="" MeasureDescription="We%20did%20this%20lab%20together,%20so%20just%20turning%20it%20in%20gives%20full%20credit.%20To%20turn%20in,%20take%20a%20good%20picture%20of%20the%20lab%20in%20your%20lab%20notebook%20and%20upload%20it%20onto%20the%20Class%20Notebook%20page%20under%20the%20assignment%20in%20Teams.%20Then%20click%20%22Turn%20In%22%20on%20the%20assignment%20on%20Teams." HasDropBox="false" DropStartDate="8/24/2021" DropEndDate="8/25/2021">`);
    expect(factory.encodeAttribute).toHaveBeenCalledTimes(1);
  });

  it('unique encoded attribute values', () => {
    function decodeAttribute(xml: string, attributeName: string, followingAttributeName: string): string {
      const regexp = new RegExp(`${attributeName}=".*" ${followingAttributeName}`, 'g');
      return xml.replace(regexp, (found) => {
        const regular = decodeURI(
          found.substring(attributeName.length + 2, found.length - followingAttributeName.length - 2)
        );
        return `${attributeName}="${regular}" ${followingAttributeName}`;
      });
    }

    const xml = `&lt;Assignment GradebookID="4399010" Measure="3/21: Springs Review" Type="Plickers" Date="3/21/2022" DueDate="3/21/2022" Score="Not Graded" ScoreType="Raw Score" Points="4.0000 Points Possible" Notes="" TeacherID="3837" StudentID="182089" MeasureDescription="" HasDropBox="false" DropStartDate="3/22/2022" DropEndDate="3/23/2022"&gt;
    &lt;Resources&gt;
         &lt;Resource ClassID="0" FileName="Springs Review.pdf" FileType="application/pdf" GradebookID="4399010" ResourceDate="2022-03-22T00:00:00" ResourceID="127985" ResourceName="Springs Review" Sequence="-1" TeacherID="0" Type="File" URL="" ServerFileName="/Photos/5C/5CD89884-9D95-48B5-9653-77E36F5DD1BB_127985.PDF" /&gt;
    &lt;/Resources&gt;
    &lt;Standards /&gt;
&lt;/Assignment&gt;
&lt;Assignment GradebookID="4385262" Measure="Test: Rotation" Type="Assessments" Date="3/10/2022" DueDate="3/10/2022" Score="69 out of 72.0000" ScoreType="Raw Score" Points="69.00 / 72.0000" Notes="" TeacherID="3837" StudentID="182089" MeasureDescription="" HasDropBox="false" DropStartDate="3/10/2022" DropEndDate="3/11/2022"&gt;
    &lt;Resources /&gt;
    &lt;Standards /&gt;
&lt;/Assignment&gt;
&lt;Assignment GradebookID="4369844" Measure="3/7: Rotational Kinetic Energy" Type="Plickers" Date="3/7/2022" DueDate="3/7/2022" Score="4 out of 4.0000" ScoreType="Raw Score" Points="4.00 / 4.0000" Notes="" TeacherID="3837" StudentID="182089" MeasureDescription="" HasDropBox="false" DropStartDate="3/7/2022" DropEndDate="3/8/2022"&gt;
    &lt;Resources&gt;
         &lt;Resource ClassID="0" FileName="Rotational Kinetic Energy (1) - Plickers.pdf" FileType="application/pdf" GradebookID="4369844" ResourceDate="2022-03-07T00:00:00" ResourceID="127157" ResourceName="Rotational Kinetic Energy" Sequence="-1" TeacherID="0" Type="File" URL="" ServerFileName="/Photos/5C/5CD89884-9D95-48B5-9653-77E36F5DD1BB_127157.PDF" /&gt;
    &lt;/Resources&gt;
    &lt;Standards /&gt;
&lt;/Assignment&gt;
&lt;Assignment GradebookID="4355639" Measure="3/3: Linear-Angular Combo Problems" Type="Plickers" Date="3/3/2022" DueDate="3/3/2022" Score="4 out of 4.0000" ScoreType="Raw Score" Points="4.00 / 4.0000" Notes="" TeacherID="3837" StudentID="182089" MeasureDescription="" HasDropBox="false" DropStartDate="3/3/2022" DropEndDate="3/4/2022"&gt;
    &lt;Resources&gt;
         &lt;Resource ClassID="0" FileName="Linear-Angular Combo Problems.pdf" FileType="application/pdf" GradebookID="4355639" ResourceDate="2022-03-03T00:00:00" ResourceID="126928" ResourceName="Linear-Angular Combo Problems" Sequence="-1" TeacherID="0" Type="File" URL="" ServerFileName="/Photos/5C/5CD89884-9D95-48B5-9653-77E36F5DD1BB_126928.PDF" /&gt;
    &lt;/Resources&gt;
    &lt;Standards /&gt;
&lt;/Assignment&gt;`;

    const factory = new XMLFactory(xml);

    factory.encodeAttribute('Measure', 'Type');

    expect(decodeAttribute(factory.toString(), 'Measure', 'Type')).toStrictEqual(xml);
  });
});

describe('memo', () => {
  const fn = () => new Promise<boolean>((res) => setTimeout(() => res(true), 200));
  const memoize = jest.spyOn({ fn }, 'fn');
  it('memoizes value', async () => {
    const sample = await cache.memo(fn);
    expect(sample).toBe(true);
  });

  it('successfully adds value to cache', () => {
    expect(cache.isMemo(fn.toString())).toBe(true);
  });

  it('returns memoized value', async () => {
    const sample = await cache.memo(fn);
    expect(sample).toBe(true);
    expect(memoize).toHaveBeenCalledTimes(0); // expect it to only have been called none at this point. if it has been called once, that would mean that it had to execute the function again because the value did not exist in cache (this would also mean that the previous test would also fail)
  });
});
