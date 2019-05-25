# create a base image from node-alpine
FROM node:12-alpine as base-server
LABEL application="nestpoc-backend"
ENV TERM=xterm-256color
RUN npm install yarn -g

# branch off to another image just for building the app
FROM base-server as builder
ENV BUILDER_APP_DIR=/home/node/app
RUN mkdir -p ${BUILDER_APP_DIR}/node_modules && chown -R node:node ${BUILDER_APP_DIR}
WORKDIR ${BUILDER_APP_DIR}
COPY package.json yarn.lock ./
USER node
RUN yarn install

# branch off to another image that will serve our app
FROM base-server as server
ENV SERVER_APP_DIR=/usr/nestpoc
ENV BUILDER_APP_DIR=/home/node/app
RUN mkdir -p ${SERVER_APP_DIR}/node_modules && chown -R node:node ${SERVER_APP_DIR}
WORKDIR ${SERVER_APP_DIR}
COPY --from=builder ${BUILDER_APP_DIR}/package.json ./
USER node
RUN yarn install --prod

# continue from where we stop in builder, build the app now
FROM builder as final
COPY --chown=node:node ./src ./src
COPY --chown=node:node nest-cli.json tsconfig.json tsconfig.build.json ormconfig.json gulpfile.ts ./
RUN yarn build

# continue from where we stopped in server, copy the build over
FROM server
ENV BUILDER_APP_DIR=/home/node/app
COPY --chown=node:node --from=final ${BUILDER_APP_DIR}/dist ./dist

EXPOSE 3000
