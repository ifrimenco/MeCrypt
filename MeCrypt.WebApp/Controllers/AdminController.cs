using MeCrypt.BusinessLogic;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.WebApp.Code.Base;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MeCrypt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : BaseController
    {


        private readonly UserAccountService UserAccountService;
        private readonly UsersService UsersService;
        public AdminController(ControllerDependencies dependencies, UserAccountService userAccountService, UsersService usersService)
          : base(dependencies)
        {
            this.UserAccountService = userAccountService;
            this.UsersService = usersService;
        }

        [HttpGet]
        public IEnumerable<UserListItemModel> Get() => UsersService.GetUsers();
        
    }
}
