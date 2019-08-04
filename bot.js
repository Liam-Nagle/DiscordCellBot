var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var valueThor = 0;
var valueWeiner = 0;
var valueVapor = 0;
var valueSiamese = 0;

const prefix = "!" //set bot prefix

let clockedInTimeH;
let clockedInTimeM;
let clockedInTimeS;
let clockedOutTimeH;
let clockedOutTimeM;
let clockedOutTimeS;
let ClockedInTotal;
let objToday;
let today;
let time;
let timeH;
let timeM;
let timeS;
let value;
let currentvalue;
var data = fs.readFileSync('users.json')
var users = JSON.parse(data);

function updateTime(){
	
	objToday = new Date(),
		weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
		dayOfWeek = weekday[objToday.getDay()],
		domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
		dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
		months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
		curMonth = months[objToday.getMonth()],
		curYear = objToday.getFullYear(),
		curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
		curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
		curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
		curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
	today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear + "\n__**LOCAL TIME**__";
	timeH = curHour;
	timeM = curMinute;
	timeS = curSeconds;
}
setInterval(updateTime, 1000);



function addUser(username, value) {
	
}

function addValue(username, value) {
	
}



// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.startsWith(prefix)) { // Message starts with prefix
        let command = message.slice(prefix.length).split(" "); // Split message into words
        switch (command[0]) { // Execute code depending on first word
            // !help
			case 'help':
			
			var embeded = {
			  "content": "this `supports` __a__ **subset** *of* ~~markdown~~ 😃 ```js\nfunction foo(bar) {\n  console.log(bar);\n}\n\nfoo(1);```",
			  "embed": {
				"title": "title ~~(did you know you can have markdown here too?)~~",
				"description": "this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown. ```\nyes, even code blocks```",
				"url": "https://discordapp.com",
				"color": 1444321,
				"timestamp": "2019-08-04T00:00:10.356Z",
				"footer": {
				  "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
				  "text": "footer text"
				},
				"thumbnail": {
				  "url": "https://cdn.discordapp.com/embed/avatars/0.png"
				},
				"image": {
				  "url": "https://cdn.discordapp.com/embed/avatars/0.png"
				},
				"author": {
				  "name": "author name",
				  "url": "https://discordapp.com",
				  "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
				},
				"fields": [
				  {
					"name": "🤔",
					"value": "some of these properties have certain limits..."
				  },
				  {
					"name": "😱",
					"value": "try exceeding some of them!"
				  },
				  {
					"name": "🙄",
					"value": "an informative error should show up, and this view will remain as-is until all issues are fixed"
				  },
				  {
					"name": "<:thonkang:219069250692841473>",
					"value": "these last two",
					"inline": true
				  },
				  {
					"name": "<:thonkang:219069250692841473>",
					"value": "are inline fields",
					"inline": true
				  }
				]
			  }
			}
			
               bot.sendMessage({
                   to: channelID,
                   message: "Helpful Commands",
				   [embed]: embeded
			   });
            break;
			
			// !clockin
            case 'clockin':
                bot.sendMessage({
                    to: channelID,
                    message: user + " has clocked in at \n" + today
                });
				
				clockedInTimeH = timeH;
				clockedInTimeM = timeM;
				clockedInTimeS = timeS;
            break;
			// !clockout
			case 'clockout':
				clockedOutTimeH = timeH;
				clockedOutTimeM = timeM;
				clockedOutTimeS = timeS;
				
				clockedInTotal = ((clockedOutTimeH - clockedInTimeH) < 10 ? "0" + (clockedOutTimeH - clockedInTimeH) : (clockedOutTimeH - clockedInTimeH)) + ":" + ((clockedOutTimeM - clockedInTimeM) < 10 ? "0" + (clockedOutTimeM - clockedInTimeM) : (clockedOutTimeM - clockedInTimeM)) + ":" + ((clockedOutTimeS - clockedInTimeS) < 10 ? "0" + (clockedOutTimeS - clockedInTimeS) : (clockedOutTimeS - clockedInTimeS));
				bot.sendMessage({
					to: channelID,
					message: user + " has clocked out at \n" + today + "\nClocked in for: " + clockedInTotal
				});
			break;
			// !addvalue
			case 'addvalue':
				value = parseInt(command[1]);
				//addUser(user, value);
				
				//WOULD BE NICE THIS WAY BUT JUST CHECK IF USER = NAME AND THEN MAKE SURE ITS ONLY THE 4 PEOPLE THAT ARE IN THE CELL. SIAMESE ME WEINER ND VAPOR.
				
				if(user == "Thorgrim102") {
					valueThor += value;
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n" + user + " __**Total Value:**__ " + valueThor
					});
				} else if (user == "weinerdog102") {
					valueWeiner += value;
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n" + user + " __**Total Value:**__ " + valueWeiner
					});
				} else if (user == "Vaporizr243") {
					valueVapor += value;
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n" + user + " __**Total Value:**__ " + valueVapor
					});
				} else if (user == "MySiameseTwin") {
					valueSiamese += value;
					bot.sendMessage({
						to: channelID,
						message: user + " has added " + value + " Value \n" + user + " __**Total Value:**__ " + valueSiamese
					});
				}
				
			break;
            // Just add any case commands if you want to..
         }
     }
});