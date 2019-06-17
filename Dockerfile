FROM alpine:3.9.4 AS base
RUN apk add --no-cache nodejs-current nodejs-npm
WORKDIR /app
COPY package.json .

FROM base AS build
COPY . .
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
RUN cp -R node_modules prod_node_modules
RUN npm install 
RUN npm run-script build

FROM base as release
COPY --from=build /app/dist .
COPY --from=build /app/prod_node_modules ./node_modules
ARG PORT=4000
EXPOSE ${PORT}
CMD npm run-script start