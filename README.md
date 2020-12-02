<div align="center"><img src="https://assets.dmnktoe.de/__ext/healform/healform_logo_wide.png" width="300"></div>

<hr>

# myHealform Display-Widget

<p>
<img src="https://img.shields.io/github/package-json/v/HEALFORM/myhealform-display-widget.svg">
</p>

This app displays the name of the patient of the current HEALFORM appointment in Kassel on the website (in the widget) and updates it in real-time.

## Configuration

Set the following environment variables.

| Variable | Default | Notes                          |
| -------- | ------- | ------------------------------ |
| `NODE_ENV`   | `development`  | Set the server it's environment. |
| `HOST`   | `localhost`  | The host the server listens on. |
| `PORT`   | `8080`  | The port the server listens on. |
| `ACUITY_BASE_URL`   | `https://acuityscheduling.com/api/v1/`  | Acuity API base url. |
| `ACUITY_USER_ID`   | `Acuity User ID`  | Acuity User ID for authentication. |
| `ACUITY_API_KEY`   | `Acuity API Key`  | Acuity API Key for authentication. |

## Development

### Branches

<!-- prettier-ignore -->
| Branch    | Tests | Code Coverage | Comments                  |
| --------- | ----- | ------------- | ------------------------- |
| `master`  | <img src="https://api.travis-ci.com/HEALFORM/myhealform-display-widget.svg?branch=main"> | [![codecov](https://codecov.io/gh/HEALFORM/myhealform-display-widget/branch/main/graph/badge.svg?token=LQGEqYJJUu)](https://codecov.io/gh/HEALFORM/myhealform-display-widget) | Latest Production Release |
