# ID3 Tag Editor

This is a small ID3 tag editor using Electron and Vue.

## Install the Dependencies

The app requires you to have [Node](https://nodejs.org/en/download/) installed.

After downloading the repository, open up a terminal and install the dependencies:
```sh
npm install
```

## Running the App

To run the app in dev mode:
```sh
npm run dev
```
This will launch Electron using a bundle targeted for a development environment.

To run the app in prod mode:
```sh
npm run build
npm start
```
This will create all the necessary files for distribution, and launch Electron using a bundle targeted for a production environment.

## Tests

To run the unit tests:
```sh
npm test
```

To run the e2e tests:
```sh
npm run e2e
```

## Using the Tag Editor

To use the tag editor, simply click the "Add" button to add a song into the editor. You can also drag songs into the application.

To edit the tag, select a file you added, and it will bring up all the current ID3 tags of the file. You can edit the tags here, and save them to the file by clicking "Save".

To edit multiple tags at once, select two or more songs. There are several ways you can edit multiple tags:
- Typing `<keep>` will keep the original tags for all songs selected. You can enter something like `<keep> - Original` to both keep the original tag and add ` - Original` to the end of it.
- Typing a regex inside of `<>` will replace the original tags with the result of the regex. For example, `</.*(?=- Original)|.*/>` will remove ` - Original` from the original tag for every song. Note that if no match is found, it will default to the original tag.
