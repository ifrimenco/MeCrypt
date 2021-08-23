MERGE INTO [Permissions] AS [Target]
USING (VALUES
	(0, 'Application Access'),
	(1, 'Users View'),
	(2, 'Users Update'),
	(10, 'Room Create'),
	(11, 'Messages Read/Write'),
	(20, 'Secrets Deal'),
	(21, 'Secrets View')
) AS [Source] ([Id], [Title])
ON ([Target].[Id] = [Source].[Id])
WHEN NOT MATCHED THEN
 INSERT([Id], [Title])
 VALUES([Source].[Id], [Source].[Title]);
GO

MERGE INTO [Role_Permissions] AS [Target]
USING (VALUES
	(1, 0),
	(1, 1),
	(1, 10),
	(1, 11),
	(1, 21),
	(2, 0),
	(2, 1),
	(2, 2),
	(2, 10),
	(2, 11),
	(2, 20),
	(2, 21),
	(3, 0),
	(3, 1),
	(3, 10),
	(3, 11),
	(3, 20),
	(3, 21)

) AS [Source] ([RoleId], [PermissionId])
ON ([Target].[RoleId] = [Source].[RoleId] AND [Target].[PermissionId] = [Source].[PermissionId])
WHEN NOT MATCHED THEN
 INSERT([RoleId], [PermissionId])
 VALUES([Source].[RoleId], [Source].[PermissionId]);
GO