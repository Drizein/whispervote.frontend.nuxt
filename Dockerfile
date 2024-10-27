FROM node:20.11.1
ENV NODE_ENV=production
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

ENTRYPOINT ["npm", "run", "start"]