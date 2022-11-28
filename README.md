# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Fake API is used
So far as I use regexp to highlight text - any regexp special symbols need to be escaped, like: 
[ ] \\ ^ $ . | ? * + ( )

In order to check all this edge cases it is easier to simulate API.
Please check 'src/queries/getMockData.ts' file. I used REACT_APP_FAIL_PROBABILITY parameter to simulate errors from API.
Also REACT_APP_API_TIMEOUT is used as .env parameter, default value is 300ms.

## What we need for PROD
In general CRA makes most of the job to make final bundle be ready to deploy. You just need to build the project.
But there are no tests... And it is really bad idea go to PROD without even unit tests. Also would be nice to have e2e tests.
I would also add additional .prettierrc and .eslintrc rules to make code styles consistant across the team (like sort imports alphabetically, max width of the line, etc.)
## Available Scripts

First install dependencies
### `npm i`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
