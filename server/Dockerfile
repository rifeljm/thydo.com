FROM mhart/alpine-node:12
RUN mkdir /server
WORKDIR /server
ENV PATH /server/node_modules/.bin:$PATH
COPY package.json /server/package.json
RUN npm install
RUN npm install pm2 -g
CMD [ "pm2-runtime", "--watch", "npm", "--", "start" ]
