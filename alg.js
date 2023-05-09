//OK! It's a comment to start with
//Hopefully this doesn't go too bad

//OK so we'll need to start with one of the years, right?
//so we'll need
function runalg(a) {
    const students = new Array()
    students = (SELECT Id FROM students WHERE Class_Year == a);
    for (var i in students) {
        makeSchedule(i);
    }
    return;
}

function makeSchedule(student) {
    const prefs = new Array();
    prefs = (SELECT ClassId FROM prefs WHERE StudentId = student);
    const compat = new Array();
    const schedule = new Array();
    const capacities = new Array();
    var i = 0;
    for (i; i < prefs.length; i++) {
        var maxcap = (SELECT Capacity FROM classes WHERE Id = prefs[i]);
        var filled = (SELECT Num_Filled FROM classes WHERE Id = prefs[i]);
        if (filled < maxcap) {
            capacities[i] = 1;
        } else {
            capacities[i] = 0;
        }
    }
    schedule = (SELECT ClassID FROM schedule WHERE StudentId = student);
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
    for (i; x < prefs.length; i++) {
        var nextdays = (SELECT Days FROM classes WHERE Id = prefs[i]);
        var thesedays = (SELECT Days FROM classes WHERE Id = compat[x]);
        var overlap = nextdays.localeCompare(thesedays);
        if (overlap != 0) {
            if (capacities[i] != 0) {
                x++;
                compat[x] = prefs[i];
            }
        } else {
            var nextstart = (SELECT Start_Time FROM classes WHERE Id = prefs[x]);
            var nextend = (SELECT End_Time FROM classes WHERE Id = prefs[x]);
            var thisstart = (SELECT Start_Time FROM classes WHERE Id = compat[x]);
            var thisend = (SELECT End_Time FROM classes WHERE Id = compat[x]);
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
    for (i; i < compats.length; i++) {
        schedule[x] = compats[i];
        //Increment the num_filled for each class based on the key in schedule[x]
        x++;
    }
    //put the schedule in the database
    return;
}


