using MeCrypt.DataObjects.DTOs;

namespace MeCrypt.WebApp.Code.Base
{
    public class ControllerDependencies
    {
        public CurrentUserDto CurrentUser { get; set; }

        public ControllerDependencies(CurrentUserDto currentUser)
        {
            this.CurrentUser = currentUser;
        }
    }
}
