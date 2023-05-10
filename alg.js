//OK! It's a comment to start with
//Hopefully this doesn't go too bad

//OK so we'll need to start with one of the years, right?
//so we'll need


async function runalg(a) {
    var students = new Array();
    //students = (SELECT Id FROM students WHERE Class_Year == a);
    fetch("http://clyde.cs.oberlin.edu:5000/getStudents", {
    	method: "POST",
        body: JSON.stringify({year: a}),
        headers: {"Content-type": "application/json"}
    })
    .then(response => response.json())
    .then((data) => {
    	const db_result = data.students["result"];
        for (let i = 0; i < db_result.length; i++) {
        	students[i] = db_result[i]["Id"];
    	}

	console.log(students);
   	
	for (let i of students) {
        	makeSchedule(i);
    	}
    });

    return;
}


async function makeSchedule(student) {
    //var prefs = new Array();
    var prefs = [];

    await fetch("http://clyde.cs.oberlin.edu:5000/getPrefs", {
        method: "POST",
        body: JSON.stringify({id: student}),
        headers: {"Content-type": "application/json"}
    })
    .then(response => response.json())
    .then((data) => {
        const db_result = data.prefs["result"];
        for (let i = 0; i < db_result.length; i++) {
                prefs[i] = db_result[i]["ClassId"];
        }
    });

    console.log(prefs.length);
    if (prefs.length == 0) {
    	    return;
    }
    //prefs = ("SELECT ClassId FROM prefs WHERE StudentId = student");
    var compat = new Array();
    var schedule = new Array();
    var capacities = new Array();
    var i = 0;

    for (i; i < prefs.length; i++) {
	await fetch("http://clyde.cs.oberlin.edu:5000/getFillInfo", {
       		method: "POST",
       		body: JSON.stringify({cls: prefs[i]}),
       		headers: {"Content-type": "application/json"}
    	})
    	.then(response => response.json())
    	.then((data) => {
		const db_result = data.info["result"][0];
       		var filled = db_result["Num_Filled"];
		var maxcap = db_result["Capacity"];
		if (filled < maxcap) {
        		capacities[i] = 1;
        	} else {
           		capacities[i] = 0;
       		}
	});
    }
        //var maxcap = ("SELECT Capacity FROM classes WHERE Id = prefs[i]");
       //var filled = ("SELECT Num_Filled FROM classes WHERE Id = prefs[i]");
	//
    await fetch("http://clyde.cs.oberlin.edu:5000/getSchedule", {
        method: "POST",
        body: JSON.stringify({id: student}),
        headers: {"Content-type": "application/json"}
        })
    .then(response => response.json())
    .then((data) => {
        const db_result = data.schedule["result"];
	for (let i = 0; i < db_result.length; i++) {
		schedule[i] = db_result[i]["ClassId"];
        }
    });
    			//schedule = ("SELECT ClassID FROM schedule WHERE StudentId = student");
    i = 0;
    if (schedule.length > 0) {
        for (i; i < schedule.length; i++) {
            compat[i] = schedule[i];
        };
    }
    while (capacities[i] == 0) {
        i++;
    }
    compat[0] = prefs[i];
    i++;
    var x = 0;
    //for (i; x < prefs.length; i++) {
    for (i; i < prefs.length; i++) {
	    var nextdays = "";
	    var thesedays = "";
	    await fetch("http://clyde.cs.oberlin.edu:5000/selectDays", {
        	method: "POST",
        	body: JSON.stringify({id: prefs[i]}),
        	headers: {"Content-type": "application/json"}
        	})
    	    .then(response => response.json())
    	    .then((data) => {
		    //console.log(student);
		    //console.log("x ", x);
		    //console.log("i ", i);
		    //console.log(prefs.length);
		    //console.log(data.days["result"][0]);
            	nextdays = data.days["result"][0]["Days"];
    	    });

	    await fetch("http://clyde.cs.oberlin.edu:5000/selectDays", {
                method: "POST",
                body: JSON.stringify({id: compat[x]}),
                headers: {"Content-type": "application/json"}
                })
            .then(response => response.json())
            .then((data) => {
                thesedays = data.days["result"][0]["Days"];
            });

        //var nextdays = ("SELECT Days FROM classes WHERE Id = prefs[i]");
        //var thesedays = ("SELECT Days FROM classes WHERE Id = compat[x]");
        var overlap = nextdays.localeCompare(thesedays);
        if (overlap != 0) {
            if (capacities[i] != 0) {
                x++;
                compat[x] = prefs[i];
            }
        } else {
	    
	    var nextstart = "";
            var nextend = "";
            await fetch("http://clyde.cs.oberlin.edu:5000/selectTimes", {
                method: "POST",
                body: JSON.stringify({id: prefs[x]}),
                headers: {"Content-type": "application/json"}
                })
            .then(response => response.json())
            .then((data) => {
                nextstart = data.times["result"][0]["Start_Time"];
		nextend = data.times["result"][0]["End_Time"];
            });

            var thisstart = "";
            var thisend = "";
            await fetch("http://clyde.cs.oberlin.edu:5000/selectTimes", {
                method: "POST",
                body: JSON.stringify({id: compat[x]}),
                headers: {"Content-type": "application/json"}
                })
            .then(response => response.json())
            .then((data) => {
                thisstart = data.times["result"][0]["Start_Time"];
                thisend = data.times["result"][0]["End_Time"];
            });

	
            //var nextstart = ("SELECT Start_Time FROM classes WHERE Id = prefs[x]");
            //var nextend = ("SELECT End_Time FROM classes WHERE Id = prefs[x]");
            //var thisstart = ("SELECT Start_Time FROM classes WHERE Id = compat[x]");
            //var thisend = ("SELECT End_Time FROM classes WHERE Id = compat[x]");
            if (nextstart > thisend || thisstart > nextend) {
                if (capacities[i] != 0) {
                    x++;
                    compat[x] = prefs[i];
                }
            }
        }
        

    }
    x = 0;
    i = 1;
    schedule[0] = compat[0]
    for (i; i < compat.length; i++) {
	if (x == 4) { break; }
        schedule[x] = compat[i];
        //Increment the num_filled for each class based on the key in schedule[x]
        x++;
    }
    for (let i of schedule) {
	    console.log(i);
            await fetch("http://clyde.cs.oberlin.edu:5000/putSchedule", {
                method: "POST",
                body: JSON.stringify({
			id: student,
			cl: i
		}),
                headers: {"Content-type": "application/json"}
                })
            .then(response => response.json())
            .then((data) => {
		if (data.added == true) {
			console.log("added");
		}
		else {
			console.log("error adding the schedule");
		}
            });
    }

    //put the schedule in the database
    return;
}

for (let i = 1; i < 6; i++) {
	runalg(i);
}

//console.log("I ran!");

