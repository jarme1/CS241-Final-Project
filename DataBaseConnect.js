const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection ({
   	host: process.env.HOST,
   	user: process.env.USERNAME,
   	password: process.env.PASSWORD,
   	database: process.env.DATABASE
   	//port: process.env.DB_PORT
});

//connection.connect();

connection.connect(function(err) {
   	if(err) {
       		return console.log(err.message);
    	}
   	console.log('db ' + connection.state)
});

class DataBase {
	static getDataBaseInstance() {
        	if (instance == true) {
        		return instance;
        	}
        	else {
            		return new DataBase();
        	}
    	}

       async getCapacity() {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT Capacity FROM classes", (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }

       async getEnrolled() {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT Num_Filled FROM classes", (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }


       async getDepartments() {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT DISTINCT(Department) FROM classes", (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }


        async login(id) {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT * FROM students where Id = ?", [id], (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
					resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }


	async chooseMajor(group) {
		try {
            		if (group == 'Choose a department') { 
                	//console.log("choose");
                	return;
            		}
            		const result = await new Promise((resolve, reject) => {
                		const query = "SELECT * FROM classes WHERE Department = ?;";

                		connection.query(query, [group], (err, result) => {
                   			if (err) {
			   			reject(new Error(err.message));
		    			}
		    			resolve(result);
                		})
            		});
            		return {
				result
            		};
        	} 
        	catch (error) {
            		console.log(error);
        	}
	}

        async selectClass(id, crn, pref) {
                try {
                        //if (crn == 'Choose a class') {
                        //return;
                        //}

                        const result = await new Promise((resolve, reject) => {
				//query to add to preferences
                                connection.query("INSERT INTO test_prefs (StudentId, ClassId, Ranking) VALUES (?, ?, ?);", [id, crn, pref], (err, result) => {
                                        if (err) {
						console.log("error in query");
                                                reject(new Error(err.message));
                                        }
                                        resolve(JSON.stringify(result.affectedRows));
                                        //resolve(JSON.parse(JSON.stringify(result)));
                                })
                        });
			if (result == '1') {
				return true;
			}
			else {
				return false;
			}
                }
                catch (error) {
                        console.log(error);
                }
        }

        async getStudents(year) {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT Id FROM students WHERE Class_Year = ? AND Id <= 1000;", [year], (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }

        async getPrefs(id) {
                try {
                        const result = await new Promise((resolve, reject) => {
                                
                                connection.query("SELECT ClassId FROM test_prefs WHERE StudentId = ?;", [id], (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }

        async getFillInfo(cls) {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT Num_Filled, Capacity FROM classes WHERE Id = ?", [cls], (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }

        async getSchedule(id) {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT ClassID FROM schedule WHERE StudentId = ?", [id], (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }

        async getDays(id) {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT Days FROM classes WHERE Id = ?", [id], (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }

        async getTimes(id) {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("SELECT Start_Time, End_Time FROM classes WHERE Id = ?", [id], (err, result) => {
                                        if (err) {
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return {
                                result
                        };
                }
                catch (error) {
                        console.log(error);
                }
        }

        async putSchedule(id, cl) {
                try {
                        const result = await new Promise((resolve, reject) => {

                                connection.query("INSERT INTO test_schedule(StudentId, ClassId) VALUES (?, ?);", [id, cl], (err, result) => {
                                        if (err) {
                                                console.log("error in query");
                                                reject(new Error(err.message));
                                        }
                                        resolve(JSON.stringify(result.affectedRows));
                                })
                        });
                        if (result == '1') {
                                return true;
                        }
                        else {
                                return false;
                        }
                }
                catch (error) {
                        console.log(error);
                }
        }

        async schedule(id) {
                try {
                        const result = await new Promise((resolve, reject) => {
                             
                                connection.query("SELECT ClassId from test_schedule where StudentId = ?;", [id], (err, result) => {
                                        if (err) {
                                                console.log("error in query");
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
			return result;
                }
                catch (error) {
                        console.log(error);
                }
        }

	async classFromId(id) {
                try {
                        const result = await new Promise((resolve, reject) => {
             
                                connection.query("SELECT Class_Name from classes where Id = ?;", [id], (err, result) => {
                                        if (err) {
                                                console.log("error in query");
                                                reject(new Error(err.message));
                                        }
                                        resolve(result);
                                })
                        });
                        return result;
                }
                catch (error) {
                        console.log(error);
                }
        }

}

module.exports = DataBase;
