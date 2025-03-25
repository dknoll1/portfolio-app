# portfolio-app
React/Firebase App with IRC Chat

This portfolio app showcases projects, resume information, and includes an IRC chat feature powered by Cloudflare Workers.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy-worker`

Deploys the Cloudflare Worker that handles the IRC chat functionality. You need to have a Cloudflare account and be logged in with Wrangler CLI.

## Setting Up the IRC Chat Feature

The application includes an IRC chat feature that allows users to connect to IRC servers and join channels. This is implemented using:

1. A React frontend chat interface
2. Cloudflare Workers for backend IRC communication
3. WebSockets for real-time messaging
4. Durable Objects for stateful connections

### Prerequisites

1. A Cloudflare account (sign up at [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up))
2. Node.js and npm installed
3. Access to Durable Objects (available on paid Cloudflare plans or with a special allowlist for free plans)

### Cloudflare Authentication Setup

You have two options for authenticating with Cloudflare's API:

#### Cloudflare Global API Key (Legacy)

1. Log in to the Cloudflare dashboard
2. Go to **My Profile > API Tokens**
3. In the **API Keys** section, view your **Global API Key**
4. Update `.env.local`:
   ```
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_EMAIL=your_email@example.com
   CLOUDFLARE_API_KEY=your_global_api_key
   ```

### Deploying the IRC Worker

1. **Install Wrangler CLI** (if not already installed)
   ```bash
   npm install -g wrangler
   ```

2. **Login to Wrangler** (if not already logged in)
   ```bash
   wrangler login
   ```

3. **Deploy the Worker**
   ```bash
   npm run deploy-worker
   ```

4. **Build & Deploy**
   ```bash
   npm run build && npm run deploy

### Troubleshooting Deployment

If you encounter issues deploying the worker:

1. **Durable Objects Access**: Make sure your Cloudflare account has access to Durable Objects. This might require:
   - A paid Cloudflare plan, or
   - Special allowlisting for the free plan (contact Cloudflare support)
   - More info: [Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/get-started/)

2. **Authentication Issues**:
   - Verify your API token or Global API key is correct
   - Ensure the token has the necessary permissions
   - Double-check your account ID

3. **Worker Name Conflicts**:
   - If there's a name conflict, edit `wrangler.toml` and change the `name` field

### Using the Chat Feature

1. Navigate to the "Chat" page in the portfolio app
2. Enter the IRC server (default: irc.freenode.org)
3. Provide a nickname or use default..
4. Enter a channel to join (default: #cafe)
5. Click "Connect"

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
