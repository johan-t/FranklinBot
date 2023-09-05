const axios = require('axios');
const crypto = require('crypto'); 
const { github_token } = require('../config.json');

async function handleClub100(interaction) {
    const dmChannel = await interaction.user.createDM();
  
    // Generate a random verification code
    const verificationCode = crypto.randomBytes(8).toString('hex');
  
    await dmChannel.send(`Firstly, let's verify it's really you. Please add this verification code as a comment in your PR: **${verificationCode}**.\nThen send me the link to one of your merged PRs that has a Lighthouse Score of 100. 👇`);

    const filter = message => message.author.id === interaction.user.id;
    const collector = dmChannel.createMessageCollector({ filter, time: 120000 });

    collector.on('collect', async m => {
        console.log(`Collected ${m.content}`);

        const isGithubPR = m.content.match(/^https:\/\/github.com\/([\w-]+)\/([\w-]+)\/pull\/(\d+)$/);

        if (isGithubPR) {
            const [_, owner, repo, pull_number] = isGithubPR;

            try {
                const prResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`, {
                    headers: {
                        'Authorization': `token ${github_token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                const prAuthorId = prResponse.data.user.id;

                if (prResponse.data.merged) {
                    const commentsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues/${pull_number}/comments`, {
                        headers: {
                            'Authorization': `token ${github_token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    });

                    const verificationComment = commentsResponse.data.find(comment => {
                        return comment.body.includes(verificationCode);
                    });

                    if (verificationComment && verificationComment.user.id === prAuthorId) {
                        const performance100Comment = commentsResponse.data.find(comment => {
                            return comment.user.id === 43241697 && comment.body.includes('PERFORMANCE-100');
                        });

                        if (performance100Comment) {
                            await dmChannel.send("Congrats! You truly are a Club 100 member! 💯");
                        } else {
                            await dmChannel.send("Sorry, couldn't find a performance score of 100. Write better code next time! 😠");
                        }
                    } else {
                        await dmChannel.send("Failed verification. The verification code is either not found in the PR comments or was not commented by the PR author. 😔");
                    }
                } else {
                    await dmChannel.send("This PR has not been merged. 😔");
                }
            } catch (err) {
                console.error(err);
                await dmChannel.send("An error occurred while checking your PR. 😭");
            }
          
            collector.stop();
        } else {
            await dmChannel.send("Wrong link buddy, try again 😢");
        }
    });
}

module.exports = { handleClub100 };
