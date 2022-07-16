const { Client, Guild } = require("discord.js");

const myClient = new Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
});
myClient.login(process.env.DISCORD_BOT_TOKEN);

const myGuild = new Guild(myClient, { id: process.env.DISCORD_SERVER_ID });

async function sendInfoToDiscord(event, repo, branch, data, success) {
    const channel = await myGuild.channels.fetch(process.env.DISCORD_CHANNEL_ID)
	let color = 0x0099ff;
	let footerMessage = "Script not found 🤔";
	if (success === "successful") {
		color = 0x00ff00;
		footerMessage = "Deployed successfully 😉"
	}
	else if (success === "failed"){
		color = 0xff0000;
		footerMessage = "Deploy Failed 😱";
	}

    const embed = {
		color: color,
		title: `GitHub (${event}) action on ${repo}/${branch}`,
		url: `${data.repository.url}/tree/${branch}`,
		author: {
			name: data.pusher.name,
			icon_url: `https://github.com/${data.pusher.name}.png`,
			url: `https://github.com/${data.pusher.name}`,
		},
		description: `Commit count ${data.commits.length}`,
		fields: [
			{
				name: 'Head Commit Info',
				value: `Commit Message: ${data.head_commit.message}
				Committer: ${data.head_commit.committer.name}
				Commit Url: ${data.head_commit.url}`,
			},
		],
		timestamp: new Date(),
		footer: {
			text: footerMessage,
		},
	};

    await channel.send({ embeds: [embed] });
}

module.exports = {
    sendInfoToDiscord,
};