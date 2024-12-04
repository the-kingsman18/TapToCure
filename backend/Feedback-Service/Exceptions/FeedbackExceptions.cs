namespace Feedback_Service.Exceptions
{
    public class FeedbackExceptions : Exception
    {
        public FeedbackExceptions(string message) : base(message)
        {
        }

        public FeedbackExceptions(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
