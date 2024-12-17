# Node.jsの公式イメージを使用します
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.json(とpackage-lock.json)をコピー
COPY package*.json ./

# ソースコードをコピー
COPY . .

# アプリケーションを起動
CMD ["npm", "start"]
