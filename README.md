# 👷 A Cloudflare Worker to lock 🔓 a webpage

A Cloudflare worker which lets website owners easily deploy an access control layer for monetization with [Unlock](https://unlock-protocol.com).

You can try it out by going to https://token-gated.com/ which is token gated an requires ownership of a membership (it is using the Rinkeby test network, so you don't need to spend real money).

## How to

### Clone the repo:

```bash
git clone git@github.com:unlock-protocol/cloudflare-worker.git
```

### Configure worker

Update its `.src/config.js` file to match your needs. Importantly, you need to keep the `pessimistic` mode to be `true` .

### Install dependencies

```bash
yarn
```

### Push to cloudflare

```bash
yarn wrangler publish
```

(You will likely be prompted to login to CloudFlare first)

### Configure website

Now that the worker is deployed, you need to link it to your CloudFlare sites. Your mileage may vary but here is howe we did it for https://token-gated.com. From the Cloudflare Dashboard, select your website, in the left column, click on "Workers". Click the `Add Route` button. Enter the route(s) you want to "token-gate". In the `Service` select, pick the `unlock-cloudflare-worker` and select the environment of choice. Hit `Save`. You're all set!

![Screen Recording 2022-02-05 at 05 38 31 PM](https://user-images.githubusercontent.com/17735/152661436-347c9ccf-a9fb-4d1e-8b3a-817ecfb2a887.gif)

## Contributing

You are encouraged to open pull-requests and help us improve this worker!
