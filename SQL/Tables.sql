DELETE FROM USERS;
CREATE TABLE [Users] (
	Id UNIQUEIDENTIFIER NOT NULL,
	Email NVARCHAR(100) NOT NULL,
	PasswordHash NVARCHAR(150) NOT NULL,
	FirstName NVARCHAR(40) NOT NULL,
	LastName NVARCHAR(40) NOT NULL,
	PublicKey VARBINARY(300) NOT NULL,

	CONSTRAINT PK_Users PRIMARY KEY (Id)
);

CREATE TABLE [Roles] (
	Id INT NOT NULL,
	Title NVARCHAR(30) NOT NULL,
	
	CONSTRAINT PK_Roles PRIMARY KEY (Id),
);

CREATE TABLE [User_Roles] (
	UserId UNIQUEIDENTIFIER NOT NULL,
	RoleId INT NOT NULL,

	CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId),
	CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES [Users](Id),
	CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES [Roles](Id),
);

CREATE TABLE [Permissions] (
	Id INT NOT NULL,
	Title NVARCHAR(30) NOT NULL

	CONSTRAINT PK_Permissions PRIMARY KEY (Id)
);

CREATE TABLE [Role_Permissions] (
	RoleId INT NOT NULL,
	PermissionId INT NOT NULL,

	CONSTRAINT PK_RolePermissions PRIMARY KEY (RoleId, PermissionId),
	CONSTRAINT FK_RolePermissions_Roles FOREIGN KEY (RoleId) REFERENCES [Roles](Id),
	CONSTRAINT FK_RolePermissions_Permissions FOREIGN KEY (PermissionId) REFERENCES [Permissions](Id)
);
DROP TABLE [MeCrypt].[dbo].[Secrets];

CREATE TABLE [MeCrypt].[dbo].[Secrets] (
	Id UNIQUEIDENTIFIER NOT NULL,	
	Title NVARCHAR(100) NOT NULL,
	Content VARBINARY(MAX) NOT NULL,
)

CREATE TABLE [Rooms] (
	Id UNIQUEIDENTIFIER NOT NULL,
	CreatorId UNIQUEIDENTIFIER NOT NULL,
	MessageLifespan INT NOT NULL

	-- posibil de mai adaugat coloane
	CONSTRAINT PK_Rooms PRIMARY KEY (Id)
	CONSTRAINT FK_Rooms_CreatorUsers FOREIGN KEY (CreatorId) REFERENCES [Users](Id),
)

CREATE TABLE [User_Rooms] (
	UserId UNIQUEIDENTIFIER NOT NULL,
	RoomId UNIQUEIDENTIFIER NOT NULL,
	
	CONSTRAINT PK_UserRooms PRIMARY KEY (UserId, RoomId),
	CONSTRAINT FK_UserRooms_Users FOREIGN KEY (UserId) REFERENCES [Users](Id),
	CONSTRAINT FK_UserRooms_Rooms FOREIGN KEY (RoomId) REFERENCES [Rooms](Id),
);

DROP TABLE [MeCrypt].[dbo].[Messages];
CREATE TABLE [MeCrypt].[dbo].[Messages] (
	Id UNIQUEIDENTIFIER NOT NULL,
	SenderId UNIQUEIDENTIFIER NOT NULL,
	ReceiverId UNIQUEIDENTIFIER NOT NULL,
	RoomId UNIQUEIDENTIFIER NOT NULL,
	CryptedContent NVARCHAR(MAX) NOT NULL,
	DateTimeSent DATETIMEOFFSET NOT NULL, -- sa argumentez de ce am folosit DateTimeOffSet
	Lifespan INT NOT NULL,

	CONSTRAINT PK_Messages PRIMARY KEY(Id),
	CONSTRAINT FK_Message_Sender FOREIGN KEY(SenderId, RoomId) REFERENCES [User_Rooms](UserId, RoomId),
	CONSTRAINT FK_Message_Receiver FOREIGN KEY(ReceiverId, RoomId) REFERENCES [User_Rooms](UserId, RoomId)
);
