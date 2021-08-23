using MeCrypt.DataObjects.DTOs;
using MeCrypt.DataObjects.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MeCrypt.WebApp.Code.Base
{
    public class BaseController : Controller
    {
        protected readonly IConfiguration configuration;
        protected readonly CurrentUserDto currentUser;
        public BaseController(ControllerDependencies dependencies)
            : base()
        {
            configuration = dependencies.Configuration;
            currentUser = dependencies.CurrentUser;
        }

        protected bool HasPermission(PermissionTypes permissionId)
        {
            if (currentUser.Permissions == null)
            {
                return false;
            }

            return currentUser.Permissions.Contains((int)permissionId);
        }
    }
}
