namespace RS1_2024_25.API.Endpoints.DataSeed;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper.Api;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[Route("data-seed")]
public class DataSeedGenerateEndpoint(ApplicationDbContext db)
    : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<string>
{
    [HttpPost]
    public override async Task<string> HandleAsync(CancellationToken cancellationToken = default)
    {
        // Provera da li tabela "Locales" sadrži postojeće podatke
        if(db.MyAppUsers.Any())
        {
            throw new Exception("Podaci su vec generisani !");

        }


        var existingLocaleNames = db.Locales.Select(l => l.Name).ToHashSet();
        var countries = new List<Country>
        {
            new Country { Name = "Bosnia and Herzegovina" },
            new Country { Name = "Croatia" },
            new Country { Name = "Germany" },
            new Country { Name = "Austria" },
            new Country { Name = "USA" }
        };

        var cities = new List<City>
        {
            new City { Name = "Sarajevo", Country = countries[0] },
            new City { Name = "Mostar", Country = countries[0] },
            new City { Name = "Zagreb", Country = countries[1] },
            new City { Name = "Berlin", Country = countries[2] },
            new City { Name = "Vienna", Country = countries[3] },
            new City { Name = "New York", Country = countries[4] },
            new City { Name = "Los Angeles", Country = countries[4] }
        };

        var categories = new List<Category>
        {
            new Category { Name = "Restaurant", Description = "Has food" },
            new Category { Name = "Coffee place", Description = "Has coffee" },
            new Category { Name = "Nightclub", Description = "Has drinks" }
        };


        var passwordHasher = new PasswordHasher<MyAppUser>();
        var admins = new List<Admin>
        {
            new Admin
            {
                Username = "admin",
                Password ="admin",
                FirstName="admin",
                LastName="admin",
                Email = "admin@gmail.com",
                IsOwner = false,
                IsAdmin=true,
                IsWorker=false,
            },
            new Admin
            {
                Username = "string",
                Password ="string",
                FirstName="admin",
                LastName="admin",
                Email = "string@gmail.com",
                IsOwner = false,
                IsAdmin=true,
                IsWorker=false,
            }
        };

        var owners = new List<Owner>
        {
            new Owner
            {
                Username = "owner",
                Password = "owner",
                FirstName ="Owner1",
                LastName = "One Ownerrr",
                Email = "Owner11@edu.fit.ba",
                IsOwner = true,
                IsAdmin =false,
                IsWorker=false,
                BirthDate = new DateTime(2000,1,1),
                PhoneNumber="061111111"
            },
            new Owner
            {
                Username="owner2",
                Password="owner2",
                FirstName="Owner2",
                LastName="Owner2",
                Email="owner3@gmail.com",
                BirthDate=new DateTime(1980,11,15),
                PhoneNumber="062062062",
                IsOwner=true,
                IsWorker=false,
                IsAdmin=false
            },
            new Owner
            {
                Username="owner3",
                Password="owner3",
                FirstName="Owner3",
                LastName="Owner3",
                Email="owner3@gmail.com",
                BirthDate=new DateTime(2003,11,3),
                PhoneNumber="061456789",
                IsOwner=true,
                IsWorker=false,
                IsAdmin=false
            }
        };

        var users = new List<MyAppUser>
        {
            new MyAppUser
            {
                Username = "user",
                Password = "user",
                FirstName = "User",
                LastName = "One",
                Email ="user@gmail.com",
                IsOwner = false,
                IsAdmin=false,
                IsWorker=false,
                IsDeleted=false,
                DeletedAt=DateTime.Now,
            },
            new MyAppUser
            {
                Username = "user2",
                Password = "user2",
                FirstName = "User",
                LastName = "Two",
                Email ="user2@gmail.com",
                IsOwner = false,
                IsAdmin=false,
                IsWorker=false
            }
        };

        foreach(var admin in admins)
        {
            admin.Password= passwordHasher.HashPassword(admin, admin.Password);
        }


        foreach (var owner in owners)
        {
            owner.Password = passwordHasher.HashPassword(owner, owner.Password);
        }

        foreach (var user in users)
        {
            user.Password = passwordHasher.HashPassword(user, user.Password);
        }


        // Lista svih lokala koje želite dodati
        var locales = new List<Locale>
        {
            new Locale
            {
                Name="Urban Forest",
                StartOfWorkingHours = new TimeOnly(7,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[1],
                Category = categories[0],
                Owner = owners[0],
                Logo="63350c9f-08b9-43b7-8fd6-0d76fe7bbd67.jpeg",
                Address="Zalik 12, Mostar 88000"



            },
             new Locale
            {
                Name="Pod Košćelom",
                StartOfWorkingHours = new TimeOnly(7,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[1],
                Category = categories[0],
                Owner = owners[2],
                Logo = "03b3c94e-9245-4891-906f-a278e852703e.jpeg",
                Address="Mostar"

            },
              new Locale
            {
                Name="Chippas",
                StartOfWorkingHours = new TimeOnly(8,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[0],
                Category = categories[0],
                Owner = owners[1],
                Logo = "9ed72c61-75c5-4de8-b660-fa2c830630a5.png",
                Address="Sarajevo"


            },
               new Locale
            {
                Name="Hot Will",
                StartOfWorkingHours = new TimeOnly(7,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[3],
                Category = categories[0],
                Owner = owners[0],
                Logo = "f4593f68-14b1-4b91-9a0d-06baa477458f.jpeg",
                Address="Sarajevo"


            },
                new Locale
            {
                Name="Restoran",
                StartOfWorkingHours = new TimeOnly(7,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[4],
                Category = categories[0],
                Owner = owners[2],
                Logo = "08536c06-a416-4701-b1e1-0b15ffc43717.png",
                Address="Now York"


            },

            new Locale {
                Name="Caffe bar Rio",
                StartOfWorkingHours = new TimeOnly(6,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[1],
                Category = categories[1],
                Owner = owners[1],
                Logo = "c27eaeae-fd20-4b41-a797-6eb03c861712.png",
                Address="Tekija 53, MOstar 88000"


            },
             new Locale {
                Name="Polaris",
                StartOfWorkingHours = new TimeOnly(6,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[1],
                Category = categories[1],
                Owner = owners[2],
                Logo = "8503e295-88fe-48e4-88be-51240a5ef48d.jpeg",
                Address="Mostar"


            },
              new Locale {
                Name="Metropolitan",
                StartOfWorkingHours = new TimeOnly(9,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[0],
                Category = categories[1],
                Owner = owners[0],
                Logo = "fae6ddaf-f21e-4d32-85e7-f42849972d8d.jpeg",
                Address="Sarajevo"


            },
               new Locale {
                Name="Caffe bar Forza",
                StartOfWorkingHours = new TimeOnly(6,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[1],
                Category = categories[1],
                Owner = owners[1],
                Logo = "0a3a9d90-f580-4d5f-8518-b92fe3a54dcc.jpeg",
                Address="Mostar"


            },
                new Locale {
                Name="Fabrika Coffee",
                StartOfWorkingHours = new TimeOnly(6,0,0),
                EndOfWorkingHours = new TimeOnly(23,0,0),
                City = cities[5],
                Category = categories[1],
                Owner = owners[2],
                Logo = "f5f3b025-2b49-40b9-89bc-82b7ff1dab76.png",
                Address="Sarajevo"
            },

            new Locale {
            Name = "Das ist Walter",
            StartOfWorkingHours = new TimeOnly(23,0,0),
            EndOfWorkingHours=new TimeOnly(23,59,0),
            City = cities[0],
            Category = categories[2],
            Owner = owners[2],
            Logo = "8839af23-88bf-4a93-ad44-d2af9fbf99f7.jpeg",
            Address="Sarajevo"

            },
               new Locale {
            Name = "GoldenCube Mostar",
            StartOfWorkingHours = new TimeOnly(23,0,0),
            EndOfWorkingHours=new TimeOnly(23,59,0),
            City = cities[1],
            Category = categories[2],
            Owner = owners[2],
            Logo = "7ea518d4-a402-4520-8b4b-1cff7cc81189.jpeg",
            Address="Mostar"

            },
                  new Locale {
            Name = "H20",
            StartOfWorkingHours = new TimeOnly(23,0,0),
            EndOfWorkingHours=new TimeOnly(23,59,0),
            City = cities[2],
            Category = categories[2],
            Owner = owners[1],
            Logo = "c5d54127-c3ac-4c24-8cd8-e886db091ca1.jpeg",
            Address="Zagreb"

            },
                     new Locale {
            Name = "Diamond Club",
            StartOfWorkingHours = new TimeOnly(23,0,0),
            EndOfWorkingHours=new TimeOnly(23,59,0),
            City = cities[5],
            Category = categories[2],
            Owner = owners[0],
            Logo = "8cf9fec4-b2fe-42b0-bcaf-266ff79cb021.jpeg",
            Address="Ljubuški"

            },
           new Locale {
            Name = "Daleka Obala",
            StartOfWorkingHours = new TimeOnly(23,0,0),
            EndOfWorkingHours=new TimeOnly(23,59,0),
            City = cities[1],
            Category = categories[2],
            Owner = owners[1],
            Logo = "83860178-7670-467c-9703-1f57916b8d5c.jpeg",
            Address="Mostar"

            },
        };


        var tables = new List<Table>
        {
            new Table
            {
               Locale=locales[0],
                Name="Table1",
                NumberOfGuests=4,
                XCoordinate=600,
                YCoordinate=100
            },
               new Table
            {
               Locale=locales[0],
                Name="Table2",
                NumberOfGuests=3,
                XCoordinate=350,
                YCoordinate=400
            },
                  new Table
            {
              Locale=locales[0],
                Name="Table3",
                NumberOfGuests=2,
                XCoordinate=350,
                YCoordinate=100
            },
                     new Table
            {
                 Locale=locales[0],
                Name="Table4",
                NumberOfGuests=5,
                XCoordinate=600,
                YCoordinate=400
            }
        };


        var zones = new List<Zone>
        {
            new Zone
            {
                Locale=locales[0],
                Name="WC",
                XCoordinate=150,
                YCoordinate=90,
                Height=100,
                Width=100,
            }
        };


        // Filtriranje samo novih lokala
        await db.Countries.AddRangeAsync(countries, cancellationToken);
        await db.Cities.AddRangeAsync(cities, cancellationToken);
        await db.MyAppUsers.AddRangeAsync(users, cancellationToken);
        await db.Admins.AddRangeAsync(admins, cancellationToken);
        await db.Categories.AddRangeAsync(categories, cancellationToken);
        await db.Owners.AddRangeAsync(owners, cancellationToken);
        await db.Locales.AddRangeAsync(locales, cancellationToken);
        await db.Tables.AddRangeAsync(tables, cancellationToken);
        await db.Zones.AddRangeAsync(zones, cancellationToken);


        await db.SaveChangesAsync(cancellationToken);

        return "Data generation completed successfully.";
    }
}


