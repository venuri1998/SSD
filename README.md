## Secure Software Development - SE4030
-- Github repository has two services -- <br>
React frontend project(SSD/frontend) as the UI <br>
NodeJs backend project(SSD/backend) as the application to demonstrate basic Google OAuth2 process

### Setup
Clone the repo and install dependencies. <br>
`git clone https://github.com/venuri1998/SSD.git` <br>
#### Backend
1. `cd frontend`
2. `npm install`
3. Create an .env file in the root directory as follows

`GOOGLE_CLIENT_ID = [Application Client ID]`<br>
`GOOGLE_CLIENT_SECRET = [Application Client Secret]` <br>

`SESSION_NAME = "GoogleOAuthSession"`<br>
`SESSION_SECRET = "secretsecret"` <br>

To start express server, run the following

4. `nodemon app.js`

[ NodeJs project starts on `localhost:3000` ]

#### Frontend
Go back to root folder  using - `cd ..`
1. `cd backend`
2. `npm install`
3. `npm start`

Visit `http://localhost:5000/` on your browser to access the application.
