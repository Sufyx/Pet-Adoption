### Pet Adoption Full Stack Project

[Project deployment link](https://ag-petadoption.onrender.com) <br>
Free hosted server, so it is somewhat slow.

Full-stack web project, fully developed by me. <br>
A mock website for browsing through a large selection of different pets, and adopting/fostering them.
##

### Main Implementation
Project is written in MERN stack.

#### Back End
- REST API, done in the Model–View–Controller architecture.
- Server is written in Node Express, with Object Data Modeling done in Mongoose.
- The database is stored online on a MongoDB Atlas cluster.
- Images are uploaded using Multer NPm, and are stored on Cloudinary.
- Server routes include authentication and validation, using 'AJV' schemas and 'JWT' tokens.
- User passwords are encrypted, using 'Bcrypt'.

#### Front End
- The client side is written in React.
- Design and styling are done with Chakra-UI.
- Page routing and route-protection done with react-router-dom npm.

##
### Description

#### Home Page
<img alt="side_menu" src="Description/home_page.png" width="500" height="auto" >
Home/landing page and welcome message. also contains:

- Real time activity feed for latest actions by users and changes to pets.
- Slideshow showing a random pets. Changes every few seconds. For logged-n users, clicking links to the pet's page.
- Our mascots, the hyper-laser cat and dog.

<br>

#### Sign-up/Log-in
<img alt="signin_screen" src="Description/signin_screen.png" width="500" height="auto" >
A Login/Sign-up. Button for it is on a nav-bar. <br>
Basic validation is in place on the form, and more rigid authentication takes place on the back-end. <br>

<br>

#### Pets Browse
<img alt="pet_search" src="Description/pet_search.png" width="500" height="auto" >
Search for a pet from the database. <br>
Several parameters available to search by. <br>
Advanced search available only to logged-in users. <br>
Search results will be displayed in a grid of small pet cards. <br>
Cards will link to full pet page card.

<br>

#### Pet Card
<img alt="pet_card_available" src="Description/pet_card_available.png" width="500" height="auto" >
<img alt="pet_card_taken" src="Description/pet_card_taken.png" width="500" height="auto" >
Card page for a specific pet from the database. <br>
Contains information about the pet, as well as actions available for it, ie: save/adopt/etc. <br>
The available actions vary according to the pet's adoption status, and their relation to the user. <br>
For instance: <br>
"Adopt"/"Foster" will only be available if the pet was not adopted/fostered by another user. <br>
"Return" will only be available if the pet is already owned by the current user. <br>
"Edit"/"Delete" will only be available for administrators.

<br>

#### User Profile
<img alt="user_profile" src="Description/user_profile.png" width="500" height="auto" >
<img alt="pets_page_saved" src="Description/pets_page_saved.png" width="500" height="auto" >
<img alt="user_details_edit" src="Description/user_details_edit.png" width="500" height="auto" >
Profile page for registered users. <br>
Contains the user details and bio with the option to edit them, <br>
and links to the lists of pets the user has saved/adopted/fostered.

<br>

#### Admin Dashboard
<img alt="dashboard_pets" src="Description/dashboard_pets.png" width="500" height="auto" >
<img alt="dashboard_users" src="Description/dashboard_users.png" width="500" height="auto" >
<img alt="add_edit_pet" src="Description/add_edit_pet.png" width="500" height="auto" >
Administrator exclusive page, which contains:

- Option to add a new pet.
- A detailed list of all registered users. <br> 
Each row links to its user's profile and pets lists, and an option to edit their details and make them an admin.
- A detailed list of all pets in the database, including the pet's adoption status and owner (if they have one). <br>
Each row links to its pet's page.

<br>

##
### General features

- Users will only have access to certain pages and actions based on their access level. 
- User access levels:
  -  Guest (not logged in): Home screen and basic search only.
  -  Registered (logged in): Home, profile page, advanced search, pet cards with ability to adopt/foster/save pets.
  -  Administrator: All registered user access, plus: Able to add/edit/delete pets, view/edit other users profiles.

- Logged users may perform the following actions on the pets in the website:
  - **Adopt/foster:** Only doable for pets that were not adopted/fostered by another user. <br>
  The user will then become the pet's owner, and it will no longer be available for other users to adopt/foster. <br>
  Will add the pet to the user's pets-page on their profile, under "adopted/fostered pets".
  - **Save:** Doable for all pets. <br>
  Acts as a bookmark by adding any pet to the user's pets-page on their profile, under "saved pets".
  - **Return:** Only doable for pets the user has previously adopted/fostered. <br>
  Will make the pet available for other users again. <br>
  Removes the pet from the user's pets-page on their profile.
  - **Unsave:** Only doable for pets the user has previously saved. <br>
  Removes the pet from the user's pets-page on their profile.
  - Administrator only actions:
    - **Delete:** Removes the pet from the database, and from the lists of any users who owned or saved it.
    - **Edit:** Change the pet's details.

- Users remain logged in for the next session, using to local storage of 'JWT' tokens.

##

:)
