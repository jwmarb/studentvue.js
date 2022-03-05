# StudentVUE

[![license](https://img.shields.io/github/license/EGGaming/studentvue.js)](https://github.com/EGGaming/studentvue.js/blob/main/LICENSE) [![npm package](https://img.shields.io/npm/v/studentvue)](https://www.npmjs.com/package/studentvue)

[Documentation](https://eggaming.github.io/studentvue.js/)

StudentVUE is a tool for students to access classroom information from their institution or district. It uses a [SOAP](https://en.wikipedia.org/wiki/SOAP) API, sending data in the form of XML. But, to access XML as usable data, it must be parsed which can be a tedious process. Thus, this library was created to let you use StudentVUE's API without needing to worry about parsing XML.

---

## Installation

### npm

```sh
npm install studentvue
```

---

## Usage

To get started, we must first log in to start using the API.

```js
import StudentVue from 'studentvue';

const DISTRICT_URL = 'https://...';
const USERNAME = '...';
const PASSWORD = '...';
const client = await StudentVue.login(DISTRICT_URL, { username: USERNAME, password: PASSWORD });
```

Once we are logged in, we can access any method within the API. See [Client](https://eggaming.github.io/studentvue.js/Client.html)

--

## License

Distributed under [MIT © Joseph Marbella](https://github.com/EGGaming/studentvue.js/blob/main/LICENSE)
