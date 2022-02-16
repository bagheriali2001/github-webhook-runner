# github-webhook-runner
With this webhook you can update your servers via github webhook requests.

# Config
create .env file like ```example.env``` and put your own github webhook secret in there.
folder structure for current `PATH_TO_SCRIPT_FOLDER = "../scripts"`
```
|─ scripts
|──── repo-branch.sh
|
|─ git-webhook-runner
|──── .env
|──── rest of the project files
```
And for every branch you want to run the script, create a ```.sh``` file and put your script folder.


# Start
Run ```npm start```

Or you can follow this : https://www.digitalocean.com/community/tutorials/how-to-use-node-js-and-github-webhooks-to-keep-remote-projects-in-sync#step-5-installing-the-webhook-as-a-systemd-service 
To run it as service on startup.