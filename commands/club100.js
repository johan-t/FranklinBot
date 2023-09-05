async function handleClub100(interaction) {
    const dmChannel = await interaction.user.createDM();

    await dmChannel.send("Let's see if you are truly a Club 100 member. Please send me the link to one of your merged PRs that has a Lighthouse Score of 100. 👇");

    // listen for user's response
    const filter = message => message.author.id === interaction.user.id;
    const collector = dmChannel.createMessageCollector({ filter, time: 60000 });  // time in milliseconds, 1 minute

    collector.on('collect', async m => {
        console.log(`Collected ${m.content}`);
        
        // Check if it's a GitHub PR link
        const isGithubPR = m.content.match(/^https:\/\/github.com\/[\w-]+\/[\w-]+\/pull\/\d+$/);

        if (isGithubPR) {
            await dmChannel.send("Congrats! You are a Club 100 member! 🎉");
        } else {
            await dmChannel.send("Wrong link buddy, try again 😢");
        }
        collector.stop();
    });
}

module.exports = { handleClub100 };
