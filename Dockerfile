FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app  

COPY . .

RUN npm install

# Install dependencies and build project
RUN npm run build

# Set environment variable for RDS connection
ENV JWT_SECRET='soham' \
    MYSQL_HOST='database-2.c4mogjfnbtpq.ap-northeast-1.rds.amazonaws.com' \
    MYSQL_USER='admin' \
    MYSQL_PASSWORD='password' \
    MYSQL_DATABASE='TIF' \
    RDS_PORT=3306

CMD ["npm", "start"]

EXPOSE 3000