import XMLFactory from '../utils/XMLFactory/XMLFactory';

describe('XMLFactory', () => {
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
});
