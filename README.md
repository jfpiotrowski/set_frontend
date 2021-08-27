# set_frontend
This repo contains the Vue.js based frontend for a multiplayer set application. This application is designed to run on a Raspberry Pi serving a wireless access point. However, it also works from a standard PC on a LAN as well.

## Running the application
* Download the repo
* npm install
* npm run serve
* Make sure the backend is running on the same host!

Note that this is running with a debug webpack server! Also note that this is not secure, so run it on an isolated network.

## Loading the UI
This application serves two single page applications:
* http://<hostname>:8080/        The players' UI (meant to be run from a phone)
* http://<hostname>:8080/#/main  The "main" gameboard UI to be viewed on a TV or shared screen

At this point, players can go to the players' UI, set a name, and play. Stats and the current board should show up on the main screen.
