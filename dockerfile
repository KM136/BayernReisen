FROM node:20-alpine
ENV TZ=Europe/Berlin
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && apk del tzdata
WORKDIR /tg_bot
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY dist ./dist
CMD ["node", "dist/bot.js"]