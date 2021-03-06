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
    public class SecretsController : BaseController
    {
        private readonly OnHerMajestySecretsService OnHerMajestySecretsService;
        public SecretsController(ControllerDependencies dependencies, OnHerMajestySecretsService onHerMajestySecretsService)
          : base(dependencies)
        {
            this.OnHerMajestySecretsService = onHerMajestySecretsService;
        }

        [HttpGet, Route("getSecrets")]
        public IActionResult GetSecrets()
        {
            if (!HasPermission(PermissionTypes.Secrets_Open))
            {
                return Unauthorized();
            }

            return Ok(OnHerMajestySecretsService.GetSecrets());
        }

        [HttpPost, Route("createSecret")]
        public IActionResult CreateSecret([FromBody] CreateSecretModel model)
        {
            if (!HasPermission(PermissionTypes.Secrets_Deal))
            {
                return Unauthorized();
            }
            try
            {
                OnHerMajestySecretsService.CreateSecret(model);
                return Ok();
            }

            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [HttpGet, Route("getSecret/{secretId}")]
        public IActionResult GetSecret(Guid secretId) 
        {
            if (!HasPermission(PermissionTypes.Secrets_Open))
            {
                return Unauthorized();
            }

            var secret = OnHerMajestySecretsService.GetSecret(secretId);

            if (secret == null)
            {
                return BadRequest();
            }

            return Ok(secret);
        }

        [HttpPost, Route("openSecret")]
        public IActionResult OpenSecret([FromBody] OpenSecretModel model)
        {
            if (!HasPermission(PermissionTypes.Secrets_Open))
            {
                return Unauthorized();
            }

            var secret = OnHerMajestySecretsService.OpenSecret(model);
            var test = Ok(secret);
            return test ;
        }
    }
}
