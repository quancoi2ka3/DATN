CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NOT NULL,
    [DateOfBirth] datetime2 NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [LastLogin] datetime2 NULL,
    [IsActive] bit NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [ContactMessages] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [Subject] nvarchar(max) NOT NULL,
    [Message] nvarchar(max) NOT NULL,
    [IsRead] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [ReadAt] datetime2 NULL,
    CONSTRAINT [PK_ContactMessages] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [Events] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NULL,
    [EventDate] datetime2 NOT NULL,
    [Location] nvarchar(max) NOT NULL,
    [OrganizedBy] nvarchar(max) NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [RegistrationLink] nvarchar(max) NULL,
    [IsFeatured] bit NOT NULL,
    [StartTime] time NULL,
    [EndTime] time NULL,
    [Capacity] int NULL,
    CONSTRAINT [PK_Events] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [FAQs] (
    [Id] int NOT NULL IDENTITY,
    [Question] nvarchar(max) NOT NULL,
    [Answer] nvarchar(max) NOT NULL,
    [Category] int NOT NULL,
    [DisplayOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_FAQs] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [Products] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NULL,
    [Price] decimal(18,2) NOT NULL,
    [DiscountPrice] decimal(18,2) NULL,
    [StockQuantity] int NOT NULL,
    [Category] int NOT NULL,
    [SubCategory] nvarchar(max) NOT NULL,
    [Specifications] nvarchar(max) NULL,
    [IsFeatured] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [Services] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NULL,
    [Price] decimal(18,2) NOT NULL,
    [Type] int NOT NULL,
    [Features] nvarchar(max) NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Services] PRIMARY KEY ([Id])
);
GO


CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [OrderDate] datetime2 NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [Status] int NOT NULL,
    [ShippingAddress] nvarchar(max) NOT NULL,
    [PhoneNumber] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [PaymentMethod] nvarchar(max) NULL,
    [IsPaid] bit NOT NULL,
    [PaymentTransactionId] nvarchar(max) NULL,
    [TrackingNumber] nvarchar(max) NULL,
    [Notes] nvarchar(max) NULL,
    [ShippedDate] datetime2 NULL,
    [DeliveredDate] datetime2 NULL,
    [UpdatedAt] datetime2 NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
);
GO


CREATE TABLE [ServiceSchedules] (
    [Id] int NOT NULL IDENTITY,
    [ServiceId] int NOT NULL,
    [TrainerName] nvarchar(max) NOT NULL,
    [DayOfWeek] int NOT NULL,
    [StartTime] time NOT NULL,
    [EndTime] time NOT NULL,
    [MaxCapacity] int NOT NULL,
    [IsActive] bit NOT NULL,
    [Location] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NULL,
    [Capacity] int NOT NULL,
    [Instructor] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_ServiceSchedules] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ServiceSchedules_Services_ServiceId] FOREIGN KEY ([ServiceId]) REFERENCES [Services] ([Id]) ON DELETE CASCADE
);
GO


CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [ProductId] int NOT NULL,
    [Quantity] int NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [Subtotal] decimal(18,2) NOT NULL,
    [ProductName] nvarchar(max) NOT NULL,
    [ProductOptions] nvarchar(max) NULL,
    [OrderId1] int NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderItems_Orders_OrderId1] FOREIGN KEY ([OrderId1]) REFERENCES [Orders] ([Id]),
    CONSTRAINT [FK_OrderItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE NO ACTION
);
GO


CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
GO


CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
GO


CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
GO


CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
GO


CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
GO


CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
GO


CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
GO


CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);
GO


CREATE INDEX [IX_OrderItems_OrderId1] ON [OrderItems] ([OrderId1]);
GO


CREATE INDEX [IX_OrderItems_ProductId] ON [OrderItems] ([ProductId]);
GO


CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);
GO


CREATE INDEX [IX_ServiceSchedules_ServiceId] ON [ServiceSchedules] ([ServiceId]);
GO


