# HEALFORM Display Widget

<p>
<img src="https://img.shields.io/github/package-json/v/dmnktoe/myhealform-display-widget.svg">
<img src="https://david-dm.org/dmnktoe/myhealform-display-widget/status.svg">
</p>

## Configuration

Set the following environment variables

| Variable | Default | Notes                          |
| -------- | ------- | ------------------------------ |
| `PORT`   | `8080`  | The port the server listens on |

## Development

### Branches

<!-- prettier-ignore -->
| Branch    | Tests | Code Coverage | Comments                  |
| --------- | ----- | ------------- | ------------------------- |
| `develop` | <img src="https://travis-ci.com/dmnktoe/myhealform-display-widget.svg?token=zEu41NzranCVykbMZnLs&branch=develop"> | [![codecov](https://codecov.io/gh/dmnktoe/myhealform-display-widget/branch/develop/graph/badge.svg?token=lcRoBB399S)](https://codecov.io/gh/dmnktoe/myhealform-display-widget) | Work in progress          |
| `master`  | <img src="https://travis-ci.com/dmnktoe/myhealform-display-widget.svg?token=zEu41NzranCVykbMZnLs&branch=master"> | [![codecov](https://codecov.io/gh/dmnktoe/myhealform-display-widget/branch/master/graph/badge.svg?token=lcRoBB399S)](https://codecov.io/gh/dmnktoe/myhealform-display-widget) | Latest Production Release |

### Prerequisites

- [NodeJS](htps://nodejs.org), version 12.13.0 (LTS) or better. (I use [`nvm`](https://github.com/creationix/nvm) to manage Node versions — `brew install nvm`.)

### To build and run locally

Clone this (or better yet, fork it then clone your fork)

```sh
npm install
npm start
```

Go to [localhost:8080/api-docs](http://127.0.0.1:8080/api-docs) to see the docs.

### `.env` file

You can put environment variables in a `.env` file.

### Testing

- `npm run test` to run the unit tests

## Licences

<a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fdmnktoe%2Fmyhealform-display-widget?ref=badge_large" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdmnktoe%2Fmyhealform-display-widget.svg?type=large"/></a>
