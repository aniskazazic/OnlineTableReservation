# ONLINE TABLE RESERVATION

---

**OnlineTableReservation** is a web application that enables users to reserve tables online in different venues, with the ability to choose the exact table they want to sit at.  

**OnlineTableReservation was created by:**  

- [Anis Kazazić](https://github.com/aniskazazic)  
- [Adnan Ulaković](https://github.com/AdnanUlakovic)  
- [Alen Begović](https://github.com/BegovicAlen)  

---

## FUNCTIONALITIES

### Customer (User)
Customers can:  

- View the top 5 venues on the homepage (sorted by rating for each category)  
- Search venues by name, category, or city  
- View venue details: description, working hours, address  
- Book a table and manage reservations  
- Request directions from their address to the venue  
- Leave reviews for venues and rate reviews from other users  
- Add venues to favorites, view favorites, and remove them  
- View and cancel reservations  

### Owner
Owners can:  

- View overview of their venue  
- View and cancel reservations  
- Add and edit workers  
- Manage venue settings  
- Create a custom table floor plan (drag and arrange tables)  

### Worker
Workers can:  

- View and cancel reservations  
- Move tables on the floor plan (same as owner)  

### Admin
Admins can:  

- View application overview: number of users, venues, analytics  
- Add new cities, countries, and categories  
- Delete and reactivate users and venues  

**All roles also have the option to edit their profile.**  

---

## INSTRUCTIONS FOR USE

1. Start `RS1_2024_25_API_template_1.sln` from the backend directory  
2. Inside Package Manager Console, run:  
   ```powershell
   update-database
3. Start the backend project
4. Call the controller /DataSeedGenerateEndpoint/data-seed using Swaggerž
5. Go to the Frontend folder and execute:
    ```bash
   npm install
6. Start the application with:
   ```bash
   ng serve
7. Login credentials:
   - Customer: username: user, password: user
   - Owner: username: owner, password: owner
   - Worker: username: worker, password: worker
   - Admin: username: admin, password: admin
8. Application is ready for use


## ⚠️ Note
This project is created **for educational purposes only**.
