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
    public class UserAccountController : BaseController
    {


        private readonly UserAccountService Service;
        public UserAccountController(ControllerDependencies dependencies, UserAccountService service)
          : base(dependencies)
        {
            this.Service = service;
        }

        //[HttpGet]
        //public IActionResult Register()
        //{
        //    var model = new RegisterModel();

        //    return View("Register", model);
        //}

        //[HttpPost]
        //public IActionResult Register(RegisterModel model)
        //{
        //    if (model == null)
        //    {
        //        return View("Error_NotFound");
        //    }

        //    Service.RegisterNewUser(model);

        //    return RedirectToAction("Index", "Home");
        //}

        //[HttpGet]
        //public IActionResult Login()
        //{
        //    var model = new LoginModel();

        //    return View(model);
        //}

        //[HttpPost]
        //public async Task<IActionResult> Login(LoginModel model)
        //{
        //    var user = Service.Login(model.Email, model.Password);

        //    if (!user.IsAuthenticated)
        //    {
        //        model.AreCredentialsInvalid = true;
        //        return View(model);
        //    }

        //    await LogIn(user);

        //    return RedirectToAction("Index", "Home");
        //}

        //[HttpGet]
        //public async Task<IActionResult> Logout()
        //{
        //    await LogOut();

        //    return RedirectToAction("Index", "Home");
        //}

        //[HttpGet]
        //public IActionResult DemoPage()
        //{
        //    var model = Service.GetUsers();

        //    return View(model);
        //}

        private async Task LogIn(CurrentUserDto user)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Email, user.Email),
            };

            user.Roles.ForEach(role => claims.Add(new Claim(ClaimTypes.Role, role)));

            var identity = new ClaimsIdentity(claims, "Cookies");
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(
                    scheme: "MeCryptCookies",
                    principal: principal);
        }

        private async Task LogOut()
        {
            await HttpContext.SignOutAsync(scheme: "MeCryptCookies");
        }
    }
}
