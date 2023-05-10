const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const DataBaseConnect = require('./DataBaseConnect');
//const DataBaseAlg = require('./DataBaseAlg');

app.use(cors());
app.use(express.json());

app.get('/departments', (request, response) => {
	const d_b = DataBaseConnect.getDataBaseInstance();

	const result = d_b.getDepartments();

	result
	.then(data => response.json({dept: data}))
	.catch(err => console.log(err));
});

app.get('/capacity', (request, response) => {
        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.getCapacity();

        result
        .then(data => response.json({cap: data}))
        .catch(err => console.log(err));
});

app.get('/enrolled', (request, response) => {
        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.getEnrolled();

        result
        .then(data => response.json({enrl: data}))
        .catch(err => console.log(err));
});

app.post('/login', (request, response) => {
	const obj = request.body;
        const id = obj.id;
	
        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.login(id);

        result
	.then (data => {
		if (data['result'].length == 0) {
			response.json({login: false});
		}
		else {
			response.json({login: true});
		}
	})
        //.then(data => response.json({log: data}))
        .catch(err => console.log(err));
});

app.post('/choose_major', (request, response) => {
	const obj = request.body;
	const group = obj.group;
	//const {group} = request.body;
	const d_b = DataBaseConnect.getDataBaseInstance();

	const result = d_b.chooseMajor(group);

	result
	.then(data => response.json({data: data}))
   	.catch(err => console.log(err));
});

app.post('/select_class', (request, response) => {
        const obj = request.body;
        const id = obj.id;
	const crn = obj.crn;
	const pref = obj.pref;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.selectClass(id, crn, pref);

        result
	.then(data => response.json({added: data}))
        .catch(err => console.log(err));
});

app.post('/getStudents', (request, response) => {
        const obj = request.body;
        const year = obj.year;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.getStudents(year);

        result
        .then(data => response.json({students: data}))
        .catch(err => console.log(err));
});

app.post('/getPrefs', (request, response) => {
        const obj = request.body;
        const id = obj.id;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.getPrefs(id);

        result
        //.then(data => console.log(data))
        .then(data => response.json({prefs: data}))
        .catch(err => console.log(err));
});

app.post('/getFillInfo', (request, response) => {
        const obj = request.body;
        const cls = obj.cls;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.getFillInfo(cls);

        result
        .then(data => response.json({info: data}))
        .catch(err => console.log(err));
});

app.post('/getSchedule', (request, response) => {
        const obj = request.body;
        const id = obj.id;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.getSchedule(id);

        result
        //.then(data => console.log(data))
        .then(data => response.json({schedule: data}))
        .catch(err => console.log(err));
});

app.post('/selectDays', (request, response) => {
        const obj = request.body;
        const id = obj.id;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.getDays(id);

        result
        //.then(data => console.log(data))
        .then(data => response.json({days: data}))
        .catch(err => console.log(err));
});

app.post('/selectTimes', (request, response) => {
        const obj = request.body;
        const id = obj.id;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.getTimes(id);

        result
        //.then(data => console.log(data))
        .then(data => response.json({times: data}))
        .catch(err => console.log(err));
});

app.post('/putSchedule', (request, response) => {
        const obj = request.body;
        const id = obj.id;
	const cl = obj.cl;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.putSchedule(id, cl);

        result
        .then(data => response.json({added: data}))
        .catch(err => console.log(err));
});

app.post('/schedule', (request, response) => {
	const obj = request.body;
	const id = obj.id;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.schedule(id);

        result
        .then(data => response.json({schedule: data}))
        .catch(err => console.log(err));
});

app.post('/classFromId', (request, response) => {
        const obj = request.body;
        const cl = obj.cl;

        const d_b = DataBaseConnect.getDataBaseInstance();

        const result = d_b.classFromId(cl);

        result
        .then(data => response.json({schedule: data}))
        .catch(err => console.log(err));
});

app.listen(process.env.PORT, process.env.WEB_host, function(err) {
   	if (err) console.log("Error. Server not running")
   	console.log("Server is running");
})
