# Switching Between Package Managers
If you want to switch from NPM to Yarn follow these steps.

1 - delete the node_modules folder
2 - delete the package-lock.json file
3 - run yarn install
This will generate a new node_modules folder and a yarn.lock file. Your project is now using yarn.

If you want to switch from Yarn to NPM follow these steps.

1 - delete the node_modules folder
2 - delete the yarn.lock file
3 - run npm install
This will generate a new node_modules folder and a package-lock.json file. Your project is now using NPM.


# Initialising react and tailwind css
1 - "yarn create vite" (select React, JavaScript)   = 
2 - "yarn" or "yarn install" or "npm install"       = installs all dependencies
3 - "yarn dev" or "npm run dev" - runs the "dev"    = script to start application
4 - "npm i tailwindcss postcss autoprefixer"        = 
5 - "npx tailwindcss init -p"                       = where p flag is for postcss 
6 - "npm i lodash"                                  = useful library that solves common problems(e.g in our case, creating unique messages only)
7 - "npm i axios"                                   = Will allow us to send requests to our server

8 - "npm install -g react-devtools"                 = Will allow us to use react developer tools