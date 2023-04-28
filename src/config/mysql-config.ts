// const mysql = require('mysql');
// const util = require('util');

// const connection = mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL database: ', err);
//         return;
//     }

//     console.log('Connected to AWS RDS MySQL database');
// });

// const queryPromise = util.promisify(connection.query).bind(connection);

// async function selectQuery(query, params) {
//     try {
//         const rows = await queryPromise(query, params);
//         return rows;
//     } catch (err) {
//         console.error(`Error executing query: ${query} with params: ${params}`);
//         console.error(err);
//         throw new Error('Database query failed');
//     }
// }

// async function insertQuery(query, params) {
//     try {
//         const result = await queryPromise(query, params) ;
//         console.log('result:', result);
//         return result;
//     } catch (err) {
//         console.error(`Error executing query: ${query} with params: ${params}`);
//         console.error(err.message);
//         throw new Error('Database query failed');
//     }
// }



// module.exports = {
//     selectQuery,
//     insertQuery
// };


