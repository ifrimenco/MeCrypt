MERGE INTO [Users] AS [Target]
USING (VALUES
	('90997D56-A5FC-4BD2-93C3-4F45AF3C63CE', 'ifrimenco.alex@gmail.com', 'Alex', 'Ifrimenco', 'BClrQZDCDGr8BzN4WndIabogOcGP/IIRoUkLanR61aB7pMMrDhYY3RnRdYLhw0eN')
) AS [Source] ([Id], [Email], [FirstName], [LastName], [PasswordHash])
ON ([Target].[Id] = [Source].[Id])
WHEN NOT MATCHED THEN
 INSERT([Id], [Email], [FirstName], [LastName], [PasswordHash])
 VALUES([Source].[Id], [Source].[Email], [Source].[FirstName], [Source].[LastName], [Source].[PasswordHash]);
GO

MERGE INTO [User_Roles] AS [Target]
USING (VALUES 

	('90997D56-A5FC-4BD2-93C3-4F45AF3C63CE', 1)
	('90997D56-A5FC-4BD2-93C3-4F45AF3C63CE', 2)
) AS [Source] ([UserId], [RoleId])
ON ([Target].[UserId] = [Source].[UserId] AND [Target].[RoleId] = [Source].[RoleId])
WHEN NOT MATCHED THEN
 INSERT([UserId], [RoleId])
 VALUES([Source].[UserId], [Source].[RoleId]);
GO
