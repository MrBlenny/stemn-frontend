## Development

### Install

First, clone the repo via git:

And then install dependencies.

```bash
$ npm install
```


### Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run hot-server
$ npm run start-hot
```

or run two servers with one command

```bash
$ npm run dev
```

*Note: requires a node version >= 4 and an npm version >= 2.*

### Package and Release

To package the app for local testing, run:

```bash
npm run build
npm run pack
```

### Release

After you've bumped the version number in `app/package.json`, run:

```bash
GH_TOKEN=... CSC_NAME=... npm run release
```

---

### Contributors

Special thanks go to:

* [Jack Wilkinson](https://github.com/guacjack)

> Originally based on the fantastic [chentsulin/electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
> MIT © [C. T. Lin](https://github.com/chentsulin)
>
> [Electron](http://electron.atom.io/) application boilerplate based on [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr) for rapid application development
