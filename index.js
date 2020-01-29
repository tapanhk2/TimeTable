const express = require('express')
const app = express();
const async = require('async');
const fs = require('fs');
 
const csvFiles = [
   "Teacher wise class timetable - Maths.csv",
   "Teacher wise class timetable - Science.csv",
   "Teacher wise class timetable - English.csv",
   "Teacher wise class timetable - Kannada.csv",
   "Teacher wise class timetable - Hindi.csv"
];
let orginalTimetables = {}
let classWiseTimetables = {}
 
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
 
function readAsync(file, callback) {
   fs.readFile('public/csvFiles/'+file, 'utf8', callback);
}
function getDay(c){
   switch(c)
   {
       case 1: return "Monday"; break;
       case 2: return "Tuesday"; break;
       case 3: return "Wednesday"; break;
       case 4: return "Thursday"; break;
       case 5: return "Friday"; break;
       case 6: return "Saturday"; break;
   }
}
app.get('/', (req, res) => {
 
   async.map(csvFiles, readAsync, function(err, results) {
      
       orginalTimetables['Maths'] = parseCSV(results[0].toString())
       orginalTimetables['Science'] = parseCSV(results[1].toString())
       orginalTimetables['English'] = parseCSV(results[2].toString())
       orginalTimetables['Kannada'] = parseCSV(results[3].toString())
       orginalTimetables['Hindi'] = parseCSV(results[4].toString())
 
       console.log(orginalTimetables['Maths']);
       console.log('++++++++++++++++++++++++++++++++++++');
       let subject;
       let class_temp = {
           '8:00 AM' : [], '9:00 AM' : [],'10:00 AM' : [], '11:00 AM' : [], '12:00 PM' : [], '1:00 PM' : [], '2:00 PM' : [], '3:00 PM' : [], '4:00 PM' : [],
       }
       let class_6 = JSON.parse(JSON.stringify(class_temp))
       let class_7 = JSON.parse(JSON.stringify(class_temp))
       let class_8 = JSON.parse(JSON.stringify(class_temp))
       let class_9 = JSON.parse(JSON.stringify(class_temp))
       let class_10 = JSON.parse(JSON.stringify(class_temp))
 
       let timetablesAllObj = {}
       for(subject in orginalTimetables){
           //console.log(subject);
           for(var i=1; i<orginalTimetables[subject].length;i++){
               let tempKey = orginalTimetables[subject][i][0]
               for(var c=1; c<7;c++){
                  
                   /**
                    * class wise time table
                    */
                   if(orginalTimetables[subject][i][c]=="6th"){
                       if(class_6.hasOwnProperty(tempKey))
                       {
                           let temp = class_6[tempKey]
                           temp[c-1] = subject;
                           class_6[tempKey] = temp;
 
                       }
                       else{
                           let temp = [];
                           temp[c-1] = subject;
                           class_6[tempKey] = temp;
                       }
                      
                   }
                   else if(orginalTimetables[subject][i][c]=="7th"){
                       if(class_7.hasOwnProperty(tempKey))
                       {
                           let temp = class_7[tempKey]
                           temp[c-1] = subject;
                           class_7[tempKey] = temp;
 
                       }
                       else{
                           let temp = [];
                           temp[c-1] = subject;
                           class_7[tempKey] = temp;
                       }
                   }
                   else if(orginalTimetables[subject][i][c]=="8th"){
                       if(class_8.hasOwnProperty(tempKey))
                       {
                           let temp = class_8[tempKey]
                           temp[c-1] = subject;
                           class_8[tempKey] = temp;
 
                       }
                       else{
                           let temp = [];
                           temp[c-1] = subject;
                           class_8[tempKey] = temp;
                       }
                   }
                   else if(orginalTimetables[subject][i][c]=="9th"){
                       if(class_9.hasOwnProperty(tempKey))
                       {
                           let temp = class_9[tempKey]
                           temp[c-1] = subject;
                           class_9[tempKey] = temp;
 
                       }
                       else{
                           let temp = [];
                           temp[c-1] = subject;
                           class_9[tempKey] = temp;
                       }
                   }
                   else if(orginalTimetables[subject][i][c]=="10th"){
                       if(class_10.hasOwnProperty(tempKey)){
                           let temp = class_10[tempKey]
                           temp[c-1] = subject;
                           class_10[tempKey] = temp;
 
                       }
                       else{
                           let temp = [];
                           temp[c-1] = subject;
                           class_10[tempKey] = temp;
                       }
                   }
                   /**
                    * end class wise time table
                    */
                   let tempClass = orginalTimetables[subject][i][c]
                   if(tempClass != "")
                   {
                       let tempDay = getDay(c);
                       let tempKey2 = tempDay +"-"+tempKey;
                       let tempOb = {
                           subject:subject,
                           time:tempKey,
                           day:tempDay,
                           class:tempClass
                       }
                       if(timetablesAllObj.hasOwnProperty(tempKey2)){
                           var earlyArr = timetablesAllObj[tempKey2];
                           earlyArr.push(tempOb)
                           timetablesAllObj[tempKey2] =  earlyArr;
                       }
                       else{
                      
                           timetablesAllObj[tempKey2] = [tempOb];
                       }
                   }
                  
               }
 
           }
          
 
       }
       //console.log("timetablesAllObj", timetablesAllObj);
       //console.log(orginalTimetables['Hindi']);
       classWiseTimetables['class_6'] = class_6
       classWiseTimetables['class_7'] = class_7
       classWiseTimetables['class_8'] = class_8
       classWiseTimetables['class_9'] = class_9
       classWiseTimetables['class_10'] = class_10
       res.render('home', {
           classWiseTimetables: classWiseTimetables,
           timetablesAllObj: timetablesAllObj
       });
     
   });
   //res.send('Hello World!')
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
