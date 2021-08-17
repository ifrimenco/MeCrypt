using MeCrypt.DataObjects.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace MeCrypt.WebApp.Code.Base
{
    public class BaseController : Controller
    {
        protected readonly CurrentUserDto CurrentUser;

        public BaseController(ControllerDependencies dependencies)
            : base()
        {
            CurrentUser = dependencies.CurrentUser;
        }
    }
}
