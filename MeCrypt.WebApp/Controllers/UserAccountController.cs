using MeCrypt.BusinessLogic;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.DataObjects.Enums;
using MeCrypt.WebApp.Code.Base;
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


        private readonly UserAccountService userAccountService;
        private readonly MessagingService messagingService;
        public UserAccountController(ControllerDependencies dependencies, UserAccountService userAccountService, MessagingService messagingService)
          : base(dependencies)
        {
            this.userAccountService = userAccountService;
            this.messagingService = messagingService;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginDto model)
        {
            if (currentUser.IsAuthenticated)
            {
                return Forbid("User Already logged in");
            }

            var user = userAccountService.Login(model.Email, model.Password, model.PublicKey);

            if (user == null)
                return BadRequest("Email or password incorrect");

            messagingService.DeleteMessages();

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

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                messagingService.DeleteMessages();
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
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
                var user = userAccountService.Register(model);

                if (user == null)
                {
                    return BadRequest("E-mail Already Used!");
                }

                var userDto = userAccountService.Login(model.Email, model.Password, model.PublicKey);
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
                    new Claim(ClaimTypes.Name, user.Id.ToString())
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
