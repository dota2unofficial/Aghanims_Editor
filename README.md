## Install

```bash
# Clone repository from GitHub to <directory>
$ git clone https://github.com/oliverfindl/electron-vue-boilerplate <directory>

# Switch to <directory>
$ cd <directory>

# Install all dependencies
$ npm install

# [optional] Check and update all dependencies
$ npm outdated
$ npm update
```

## Usage

``` bash
# [terminal 1] Launch Webpack development server with Vue app loaded
$ npm run dev

# [terminal 2] Launch Electron app connected to Webpack development server
$ npm run start

# [terminal 3] Build installers for your current platform
$ npm run dist
```

## Scripts

```bash
# Alias for watch:vue-app
$ npm run dev

# Alias for build:electron-app and start:electron-app
$ npm run start

# Launch Electron app connected to Webpack development server
$ npm run start:electron-app

# Build Electron app and Vue app
$ npm run build

# Build Electron app
$ npm run build:electron-app

# Build Vue app
$ npm run build:vue-app

# Launch Webpack development server with Vue app loaded
$ npm run watch:vue-app

# Pack Electron app (for development purposes only)
$ npm run pack

# Build installers for your current platform
$ npm run dist

# Build installers for all platforms
$ npm run dist:all

# Build installers for Windows
$ npm run dist:w

# Build installers for macOS
$ npm run dist:m

# Build installers for Linux
$ npm run dist:l

# [internal]
$ npm run postinstall
```