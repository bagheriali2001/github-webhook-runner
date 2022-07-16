#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();
const GithubWebHook = require('express-github-webhook');
const express = require('express');
const webhookHandler = GithubWebHook({ path: process.env.URL_PATH, secret: process.env.SECRET });

const logger = require('./helpers/logger');
const {doesFolderHave, runScript, bootstrapRun} = require('./helpers/functions');

const PATH_TO_SCRIPT_FOLDER = process.env.PATH_TO_SCRIPT_FOLDER;

const useDiscordNotification = (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_SERVER_ID && process.env.DISCORD_CHANNEL_ID) === 'true';
const { sendInfoToDiscord } = require('./helpers/discord.js');
let app = express();

app.use(express.json());
app.use(webhookHandler);
 
webhookHandler.on('*', async (event, repo, data) => {
    const branch = data.ref.split('/')[2].trim()
    
    if (event == "push"){ 
        let success = "unknown";
        if(!doesFolderHave(repo, branch, PATH_TO_SCRIPT_FOLDER)){
            success = "no-script";
            logger.err(`${repo}-${branch}.sh does not exist`)
        } else {
            const { stdout , stderr } = await runScript(`cd ${PATH_TO_SCRIPT_FOLDER} && bash ${repo}-${branch}.sh`)
            if(stdout.indexOf != -1) {
                success = "successful";
                logger.info(`${repo}-${branch}.sh ran successfully`)
            }
            else {
                success = "failed";
                logger.err(`${repo}-${branch}.sh did not run successfully`)
            }
        }
        if (useDiscordNotification){
            sendInfoToDiscord(event, repo, branch, data, success)
        }
    }
});

bootstrapRun(process.env.PATH_TO_BOOTSTRAP_SCRIPT_FOLDER)

app.listen( process.env.PORT, () => console.log( `Node.js server started on port ${process.env.PORT}.` ) );
