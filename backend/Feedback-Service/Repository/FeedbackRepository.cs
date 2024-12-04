using AutoMapper;
using Feedback_Service.DataAccess;
using Feedback_Service.DTO;
using Feedback_Service.Exceptions;
using Feedback_Service.IRepository;
using Feedback_Service.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Feedback_Service.Repository
{
    public class FeedbackRepository : IFeedbackRepository
    {
        // MongoDB collection to store feedbacks
        private readonly IMongoCollection<Feedback> _feedback;
        // AutoMapper instance to map between Feedback and FeedbackDTO
        private readonly IMapper _mapper;

        // Constructor that sets up MongoDB connection and initializes the feedback collection
        public FeedbackRepository(IOptions<FeedBackDBConfig> feedbackConfig, IMapper mapper)
        {
            _mapper = mapper;

            // Define the Mongo Client using the provided connection URL from config
            var mongoClient = new MongoClient(feedbackConfig.Value.ServerURL);
            // Select the appropriate Mongo database
            var mongoDB = mongoClient.GetDatabase(feedbackConfig.Value.DataBaseName);
            // Get the Feedback collection from the database
            _feedback = mongoDB.GetCollection<Feedback>(feedbackConfig.Value.FeedBackCollection);
        }

        // Adds a new feedback to the database
        public async Task<FeedbackDTO> AddFeedback(FeedbackDTO feedbackdto)
        {
            try
            {
                // Mapping DTO to entity
                var feedbackEntity = _mapper.Map<Feedback>(feedbackdto);
                // Inserting the feedback entity into the MongoDB collection
                await _feedback.InsertOneAsync(feedbackEntity);
                // Returning the newly added feedback as DTO
                return _mapper.Map<FeedbackDTO>(feedbackEntity);
            }
            catch (Exception ex)
            {
                // Throwing a custom exception in case of any errors
                throw new FeedbackExceptions("An error occurred while adding feedback.", ex);
            }
        }

        // Retrieves all feedbacks from the database
        public async Task<IEnumerable<Feedback>> GetAllFeedbacks()
        {
            try
            {
                // Fetching all feedback records from MongoDB
                return await _feedback.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                // Throwing a custom exception in case of any errors
                throw new FeedbackExceptions("An error occurred while retrieving all feedbacks.", ex);
            }
        }

        // Retrieves feedbacks associated with a specific doctor
        public async Task<IEnumerable<Feedback>> GetFeedbacksByDoctorName(string doctorName)
        {
            try
            {
                // Fetching feedbacks where the DoctorName matches the provided parameter
                return await _feedback.Find(feedback => feedback.DoctorName == doctorName).ToListAsync();
            }
            catch (Exception ex)
            {
                // Throwing a custom exception if an error occurs while fetching feedbacks for the doctor
                throw new FeedbackExceptions($"An error occurred while retrieving feedbacks for doctor {doctorName}.", ex);
            }
        }
    }
}
