using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Feedback_Service.Models
{
    // The Feedback class represents a patient's feedback about a doctor and the platform.
    public class Feedback
    {
        // The DoctorId represents the identifier for the doctor receiving feedback
        public int DoctorId;

        // The FeedbackId is the unique identifier for the feedback (MongoDB ObjectId)
        [BsonId]  // Marks this property as the MongoDB identifier for this document
        [BsonRepresentation(BsonType.ObjectId)]  // Specifies the object ID representation for MongoDB
        public string FeedbackId { get; set; }

        // The AppointmentId refers to the appointment for which the feedback is given (required for linkage)
        [BsonRequired]  // Marks this property as required in MongoDB
        public int AppointmentId { get; set; }

        // The PatientId represents the unique identifier of the patient who is giving the feedback
        [BsonRequired]  // Marks this property as required in MongoDB
        public int PatientId { get; set; }

        // The PatientName stores the name of the patient providing the feedback
        [BsonRequired]  // Marks this property as required in MongoDB
        public string PatientName { get; set; }

        // The DoctorName stores the name of the doctor who is receiving the feedback
        [BsonRequired]  // Marks this property as required in MongoDB
        public string DoctorName { get; set; }

        // The DoctorRating is the rating given to the doctor (on a scale, e.g., 1 to 5)
        [BsonRequired]  // Marks this property as required in MongoDB
        public int DoctorRating { get; set; }

        // The PlatformRating is the rating given to the platform or service used for the appointment (e.g., 1 to 5)
        [BsonRequired]  // Marks this property as required in MongoDB
        public int PlatformRating { get; set; }

        // The Comments provide additional feedback or notes from the patient regarding the doctor or the platform
        [BsonRequired]  // Marks this property as required in MongoDB
        public string Comments { get; set; }

        // The CreatedAt timestamp stores the date and time when the feedback was created (defaults to the current UTC time)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
