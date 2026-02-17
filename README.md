OnlineTableReservation

What is <b>OnlineTableReservation</b>?

<hr> 
<b>OnlineTableReservation</b> is a web application that enables users to reserve tables online in different venues, with the ability to choose the exact table they want to sit at. <br> OnlineTableReservation was made by: 

<ul> <li> <a href="https://github.com/aniskazazic">Anis Kazazić </a> </li> </ul> 
<ul> <li> <a href="https://github.com/AdnanUlakovic">Adnan Ulaković</a> </li> </ul>
<ul> <li> <a href="https://github.com/BegovicAlen">Alen Begović</a> </li> </ul> 

<br>

<b>Functionalities</b>

<hr>

<b>Customer (User)</b>
Customers can:

<ul> <li>View the top 5 venues on the homepage (sorted by rating for each category)</li> <li>Search venues by name, category, or city</li> <li>View venue details: description, working hours, address</li> <li>Book a table and manage reservations</li> <li>Request directions from their address to the venue</li> <li>Leave reviews for venues and rate reviews from other users</li> <li>Add venues to favorites, view favorites, and remove them</li> <li>View and cancel reservations</li> </ul>

<b>Owner</b>
Owners can:

<ul> <li>View overview of their venue</li> <li>View and cancel reservations</li> <li>Add and edit workers</li> <li>Manage venue settings</li> <li>Create a custom table floor plan (drag and arrange tables)</li> </ul>

<b>Worker</b>
Workers can:

<ul> <li>View and cancel reservations</li> <li>Move tables on the floor plan (same as owner)</li> </ul>

<b>Admin</b>
Admins can:

<ul> <li>View application overview: number of users, venues, analytics</li> <li>Add new cities, countries, and categories</li> <li>Delete and reactivate users and venues</li> </ul>

<b>All roles also have the option to edit their profile.</b><br>


<b>Instructions for use</b><br>

<ul> <li>Start RS1_2024_25_API_template_1.sln from the backend directory</li> <li>Inside package manager console insert command: <code>update-database</code></li> <li>Start the backend project</li> <li>Call the controller <code>/DataSeedGenerateEndpoint/data-seed</code> using Swagger</li> <li>Go to the folder <b>Frontend</b> and execute the command <code>npm install</code></li>
<li>Start the application with command <code>ng serve</code></li> 
<li>Login data for customer: <code>username: user</code> <code>password: user</code></li> 
<li>Login data for owner: <code>username: owner</code> <code>password: owner</code></li> 
<li>Login data for worker: <code>username: worker</code> <code>password: worker</code></li> 
<li>Login data for admin: <code>username: admin</code> <code>password: admin</code></li>
<li>Application is ready for use</li> </ul>


## ⚠️ Note
This project is created **for educational purposes only**.  
