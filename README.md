
# Community API
This is an API for managing communities, members, and roles. It provides endpoints for creating and managing communities, adding and removing members, and creating and managing roles.

### Assignment Submission
The API has been deployed on [Render.com](https://render.com/ "Render.com") at the address [https://tif-2.onrender.com](https://tif-2.onrender.com/ "https://tif-2.onrender.com")  and the postman collection is also added to the repo. The API is using a AWS RDS which is a SQL Database. 

The entire project is dockerised for deployment. The OS image used is [node:lts-alpine](https://hub.docker.com/_/node)
Compiled JS code is in the `dist` folder.

For any questions contact : +919819035520 | sohamshinde04@gmail.com

### Role and the ID's
| id|name|scopes|created_at|updated_at
|--|--|--|--|--|
|  7057403484213289414| Community Admin |Admin, Manage Community  | 2023-04-27 17:21:50 | 2023-04-27 17:21:50 |
|  7057411997205171909| Community Member|Member, Manage Community  | 2023-04-27 17:21:50 | 2023-04-27 17:21:50 |
|  7057403484213289414| Community Moderator|Moderator, Manage Community  | 2023-04-27 17:21:50 | 2023-04-27 17:21:50 |

The corresponding SQL Database could be viewed by using the folowwing credentials : 

host : database-2.c4mogjfnbtpq.ap-northeast-1.rds.amazonaws.com
username : tifviewer
password : viewer


## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js
- MySQL
### Installing
Clone the repository and navigate into it.

```bash
    git clone https://github.com/your-username/community-api.git
    cd community-api
```
Install the dependencies.
```bash
npm install
npm run build
```
Create a .env file and add the following environment variables in the src/config.
```bash
DATABASE_NAME=<your-database-name>
DATABASE_USER=<your-database-username>
DATABASE_PASSWORD=<your-database-password>
DATABASE_HOST=<your-database-host>
DATABASE_PORT=<your-database-port>
JWT_SECRET=<your-jwt-secret>
```
Start the server (Development).
```bash
npm run dev
```

Start the server (Production).
```bash
npm start
```
The server will start on port 3000 by default. You can change the port by setting the PORT environment variable.

### Built With
- Node.js
- Express
- Sequelize
- MySQL
- Docker
- Tyepscript
- @theinternetfolks/snowflake
- Bycrypt
- JWT

License : 
This project is licensed under the MIT License - see the LICENSE file for details.

