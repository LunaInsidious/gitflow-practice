# Node.jsの公式イメージを使用します
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.json(とpackage-lock.json)をコピー
COPY package*.json ./

# NPM_TOKENを環境変数として受け取る
ARG NPM_TOKEN

# NPMトークンをNPMの設定に追加
RUN npm config set //registry.npmjs.org/:_authToken=${NPM_TOKEN}

RUN echo $NPM_TOKEN

# ソースコードをコピー
COPY . .

# アプリケーションを起動
CMD ["npm", "start"]
