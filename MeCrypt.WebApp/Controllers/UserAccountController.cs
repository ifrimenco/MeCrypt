using MeCrypt.BusinessLogic;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.DataObjects.Enums;
using MeCrypt.WebApp.Code.Base;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MeCrypt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UserAccountController : BaseController
    {


        private readonly UserAccountService Service;
        public UserAccountController(ControllerDependencies dependencies, UserAccountService service)
          : base(dependencies)
        {
            this.Service = service;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginDto model)
        {
            if (currentUser.IsAuthenticated)
            {
                return BadRequest("User Already logged in");
            }

            var user = Service.Login(model.Email, model.Password);

            if (user == null)
                return BadRequest("Email or password is incorrect");

            // return basic user info (without password) and token to store client side
            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Permissions = user.Permissions,
                Token = LogIn(user)
            });
        }
        [AllowAnonymous]
        [HttpPost("Register")]
        public IActionResult Register([FromBody] RegisterDto model)
        {
            try
            {
                if (currentUser.IsAuthenticated)
                {
                    return BadRequest("User Already logged in");
                }

                // save 
                var user = Service.Register(model);

                if (user == null)
                {
                    return BadRequest("E-mail Already Used!");
                }

                var userDto = Service.Login(model.Email, model.Password);
                return Ok(new
                {
                    Id = userDto.Id,
                    Email = userDto.Email,
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    Permissions = userDto.Permissions,
                    Token = LogIn(userDto)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string LogIn(CurrentUserDto user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration.GetSection("AppSettings").GetSection("Secret").Value);

            var claims = new ClaimsIdentity(new Claim[]
            {
                    new Claim("Id", user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Email)
            });

            user.Permissions.ForEach(permission => claims.AddClaim(new Claim("Permission", permission.ToString())));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            // TODO de adaugat refresh token
            return tokenString;
        }
    }
}
