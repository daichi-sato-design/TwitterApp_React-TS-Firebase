FROM node:14.15.0-alpine3.11

WORKDIR /usr/src/frontend

# package.jsonのみ最初にコピーし、パッケージがインストールされたキャッシュレイヤーを作る
COPY package*.json ./
RUN npm install
RUN npm cache clean -f
RUN mv /usr/src/frontend/node_modules /node_modules

# 最後に全てのファイルをにコピー
COPY . .

# 環境変数を設定
ENV NODE_ENV = development
ENV PORT = 3000

# PORTを設定
EXPOSE 3000

# /appのパミッションとOwnerを設定
RUN chown -R node:node /usr/src/frontend && \
  chmod -R 744 /usr/src/frontend && \
  chown -R node:node /node_modules && \
  chmod -R 777 /node_modules

# コンテナを起動した時のプロセスのOwnerを指定
USER node

CMD [ "npm", "start" ]