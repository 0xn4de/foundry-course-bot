# foundry-course-bot
A bot that congratulates solvers of the Foundry Course challenges

Made to congratulate people on Twitter who solve challenges and pass their twitter handle to the function when solving

How it works:
- Listen for ChallengeSolved events emitted by contract
- Get Twitter username from event data
- Send a tweet congratulating the user

## Running
You'll first need to run `npm install` to install the required packages

Then, make a file called .env and put required keys in it (check .env.example)

You will need to subscribe to the Twitter API for this.

You can get the Arbitrum WSS RPC URL from [GetBlock](https://getblock.io)

Once that's all done, run `node index.js` and you should be ready to go!

You can reach me on twitter (linked on my profile) if you have any questions.


## Disclaimer

This was a fun little 15-minute adventure and as I don't have Twitter API Keys to completely test it, bugs might occur.
