# NestJS and Angular Proof of Concept

This is an application showcasing the beauty of TypeScript and how you can use it build scalable enterprise systems.

## Development

## Continuous Integration and Deployment

Contains integration for Docker Compose, Gitlab CI and Github Actions.

### Docker Compose

Also has a `docker-compose` implementation that expects the provision of the following variables

+ `UI_PORT`: the port number you wish to access the frontend app.
+ `API_PORT`: the port you wish to access the backend app.
+ `API_ENV_FILE`: location of the environment file to use for the backend server, it must be in the relative to `./.docker/`

### Gitlab CI

Gitlab can help you build and publish docker images to a docker repository.
To use this, ensure you have the following variables declared on your Gitlab Repo

+ `CI_USERNAME` : your gitlab username
+ `CI_ACCESS_TOKEN` : this is the access token to log into gitlab cli if you are using 2FA.

Feel free to check `./gitlab-ci.yml` and their documentations for more info.

### Github Actions

Github provides a robust CI tool that you can use, currently, this is being used to build and deploy images to the gitlab docker repository.

Ensure that all the underlisted variables are provided under the `secret` section of your github repository

+ `DOCKER_REGISTRY_URL` : url of the docker registry to publish to
+ `DOCKER_USERNAME` : docker registry username
+ `DOCKER_PASSWORD` : docker registry password
+ `REPO_NAME` : repository name (`nestpoc` in this case)
+ `FRONTEND_IMAGE` : name to give to front-end image
+ `BACKEND_IMAGE`: name to give to backend image

Brought to you by ['Barak Imam](https://barakimam.me) with &#x1F49D; from Lagos, Nigeria.
