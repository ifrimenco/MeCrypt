using MeCrypt.BusinessLogic;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.DataObjects.Enums;
using MeCrypt.WebApp.Code.Base;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class AdminController : BaseController
    {
        private readonly AdminService AdminService;
        public AdminController(ControllerDependencies dependencies, AdminService adminService)
          : base(dependencies)
        {
            this.AdminService = adminService;
        }

        [HttpGet, Route("getRoles")]
        public IEnumerable<RoleListItemModel> GetRoles()
        {
            return AdminService.GetRoles();
        }

        [HttpGet, Route("getUser/{id}")]
        public IActionResult GetUser(Guid id)
        {
            if (!HasPermission(PermissionTypes.Users_Update))
            {
                return Unauthorized();
            }
            return Ok(AdminService.GetUser(id));
        }

        [AllowAnonymous]
        [HttpPost, Route("editUser/{id}")]
        public IActionResult EditUser([FromBody] EditUserModel model)
        {
            if (!HasPermission(PermissionTypes.Users_Update))
            {
                return Unauthorized();
            }

            return Ok(AdminService.EditUser(model));
        }
    }
}
