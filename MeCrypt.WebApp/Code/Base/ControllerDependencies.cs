using MeCrypt.DataObjects.DTOs;
using Microsoft.Extensions.Configuration;

namespace MeCrypt.WebApp.Code.Base
{
    public class ControllerDependencies
    {
        public IConfiguration Configuration { get; set; }
        public CurrentUserDto CurrentUser { get; set; }

        public ControllerDependencies(IConfiguration configuration, CurrentUserDto currentUser)
        {
            this.Configuration = configuration;
            this.CurrentUser = currentUser;
        }
    }
}
