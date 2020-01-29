const express = require('express')
const app = express(); 
const async = require('async');
const fs = require('fs');

// const englishCsv = "Teacher wise class timetable - English.csv";
// const hindiCsv = "Teacher wise class timetable - Hindi.csv";
// const mathsCsv = "Teacher wise class timetable - Maths.csv";
// const scienceCsv = "Teacher wise class timetable - Science.csv";
// const kanadaCsv = "Teacher wise class timetable - Kanada.csv";
const csvFiles = [
    "Teacher wise class timetable - Maths.csv",
    "Teacher wise class timetable - Science.csv",
    "Teacher wise class timetable - English.csv",
    "Teacher wise class timetable - Kannada.csv",
    "Teacher wise class timetable - Hindi.csv"
];
let orginalTimetables = {

}

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//Teacher wise class timetable - English.csv
function readAsync(file, callback) {
    fs.readFile('public/csvFiles/'+file, 'utf8', callback);
}
app.get('/home', (req, res) => {
    // fs.readFile('public/csvFiles/'+hindiCsv, function(err, data) {
    //     var sss = parseCSV(data.toString());
    //     console.log(sss);
    // });
    async.map(csvFiles, readAsync, function(err, results) {
        // console.log(results);
        // results = ['file 1 content', 'file 2 content', ...]
        orginalTimetables['Maths'] = parseCSV(results[0].toString())
        orginalTimetables['Science'] = parseCSV(results[1].toString())
        orginalTimetables['English'] = parseCSV(results[2].toString())
        orginalTimetables['Kannada'] = parseCSV(results[3].toString())
        orginalTimetables['Hindi'] = parseCSV(results[4].toString())

        let subject;
        let class_6 = {};
        for(subject in orginalTimetables){
            console.log(subject);
            for(var i=1; i<orginalTimetables[subject].length;i++){
                let tempKey = orginalTimetables[subject][i][0]
                for(var c=1; c<7;c++){
                    
                    if(orginalTimetables[subject][i][c]=="6th"){
                        if(class_6.hasOwnProperty(tempKey))
                        {
                            let temp = class_6[tempKey]
                            temp[c] = subject;
                            class_6[tempKey] = temp;

                        }
                        else{
                            let temp = [];
                            temp[c] = subject;
                            class_6[tempKey] = temp;
                        }
                        
                    }
                    else if(orginalTimetables[subject][i][c]=="7th"){
                        if(class_6.hasOwnProperty(tempKey))
                        {
                            let temp = class_6[tempKey]
                            temp[c] = subject;
                            class_6[tempKey] = temp;

                        }
                        else{
                            let temp = [];
                            temp[c] = subject;
                            class_6[tempKey] = temp;
                        }
                        
                    }
                    
                }

            }
            

        }
        //console.log(orginalTimetables['Hindi']);
        console.log(class_6);
    });
    res.send('Hello World!')
});

function parseCSV(str) {
    var arr = [];
    var quote = false; 

    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || []; 
        arr[row][col] = arr[row][col] || ''; 

        if (cc == '"' && quote && nc == '"') { 
            arr[row][col] += cc; ++c; continue;
        }  
        
        if (cc == '"') { 
            quote = !quote; continue;
        }

        if (cc == ',' && !quote) { ++col; continue; }

        if (cc == '\r' && nc == '\n' && !quote) { 
            ++row; col = 0; ++c; continue;
        }

        if (cc == '\n' && !quote) {
            ++row; col = 0; 
            continue; 
        }
        if (cc == '\r' && !quote) { 
            ++row; col = 0; 
            continue;
        }
        arr[row][col] += cc;
    }
    return arr;
}

const hostname = '127.0.0.1';
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});