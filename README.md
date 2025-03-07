

# OAuthLib
Basic OAuth library that helps you implement OAuth2.0 flow into your application.


Directory structure:
└── shubhams2003-oauthlib/
    ├── README.md
    ├── backend/
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── server.js
    │   └── library/
    │       └── oauthClient.js
    └── frontend/
        ├── README.md
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── vite.config.js
        ├── public/
        └── src/
            ├── App.css
            ├── App.jsx
            ├── callback.jsx
            ├── dashboard.jsx
            ├── index.css
            ├── login.jsx
            ├── main.jsx
            ├── userData.jsx
            └── assets/


## Run Locally

Clone the project

```bash
  git clone https://github.com/ShubhamS2003/OAuthLib.git
```

Go to the project directory

```bash
  cd OAuthLib/backend
```

Install dependencies

```bash
  npm install
```

```bash
  cd ..
  cd OAuthLib/frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  cd backend
  npm run dev
```

Open another terminal

```bash
  cd frontend
  npm run dev
```

Note: Check at which port your frontend is running and update it in your .env file, otherwise there will be a cors issue.

## Get Auth0 credentials

- The library class OAuth_Client has 6 parameters: clientId, clientSecret, authUrl, tokenUrl, redirectUri, scope.

- You can generate your own credentials from here and store them in a .env file: https://manage.auth0.com/dashboard/us/dev-galagx8elg75r1ab/

- Make sure that whatever redirect uri you enter here exactly matches the one when you initialise the OAuth_Client class from oauthClient.js.

- The authUrl for Auth0 is: https://dev-galagx8elg75r1ab.us.auth0.com/oauth/authorize

- The tokenUrl for Auth0 is: https://dev-galagx8elg75r1ab.us.auth0.com/oauth/token




## Features

You can find the source code of the library in OAuthLib/backend/library/oauthClient.js.

- initiateLogin() - Starts the login flow by redirecting the user to the authUrl.
- handleCallback(authCode) - Exchanges the auth code with tokens(access, refresh, id).
- refreshToken(refresh_token) - Fetches new access token once the previous one expires.

You can get a better understanding by seeing the implementation of this in /backend and /frontend.


## API Reference

#### Start the OAuth flow.

```http
  GET /api/oauth/login
```

| Parameter | Type     | Response                |
| :-------- | :------- | :------------------------- |
| `none` | `none` | Auth URL |

#### initiateLogin()

Creates a auth url using the client credentials and redirects the user to it.

#### Get tokens

```http
  POST /api/oauth/callback
```

| Parameter | Type     | Response                    |
| :-------- | :------- | :-------------------------------- |
| `code`      | `string` | JSON object with tokens |

#### handleCallback(authCode)

Exchanges auth code for access tokens and stores them in httpOnly cookies.

#### Get user info

```http
  GET /api/getUsers
```

| Parameter | Type     | Response                    |
| :-------- | :------- | :-------------------------------- |
| `idToken`      | `string` | JSON object with user info |

Decodes id_token to extract user information.

#### Protected API endpoint

```http
  GET /dashboard
```

| Parameter | Type     | Response                    |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `string` | Some protected information |

Blocks access to this api endpoint for users who are unauthorized.

#### Logout the user

```http
  POST /api/logout
```

| Parameter | Type     | 
| :-------- | :------- | 
| `none`      | `none` | 

Logs out the user by clearing the cookies that contain the tokens.



## Implementation and Challenges.

- While creating the library I took reference from the functions given in the assignment doc. 
- Apart from that while implementing it in the application I decided to not make any requests from the browser rather all the requests go through the backend server to the OAuth provider. 
- I used Auth0 as my OAuth provider because of it's easy to read and detailed documentation. 
- The most challenging part of this assignment was to understand the flow of operations and integrating everything with each other.

