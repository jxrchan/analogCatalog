# ANALOG CATALOG


<img src = "images/App-logo.png" width= "400px" height="400px"/>

ANALOG CATALOG (although I would have preferred "Analogue Catalogue" because British Enlgish) is targeted at record enthusiasts looking to catalogue and value their vinyl collections. The application was designed in React.js and completed as a professional course project. It uses the open-source Discogs© webAPI, fetching data from Discog's database and marketplace to present consolidated information about your records.

## Background:
Discogs is the largest community-driven online database and marketplace for all things vinyl. Users can discover new artists and albums, or purchase rare vinyls from their favourite artists.
Think of Discogs as a Carousell except its more international and just for physical music.

As a vinyl collector myself, I have relied on maintaining an excel sheet to keep track of the music I own. That has, however, been laborious as I have had to key individual details of each record.

I recently learnt that Discogs provided a free-to-use WebAPI (Application Programming Interface) for developers to access their database.  And  so, I embarked on the Analog Catalog project. Using my recently acquired skills in React.js and API calls, I looked to design a simple application, allowing users to tap into Discog's database and marketplace to maintain their own electronic database with simple clicks. 

No more of that weary excel crunching! 

## Technologies Used:

- HTML 5
- CSS 3
- Javascript 
- React.js
- Discogs API 
- Airtable 
- Postman
- Docker

<!-- ## How to Start

Access the project's public board [here](https://github.com/users/jxrchan/projects/1) 

Setting Up Guide
Clone the Repository:

git clone https://github.com/aetheryn/ga-project-4
Navigate to the Frontend Directory:

cd ./frontend
Create a .env file:

touch .env
Open and update the .env file with the frontend environment variables.

Install Dependencies:

npm install
Start the Development Server:

npm run dev
Access the Application: Open your browser and visit http://localhost:5173

Start a new terminal.

Naviate to the Backend Directory:

cd ./backend
Create a .env file:
touch .env
Open and update the .env file with the backend environment variables.

Install Dependencies:

npm install
Start the Development Server:
npm run dev
The backend server will be running on http://localhost:5001.
Environment Variables
Frontend
VITE_SERVER=http://localhost:5001 #ENSURE THAT PORT CORRESPONDS TO THAT IN BACKEND ENV -->



## Application Interface 

<img src= "./images/login_page.png">

The application begins with a login page which currently has no implemented authentication logic.  

*Username is stored in a state which is then passed into the airtable. It is used as an unique identifier to display the user's custom records* 

<img src="./images/search_page.png">

Search records at the Home page using any combination of artist name, record title, and format. Hover over your record of interest and click on add to collection or wishlist. Navigate to previous and next search results using the link at the bottom of the page.

*This page uses the search endpoint of Discog's API. I have currently limited the fetch query to display 15 results per page. *

<img src="./images/collection_page.png">
<img src="./images/update_modal.png">

The collection pages displays two lists, "My Collection", and ,"My Wishlist" which populates based on your actions in the Home page. Further information, including genres and current marketplace price (unfortunately only USD at this point) for your selected records are automatically stored in this table. 

The 'More' button navigates to Discogs's webpage for the record.
The 'Update' button allows users to input more information about their collected record.
The 'Delete' button removes a record from the database

*This page uses the 'Release' endpoint of Discog's API to fetch further details about records of interest where were not in the 'Search' endpoint. Updating and deleting records work through airtable's API.*

## Credits & Attributions:

- This game uses the Rajdhani and Ubuntu sans-serif fonts designed by Jyotish Sonowal and Satya Rajpurohit, and Dalton Maag respectively.
- The background image was generated using Bing's image creator tool that runs on Microsoft Copilot
- Discogs and all their awesome users. 

## Next Steps:

Future iterations of the project may include the following:
- 
- 
