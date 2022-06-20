#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();
const GithubWebHook = require('express-github-webhook');
const express = require('express');
const webhookHandler = GithubWebHook({ path: process.env.URL_PATH, secret: process.env.SECRET });

const logger = require('./logger');
const {doesFolderHave, runScript, bootstrapRun} = require('./functions');

const PATH_TO_SCRIPT_FOLDER = process.env.PATH_TO_SCRIPT_FOLDER
let app = express();

app.use(express.json());
app.use(webhookHandler);
 
webhookHandler.on('*', async (event, repo, data) => {
    const branch = data.ref.split('/')[2].trim()
    
    if (event == "push"){ 
        if(!doesFolderHave(repo, branch, PATH_TO_SCRIPT_FOLDER)){
            logger.err(`${repo}-${branch}.sh does not exist`)
            throw Error(`${repo}-${branch}.sh does not exist`)
        }
        const { stdout , stderr } = await runScript(`cd ${PATH_TO_SCRIPT_FOLDER} && bash ${repo}-${branch}.sh`)
        if(stdout.indexOf != -1) {
            logger.info(`${repo}-${branch}.sh ran successfully`)
        }
        else {
            logger.err(`${repo}-${branch}.sh did not run successfully`)
        }
    }
});

bootstrapRun(process.env.PATH_TO_BOOTSTRAP_SCRIPT_FOLDER)

app.listen( process.env.PORT, () => console.log( `Node.js server started on port ${process.env.PORT}.` ) );
