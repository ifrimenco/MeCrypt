MERGE INTO [Roles] AS [Target]
USING (VALUES
	(1, 'User'),
	(2, 'Admin'),
	(3, 'Dealer'),
	(4, 'Secret Viewer')
) AS [Source] ([Id], [Title])
ON ([Target].[Id] = [Source].[Id])
WHEN NOT MATCHED THEN
 INSERT([Id], [Title])
 VALUES([Source].[Id], [Source].[Title]);
GO
