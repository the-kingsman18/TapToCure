namespace Doctor_Service.IRepository
{
    public interface IImageRepository
    {
        string GenerateImageURL(IFormFile file);
    }
}
