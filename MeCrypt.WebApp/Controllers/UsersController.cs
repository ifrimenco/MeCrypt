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
            byte[] key = new byte[32];
            RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider();
            provider.GetBytes(key);

            var secret = new BigInteger(key);

            var shares = SecretsHelper.GenerateShares(secret, 5, 3);
            var result = SecretsHelper.GenerateSecret(shares);

            var rrkey = result.ToByteArray();
            if (!HasPermission(PermissionTypes.Users_View))
            {
                return Unauthorized();
            }
            return Ok(UsersService.GetUsers());
        }

    }
}
