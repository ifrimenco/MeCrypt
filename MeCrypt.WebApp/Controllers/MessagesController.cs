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
    public class MessagesController : BaseController
    {
        private readonly MessagingService MessagingService;
        public MessagesController(ControllerDependencies dependencies, MessagingService messagingService)
          : base(dependencies)
        {
            this.MessagingService = messagingService;
        }

        [HttpGet, Route("getRooms")]
        public IActionResult GetRooms()
        {
            if (!HasPermission(PermissionTypes.Messages_ReadWrite))
            {
                return Unauthorized();
            }

            return Ok(MessagingService.GetRooms());
        }

        [HttpPost, Route("createRoom")]
        public IActionResult CreateRoom([FromBody] CreateRoomModel model)
        {
            if (!HasPermission(PermissionTypes.Room_Create))
            {
                return Unauthorized();
            }
            try
            {
                MessagingService.CreateRoom(model);
                return Ok();
            }

            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [HttpPost, Route("storeMessages")]
        public IActionResult StoreMessages([FromBody] StoreMessageModel model)
        {
            if (!HasPermission(PermissionTypes.Messages_ReadWrite))
            {
                return Unauthorized();
            }
            try
            {
                MessagingService.StoreMessages(model);
                return Ok();
            }

            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [HttpGet, Route("getUsersForRoom/{roomId}")]
        public IActionResult GetUsersForRoom(Guid roomId)
        {
            if (!HasPermission(PermissionTypes.Messages_ReadWrite))
            {
                return Unauthorized();
            }

            var users = MessagingService.GetUsersForRoom(roomId);

            if (users == null)
            {
                return Unauthorized();
            }

            return Ok(users);
        }
    }
}
