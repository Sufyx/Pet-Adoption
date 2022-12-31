### Pet Adoption Full Stack Project

Full-stack web project, fully developed by me. <br>
A mock website for browsing through a large selection of different pets, and adopting/fostering them.
##

### Implementation

#### Back End
- The database is stored online on a MongoDB Atlas cluster.
- Server is written in Node express, with Object Data Modeling done in Mongoose.
- Routes include authentication and validation using Jason web tokens.
- User passwords are encrypted.

#### Front End
- The client side is done in React and designed with Chakra-UI.
- Page access and actions are restricted depending on user (guest / registered / admin).

##
### Description
#### Home Page
<img alt="signin_screen" src="Description/signin_screen.png" width="500" height="auto" >
Simple home page and welcome message. <br>  
Login/Sign-up and navigation menu on the nav-bar. <br>
Basic validation in place for login/sign-up. <br>
<img alt="side_menu" src="Description/side_menu.png" width="500" height="auto" >
The options on the navigation menu will be limited according to the user's access level.

#### Pets Browse
<img alt="pet_search" src="Description/pet_search.png" width="500" height="auto" >
Search for a pet from the database. <br>
Several parameters available to search by, advanced search available only to logged-in users. <br>
Search results will be displayed in the form of small pet cards. <br>
Cards will link to full pet page card.


#### Pet Card
<img alt="pet_card_available" src="Description/pet_card_available.png" width="500" height="auto" >
<img alt="pet_card_taken" src="Description/pet_card_taken.png" width="500" height="auto" >
Card page for a specific pet from the database. <br>
Contains general details, as well as buttons for actions available to the users relating to the pet, ie: save/adopt/foster. <br>
The available actions vary depending on the pet's adoption status, and their relation to the user. <br>
For example: <br>
"Adopt"/"Foster" will only be available if the pet was not adopted/fostered by another user. <br>
"Return" will only be available if the pet was adopted/fostered specifically by the current user. <br>
"Edit" pet will only be available for admins.

#### User Profile
<img alt="user_profile" src="Description/user_profile.png" width="500" height="auto" >
Profile page for registered users. <br>
Contains the option to add a short bio, and links to the lists of pets the user has saved/adopted/fostered.
<img alt="pets_page_saved" src="Description/pets_page_saved.png" width="500" height="auto" >
<img alt="user_details_edit" src="Description/user_details_edit.png" width="500" height="auto" >


#### Admin Dashboard
Administrator exclusive page, which contains:
- A detailed list of all registered users. Links to their profile and pets lists, and an option to edit their details and make them an admin.
- A detailed list of all pets in the database, including the pet's adoption availability and owner (if they have one). 
- Option to add a new pet.

<img alt="dashboard_pets" src="Description/dashboard_pets.png" width="500" height="auto" >
<img alt="dashboard_users" src="Description/dashboard_users.png" width="500" height="auto" >
<img alt="add_edit_pet" src="Description/add_edit_pet.png" width="500" height="auto" >

##
##### General features
- Users that didn't log out will remain logged in on next session, thanks to local storage of jwt.
- Users will only have access to certain pages and actions based on their access level.
- User access levels:
  -  Guest (not logged in): Home screen and basic search only.
  -  Registered (logged in): Home, profile page, advanced search, pet cards with ability to adopt/foster/save pets.
  -  Administrator: All registered user access, plus: Able to add/edit/delete pets, view/edit other users profiles.

