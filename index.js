const { TwitterApi } = require("twitter-api-v2");
const Web3 = require('web3');
require('dotenv').config();

// Twitter API credentials
const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
});
const twitterClient = client.readWrite;
const options = {
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000 // ms
    },
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
  };

let web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WSS_RPC_URL, options))
let contract = new web3.eth.Contract([{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"solver","type":"address"},{"indexed":false,"internalType":"address","name":"challenge","type":"address"},{"indexed":false,"internalType":"string","name":"twitterHandle","type":"string"}],"name":"ChallengeSolved","type":"event"}], "0x39338138414Df90EC67dC2EE046ab78BcD4F56D9")
async function handle_event(event) {
    let {solver, challenge, twitterHandle} = event.returnValues;
    if (!twitterHandle.startsWith("@")) {
        twitterHandle = "@" + twitterHandle;
    }
    const text = `${solver} has solved a challenge at ${challenge}!\n\nCongratulations, ${twitterHandle}!`
    tweetCongrats(text)

}
async function tweetCongrats(text) {
    try {
        await twitterClient.v2.tweet(text);
    
        console.log("Tweet sent, solver congratulated!");
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}
contract.events.ChallengeSolved({
    fromBlock:"latest"
})
.on('data', async function(event){
    handle_event(event)
})
.on('error', console.error);



/*
NOTE:
You can test out the code instead of waiting for a challenge to be solved by replacing lines 46-52 with this:

contract.events.ChallengeSolved({
    fromBlock:99740826 
})
.on('data', async function(event){
    handle_event(event)
})
.on('error', console.error);

This will run code for previously solved challenge txs. You can also edit the fromBlock to be more recent if you don't want Twitter to be spammed (in case many challenges have been solved)
You can then switch it back after.
*/
