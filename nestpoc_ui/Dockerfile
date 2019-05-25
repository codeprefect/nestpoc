FROM node:10-alpine as build
LABEL application="nestpoc-frontend"
ENV NODE_ENV=production
ENV APP_DIR=/home/node/app
RUN npm install yarn @angular/cli ng-tailwindcss -g
RUN mkdir -p ${APP_DIR}/node_modules && chown -R node:node ${APP_DIR}
WORKDIR ${APP_DIR}
USER node
COPY --chown=node:node package.json yarn.lock ./
RUN yarn add @angular-devkit/build-angular tailwindcss --dev
RUN yarn install
COPY --chown=node:node ./src ./src
COPY --chown=node:node angular.json ng-tailwind.js tailwind.config.js tsconfig.json ./
RUN yarn build --prod

FROM nginx:alpine as server
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /home/node/app/dist/nest-ui /usr/share/nginx/html

EXPOSE 80
