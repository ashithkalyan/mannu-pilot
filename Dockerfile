FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY engine ./engine
COPY server ./server
COPY web ./web
ENV PORT=8080 DATA_DIR=/tmp/mannu-data
EXPOSE 8080
CMD ["node", "server/server.mjs"]
