# github-webhook-runner
With this webhook you can update your servers via GitHub webhook requests.

Note that my recommended way of using this webhook server is to use it with `docker` and `systemd`, and all the future versions will be based on these.

# Contents
 - [Tutorial](#tutorial) 
    - [Info](#info)
    - [Script file](#script-file)
      - [Without Docker](#without-docker)
      - [With Docker - Recommended](#with-docker---recommended)
    - [Before you start](#before-you-start)
      - [How to get Discord credentials](#how-to-get-discord-credentials)
    - [Start](#start)
    - [Creating a service](#creating-a-service)
  - [Discord](#discord)
  - [Update Log](#update-log)

# Tutorial
You can use this tutorial to get started with this webhook.

## Info
Example `.env` file:
```dotenv
PATH_TO_SCRIPT_FOLDER = "../scripts"
PATH_TO_BOOTSTRAP_SCRIPT_FOLDER = "../bootstrap-scripts"
PORT = 9000
SECRET = "secret"
URL_PATH = "/webhook"
DISCORD_BOT_TOKEN = "discord-bot-token"
DISCORD_SERVER_ID = "discord-server-id"
DISCORD_CHANNEL_ID = "discord-channel-id"
```


Folder structure for this `PATH_TO_SCRIPT_FOLDER`, `PATH_TO_BOOTSTRAP_SCRIPT_FOLDER` and rest of tutorial.
```
|─ scripts
|──── repo-branch.sh
|─ bootstrap-scripts
|──── repo-branch.sh
|
|─ git-webhook-runner
|──── .env
|──── rest of the project files
|
|─ repo
|──── repo files
```

## Script file
For every branch you want to support, create a `.sh` file and put your script folder.

You can either use docker for your main project or not.

### Without Docker
If you don't use docker you can use following example:
```bash
#!/bin/sh
cd ../repo
git pull
```
If you use this method and your main project is `node.js` I recommend you to use nodemon so when files are changed it will restart server for you. Then simply run `npm start` (you should add start script in your `package.json`, 
like `"scripts": {"start": "nodemon src/index.ts"}`) in your project folder for the first time (and also in case of your server restart).

### With Docker - Recommended
If you use docker you can use following example:
```bash                                                                                     
#!/bin/sh
cd ../repo
git pull
docker stop CONTAINER_NAME
docker rm CONTAINER_NAME
docker build -t IMAGE_NAME:IMAGE_TAG .
docker run -d --name CONTAINER_NAME -p PORT:PORT IMAGE_NAME:IMAGE_TAG
```
In this case this script will automatically stop and delete the container and create a new image with new changes and runs it. Replace `CONTAINER_NAME`, `IMAGE_NAME`, `IMAGE_TAG` and `PORT` with your own values.

If your main project is not in `node.js`, you can search for `Dockerfile` for your own language.


## Before you start
Run `npm install` and create `.env` file like the one at [Info](#info).

### How to get Discord credentials
For creating your application and bot, and getting your `DISCORD_BOT_TOKEN` you can visit [Discord.js Docs](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot). And for finding your `DISCORD_SERVER_ID` and `DISCORD_CHANNEL_ID` the best way to copy channel link of desired channel in Discord. You get a link like `https://discord.com/channels/939xxxxxxxxxxxxxxx/997xxxxxxxxxxxxxxx` the first number (here is `939xxxxxxxxxxxxxxx`) is your `DISCORD_SERVER_ID` and the second number (here is `997xxxxxxxxxxxxxxx`) is your `DISCORD_CHANNEL_ID`.

## Start
Run `npm start`

## Creating a service
First in project directory run `chmod +x index.js` to turn on  the executable mode.

Then in your terminal run `sudo nano /etc/systemd/system/webhook.service` and paste these lines:
```
[Unit]
Description=webhook
After=network.target

[Service]
Environment=PATH_TO_SCRIPT_FOLDER=../scripts
Environment=PATH_TO_BOOTSTRAP_SCRIPT_FOLDER=../bootstrap-scripts
Environment=PORT=9000
Environment=SECRET=secret
Environment=URL_PATH=/webhook
Environment=DISCORD_BOT_TOKEN="discord-bot-token"
Environment=DISCORD_SERVER_ID="discord-server-id"
Environment=DISCORD_CHANNEL_ID="discord-channel-id"
Type=simple
User=YOUR_USER
WorkingDirectory=YOUR_WORKING_DIRECTORY
ExecStart=YOUR_WORKING_DIRECTORY/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```
In first 4 line of [Service] section, place your environment variables and replace `YOUR_USER` and `YOUR_WORKING_DIRECTORY` with your own.

Then exit the file and run `sudo systemctl start webhook`. Check status `sudo systemctl status webhook`. If it is running, you can enable it with `sudo systemctl enable webhook`  and it will automatically restart.

If you changed `webhook.service` file first run `systemctl daemon-reload` then `sudo systemctl restart webhook`

You can always check last 100 the logs with `journalctl --unit=webhook -n 100`  or `journalctl --unit=webhook -n 100 --no-pager` (or you can simply run `journalctl -u webhook`).

# Discord
You can use this Discord bot to send notification messages to your desired Discord channel. In those messages you can use some information about the update and if the last run was successful.

If the run was successful the embedded message color would be green, and if it failed the color would be red. There is one exception and its when we don't have a script to run, it that case the color would be blue.

Right now this webhook only supports `push` events. But plan for next release is to support all events with custom messages.

# Update Log

### V1.1.0

- Added Bootstrap scripts to run on server start.
- Added Discord notifications.
