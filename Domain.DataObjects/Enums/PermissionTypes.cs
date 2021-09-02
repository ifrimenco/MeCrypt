using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeCrypt.DataObjects.Enums
{
    public enum PermissionTypes : int
    {
        Application_Access = 0,
        Users_View = 1,
        Users_Update = 2,
        Room_Create = 10,
        Messages_ReadWrite = 11,
        Secrets_Deal = 20,
        Secrets_Open = 21,
    }
}
