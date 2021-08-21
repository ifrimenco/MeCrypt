using MeCrypt.DataObjects.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MeCrypt.WebApp.Code.Base
{
    public class BaseController : Controller
    {
        protected readonly IConfiguration configuration;

        public BaseController(ControllerDependencies dependencies)
            : base()
        {
            configuration = dependencies.Configuration;
        }
    }
}
