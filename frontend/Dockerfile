FROM node:20.20.2 AS build

WORKDIR /app

# COPY package. json package-lock.json ./
# RUN npm install -- frozen-lockfile
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# FROM nginx:alpine # AS runner
FROM nginx:alpine

# WORKDIR /usr/share/nginx/html

# COPY --from=builder /app/dist .
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# run commands
# docker build -t vite-frontend .
# docker run -p 3000:80 vite-frontend
