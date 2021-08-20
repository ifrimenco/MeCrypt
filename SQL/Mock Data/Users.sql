MERGE INTO [Users] AS [Target]
USING (VALUES
	('90997D56-A5FC-4BD2-93C3-4F45AF3C63CE', 'ifrimenco.alex@gmail.com', 'Alex', 'Ifrimenco'),
	('B0EEE731-A608-45BF-8D27-012A82CD8951', 'alanparsons@test.com', 'Alan', 'Parsons'),
	('93E7130B-D092-417D-9CD2-485A9F9E3F92', 'vangelis@test.com', 'Vangelis', 'Papathanassíou'),
	('2475ACCA-1956-42D4-8082-89C4797856AE', 'rogerwaters@test.com', 'Roger', 'Waters')
) AS [Source] ([Id], [Email], [FirstName], [LastName])
ON ([Target].[Id] = [Source].[Id])
WHEN NOT MATCHED THEN
 INSERT([Id], [Email], [FirstName], [LastName])
 VALUES([Source].[Id], [Source].[Email], [Source].[FirstName], [Source].[LastName]);
GO
