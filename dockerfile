FROM node:14-alpine as base
WORKDIR /app
COPY package*.json ./
EXPOSE 3000


FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /app
CMD ["npm", "start"]


FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . /app
CMD ["npm", "run-script", "dev"]
