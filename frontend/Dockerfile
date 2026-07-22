FROM node:20.20.2

WORKDIR /app

# COPY package. json package-lock.json ./
# RUN npm install -- frozen-lockfile
COPY package*.json ./
RUN npm install

COPY . .


EXPOSE 5173

CMD ["npm", "run", "dev"]

