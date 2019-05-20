# NestPoc

NestPoc is my personal attempt at building scalable enterprise architecture using patterns similar to what is found in static language frameworks like C# ASP.NET and Java Spring.

## Structure

The app is structured into modules and the current modules on the app include:

- [x] Common Module
- [ ] Gateway Module **(Started)**
- [ ] Auth Module **(Started)**
- [ ] SIS Module
- [ ] LMS Module
- [ ] Notification Module

## Setup

Currently running directly on npm, dockerization will happen soon.

You will find necessary environment variables in the `samples.env` file. This variables needs to be provided in the following ways:

- [x] passing them as command line arguments at startup
- [x] loaded from `{environment}.env` file, (`environment` should be the same as the defined `NODE_ENV` value)

## Testing

Only unit tests have been implemented, and you can check that by running

```[bash]
yarn test
```

## Running

Simply start the app using any of the following depending on your environment

- Development: `yarn start:dev`
- Production: `yarn start`

Brought to you by ['Barak Imam](https://barakimam.me) with &#x1F49D; from Lagos, Nigeria.
