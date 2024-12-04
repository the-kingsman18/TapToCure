using AutoMapper;
using Feedback_Service.DTO;
using Feedback_Service.Models;
using Feedback_Service.Repository;
using Mongo2Go;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Feedback_Service.DataAccess;
using MongoDB.Bson;


namespace Testing
{
    [TestFixture]
    public class Tests
    {

        private FeedbackRepository _feedbackRepository;
        private IMongoDatabase _database;
        private IMapper _mapper;

        // Test setup
        [SetUp]
        public void Setup()
        {
            // Setup MongoDB connection for testing
            var mongoClient = new MongoClient("mongodb://localhost:27017"); // Change connection string as needed
            _database = mongoClient.GetDatabase("TestDatabase");

            // Set up the Feedback collection for testing
            var feedbackCollection = _database.GetCollection<Feedback>("Feedback");
            feedbackCollection.DeleteMany(_ => true); // Clear existing data

            // Create AutoMapper configuration
            var config = new MapperConfiguration(cfg => {
                cfg.CreateMap<Feedback, FeedbackDTO>()
                   .ForMember(dest => dest.DoctorRating, opt => opt.MapFrom(src => src.DoctorRating))
                   .ForMember(dest => dest.PatientName, opt => opt.Ignore())
                   .ForMember(dest => dest.DoctorName, opt => opt.Ignore())
                   .ForMember(dest => dest.PlatformRating, opt => opt.Ignore());
            });
            _mapper = config.CreateMapper();

            // Set up the repository with the configuration
            var feedbackConfig = Options.Create(new FeedBackDBConfig
            {
                ServerURL = "mongodb://localhost:27017",
                DataBaseName = "TestDatabase",
                FeedBackCollection = "Feedback"
            });

            _feedbackRepository = new FeedbackRepository(feedbackConfig, _mapper);
        }

        [Test]
        public async Task GetAllFeedbacks_ShouldReturnAllFeedbacks()
        {
            var feedbacksToInsert = new List<Feedback>
            {
                new Feedback { FeedbackId = ObjectId.GenerateNewId().ToString(), PatientId = 1, DoctorName = "Venkatesh", Comments = "Great service!", DoctorRating = 5 },
                new Feedback { FeedbackId = ObjectId.GenerateNewId().ToString(), PatientId = 2, DoctorName = "Abdul", Comments = "Very helpful.", DoctorRating = 4 },
            };

            await _database.GetCollection<Feedback>("Feedback").InsertManyAsync(feedbacksToInsert);

            // Act
            var result = await _feedbackRepository.GetAllFeedbacks();

            // Assert
            Assert.AreEqual(2, result.Count());
            Assert.IsTrue(result.Any(f => f.Comments == "Great service!"), "Expected comment 'Great service!' not found.");
            Assert.IsTrue(result.Any(f => f.Comments == "Very helpful."), "Expected comment 'Very helpful.' not found.");
        }

        [TearDown]
        public void TearDown()
        {
            // Cleanup after tests
            _database.DropCollection("Feedback");
        }

    }
}
