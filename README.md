![alt tag](https://cloud.githubusercontent.com/assets/5309295/6015535/9d6f18b6-abb0-11e4-9559-3e9635fb947a.jpg)
![alt tag](https://cloud.githubusercontent.com/assets/5309295/6015763/e98cf828-abb3-11e4-9654-80fd2486ef30.jpg)
# StepOnYou
CS4344 Project

#Client Side:
Getting Started
Requirement: You need to have nodeJS and npm installed

Instruction:
1. If you don't have bower, grunt installed yet, install it by: 

npm install bower - g 

npm install grunt-cli

2. Go to "client" folder

3. Get node packets and bower packets by:

npm install

bower install

  
4. Running live server and live code update

grunt server

Enjoy!

TEST CLIENT WITHOUT LOGIC COMPONENT YET:
on chrome press f12, in the console type "visualizer.test()".
This will simulate when 1 state is sent from the server to client

###JSON FORMAT

The whole game state changing will be send to client as a single JSON file, format as below.

Create, Update, Remove:
```json
{
	"type": "update",
    "objects": [
		{
			"type": "create",
			"id": 1,
			"x": 100,
			"y": 400,
			"character": "green"
		},
		{
			"type": "update",
			"id": 3,
			"x": 200,
			"y": 300,
			"character": "devil"
		},

		{
			"type": "remove",
			"id": 2
		},
	]
}
```
