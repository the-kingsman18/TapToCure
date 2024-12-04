using Account_Service.DataAccess;
using Account_Service.Model;
using Account_Service.Repository;
using Microsoft.EntityFrameworkCore;

namespace Account_Service.Tests
{
    [TestFixture]
    public class UserRepoTests
    {
        private UsersDBContext _context;
        private UserRepository _userRepo;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<UsersDBContext>()
                .UseInMemoryDatabase(databaseName: "TestUsersDB")
                .Options;

            _context = new UsersDBContext(options);

            // Seed the in-memory database with test data
            SeedDatabase();

            _userRepo = new UserRepository(_context);
        }

        private void SeedDatabase()
        {
            if (!_context.Users.Any())
            {
                var users = new List<User>
                {
                    new User { Id = 1, UserName = "User1", Email = "user1@example.com",Gender="male",MobileNumber="123",Password="Admin@12" ,Role = "User" },
                    new User { Id = 2, UserName = "Admin", Email = "admin@example.com",Gender="female",MobileNumber="1234",Password="Adin@12" ,Role = "Admin" },
                    new User { Id = 3, UserName = "User2", Email = "user2@example.com",Gender="male",MobileNumber="1235",Password="Amin@12" ,Role = "User" }
                };

                _context.Users.AddRange(users);
                _context.SaveChanges();
            }
        }

        [TearDown]
        public void TearDown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Test]
        public async Task GetAllUsersAsync_ShouldReturnAllUsers()
        {
            // Act
            var users = await _userRepo.GetAllUsersAsync();

            // Assert
            Assert.IsNotNull(users);
            Assert.AreEqual(3, users.Count());
        }

        [Test]
        public async Task GetUserByIdAsync_ExistingUserId_ShouldReturnUser()
        {
            // Act
            var user = await _userRepo.GetUserByIdAsync(1);

            // Assert
            Assert.IsNotNull(user);
            Assert.AreEqual("User1", user.UserName);
        }

        [Test]
        public async Task GetUserByIdAsync_NonExistentUserId_ShouldReturnNull()
        {
            // Act
            var user = await _userRepo.GetUserByIdAsync(99);

            // Assert
            Assert.IsNull(user);
        }

        [Test]
        public async Task GetUsersByRoleAsync_ExistingRole_ShouldReturnUsers()
        {
            // Act
            var users = await _userRepo.GetUsersByRoleAsync("User");

            // Assert
            Assert.IsNotNull(users);
            Assert.AreEqual(2, users.Count());
        }

        [Test]
        public async Task GetUsersByRoleAsync_NonExistentRole_ShouldReturnEmptyList()
        {
            // Act
            var users = await _userRepo.GetUsersByRoleAsync("NonExistentRole");

            // Assert
            Assert.IsNotNull(users);
            Assert.IsEmpty(users);
        }
    }
}
