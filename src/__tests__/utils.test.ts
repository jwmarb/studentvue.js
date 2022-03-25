import XMLFactory from '../utils/XMLFactory/XMLFactory';

describe.skip('XMLFactory', () => {
  it('Properly converts xml attribute to base64', () => {
    const factory =
      new XMLFactory(`<Assignment GradebookID="" Measure="Lab: x vs. t of a Toy Car" Type="Laboratory" Date="8/9/2021" DueDate="8/11/2021" Score="20 out of 20.0000" ScoreType="Raw Score" Points="20.00 / 
    20.0000" Notes="" TeacherID="" StudentID="" MeasureDescription="We did this lab together, so just turning it in gives full credit. To turn in, take a good picture of the lab in your lab notebook and upload it onto the Class Notebook page under the assignment in Teams. Then click "Turn In" on the assignment on Teams." HasDropBox="false" DropStartDate="8/24/2021" DropEndDate="8/25/2021">`);

    jest.spyOn(factory, 'encodeAttribute');

    const encoded = factory.encodeAttribute('MeasureDescription', 'HasDropBox');
    expect(encoded.toString())
      .toBe(`<Assignment GradebookID="" Measure="Lab: x vs. t of a Toy Car" Type="Laboratory" Date="8/9/2021" DueDate="8/11/2021" Score="20 out of 20.0000" ScoreType="Raw Score" Points="20.00 / 
    20.0000" Notes="" TeacherID="" StudentID="" MeasureDescription="V2UgZGlkIHRoaXMgbGFiIHRvZ2V0aGVyLCBzbyBqdXN0IHR1cm5pbmcgaXQgaW4gZ2l2ZXMgZnVsbCBjcmVkaXQuIFRvIHR1cm4gaW4sIHRha2UgYSBnb29kIHBpY3R1cmUgb2YgdGhlIGxhYiBpbiB5b3VyIGxhYiBub3RlYm9vayBhbmQgdXBsb2FkIGl0IG9udG8gdGhlIENsYXNzIE5vdGVib29rIHBhZ2UgdW5kZXIgdGhlIGFzc2lnbm1lbnQgaW4gVGVhbXMuIFRoZW4gY2xpY2sgIlR1cm4gSW4iIG9uIHRoZSBhc3NpZ25tZW50IG9uIFRlYW1zLg==" HasDropBox="false" DropStartDate="8/24/2021" DropEndDate="8/25/2021">`);
    expect(factory.encodeAttribute).toHaveBeenCalledTimes(1);
  });

  it('unique base64 values', () => {
    function decodeAttribute(xml: string, attributeName: string, followingAttributeName: string): string {
      const regexp = new RegExp(`${attributeName}=".*" ${followingAttributeName}`, 'g');
      return xml.replace(regexp, (found) => {
        const regular = decodeURIComponent(
          escape(atob(found.substring(attributeName.length + 2, found.length - followingAttributeName.length - 2)))
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
