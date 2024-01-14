# Getting Started

To get started, start by installing StudentVue package

```sh
npm install studentvue
```

or

```sh
yarn add studentvue
```

This package comes with its own defined types, so there is no need to install a type definition package.

How to use
In order to access the API, we must first login to StudentVue. First, we need to find a school district to do that, so:

```js
import StudentVue from 'studentvue';

const schools = await StudentVue.findDistricts('zipcode');
const mySchoolDistrict = schools.find((school) => school.name.includes('my school name'));
```

Great! We got our school district. But, how do we login? We can do that right here:

```js
const client = await StudentVue.login(mySchoolDistrict.name, {
  username: 'USERNAME',
  password: 'PASSWORD',
});
```

If no error is thrown, congrats, we have logged in and now have access to the methods of the API. Happy coding!
