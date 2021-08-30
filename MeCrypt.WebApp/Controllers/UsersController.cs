using MeCrypt.BusinessLogic;
using MeCrypt.Common;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.DataObjects.Enums;
using MeCrypt.WebApp.Code.Base;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Numerics;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MeCrypt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UsersController : BaseController
    {


        private readonly UserAccountService UserAccountService;
        private readonly UsersService UsersService;
        public UsersController(ControllerDependencies dependencies, UserAccountService userAccountService, UsersService usersService)
          : base(dependencies)
        {
            this.UserAccountService = userAccountService;
            this.UsersService = usersService;
        }
        [HttpGet, Route("getUsers")]

        public IActionResult GetUsers()
        {
            if (!HasPermission(PermissionTypes.Users_View))
            {
                return Unauthorized();
            }

            var users = UsersService.GetUsers();
            return Ok(users);
        }
    }
}
