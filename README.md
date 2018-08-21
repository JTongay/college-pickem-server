# NCAA Top 25 pick em' & NFL pick 2 league API

### This project is a Web Scraper/RESTful API with full token based authentication and TDD

## Installing Guide
- Install Node.js via homebrew
```bash
brew install node
```
- Install NVM (node version manager)
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
- Make sure you are using Node 8
```bash
node -v
> v8.0.0
```
- Install postgresql 
```bash
brew install postgresql
```
- Install the dependencies
```bash
npm install
```
- Make sure you have postgres started and run these commands to set up the databases
```bash
createdb football_game_dev
createdb football_game_test
npm run db-test
npm run db-dev
```
- To start the application, run the command in dev mode
```bash
npm run dev
```
- The port should be listening on 3000

#### Technologies used

- Node.js v7.0.0
- Express
- Postgres
- Knex.js (ORM)
- Cheerio
- Nodemailer
- Node-cron

#### Testing frameworks

- Mocha
- Chai
- Supertest

#### Challenges Faced

- Building a web scraper due to a non-existent free sports schedule API.
- Utilizing multiple Cron Jobs for scraping, scoring, and sending email reminders.
- Strategy of data structure.

### Features Done
- Creating Account
- Login
- Scraping college football schedule and returning results

### Link to Docs
[https://jtongay.github.io/college-pickem-server-docs/index.html]
