using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Doctor_Service.IRepository;
using dotenv.net;

namespace Doctor_Service.Repository
{
    public class ImageRepository : IImageRepository
    {
        private readonly Cloudinary _cloudinary;

        public ImageRepository()
        {
            // Load Cloudinary credentials from .env file
            DotEnv.Load(options: new DotEnvOptions(probeForEnv: true));
            var cloudinary = Environment.GetEnvironmentVariable("CLOUDINARY_URL");
            _cloudinary = new Cloudinary(cloudinary);
            _cloudinary.Api.Secure = true;
        }
        public string GenerateImageURL(IFormFile file)
        {
            //var uploadParams = new ImageUploadParams()
            //{
            //    File = new FileDescription(file.FileName, file.OpenReadStream()),
            //    Folder = "Doctor-Service",
            //    UseFilename = true,
            //    UniqueFilename = false,
            //    Overwrite = true
            //};

            //var UploadResult = _cloudinary.Upload(uploadParams);
            ////Console.WriteLine(UploadResult.JsonObj);
            //if (UploadResult.Error != null)
            //{
            //    Console.WriteLine(UploadResult.Error);
            //}
            //var imageurl= UploadResult.Url.ToString();
            //Console.WriteLine(imageurl);
            //return imageurl;


            if (file == null || file.Length == 0)
            {
                return ("No file provided.");
            }

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = "Doctor-Service",
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true
            };

            var result = _cloudinary.Upload(uploadParams);


            var url = result.Url.ToString();
            Console.WriteLine(url);
            return url;

        }
    }
}
