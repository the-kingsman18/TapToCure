namespace Account_Service.Exceptions
{
    public class AccountServiceExceptions: Exception
    {
        
            public int StatusCode { get; set; }

            public AccountServiceExceptions(string message, int statusCode = 500) : base(message)
            {
                StatusCode = statusCode;
            }
        
}
}
