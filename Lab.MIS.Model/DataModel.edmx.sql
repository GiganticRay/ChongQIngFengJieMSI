
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 05/09/2018 20:10:58
-- Generated from EDMX file: D:\Experience_Lab\CQfengjiexianLandslideDebrisFlowGeologicalDisasterDetectionAndWarningSystem\Git\Lab.MIS.MonitorMIS\Lab.MIS.Model\DataModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [MonitorMIS];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_MonitorPointInfoDeviceInfo]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[DeviceInfo] DROP CONSTRAINT [FK_MonitorPointInfoDeviceInfo];
GO
IF OBJECT_ID(N'[dbo].[FK_DeviceInfoPointPicture]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[PointPicture] DROP CONSTRAINT [FK_DeviceInfoPointPicture];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[UserInfo]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserInfo];
GO
IF OBJECT_ID(N'[dbo].[PointPicture]', 'U') IS NOT NULL
    DROP TABLE [dbo].[PointPicture];
GO
IF OBJECT_ID(N'[dbo].[DeviceInfo]', 'U') IS NOT NULL
    DROP TABLE [dbo].[DeviceInfo];
GO
IF OBJECT_ID(N'[dbo].[MonitorPointInfo]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MonitorPointInfo];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'UserInfo'
CREATE TABLE [dbo].[UserInfo] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserName] nvarchar(max)  NOT NULL,
    [UserPwd] nvarchar(max)  NOT NULL,
    [UserAuthority] int  NOT NULL
);
GO

-- Creating table 'PointPicture'
CREATE TABLE [dbo].[PointPicture] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [PicPath] nvarchar(max)  NOT NULL,
    [DeviceInfoId] int  NOT NULL
);
GO

-- Creating table 'DeviceInfo'
CREATE TABLE [dbo].[DeviceInfo] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [DeviceName] nvarchar(max)  NOT NULL,
    [ShuCaiNum] nvarchar(max)  NOT NULL,
    [SensorNum] nvarchar(max)  NOT NULL,
    [PhoneNum] nvarchar(max)  NOT NULL,
    [YaoshiNum] nvarchar(max)  NOT NULL,
    [DeviceLon] decimal(10,7)  NOT NULL,
    [DeviceLat] decimal(10,7)  NOT NULL,
    [MonitorType] nvarchar(max)  NOT NULL,
    [MonitorName] nvarchar(max)  NOT NULL,
    [MonitorPointInfoId] int  NOT NULL
);
GO

-- Creating table 'MonitorPointInfo'
CREATE TABLE [dbo].[MonitorPointInfo] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [MonitorId] int  NOT NULL,
    [Name] nvarchar(max)  NOT NULL,
    [Type] nvarchar(max)  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'UserInfo'
ALTER TABLE [dbo].[UserInfo]
ADD CONSTRAINT [PK_UserInfo]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'PointPicture'
ALTER TABLE [dbo].[PointPicture]
ADD CONSTRAINT [PK_PointPicture]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'DeviceInfo'
ALTER TABLE [dbo].[DeviceInfo]
ADD CONSTRAINT [PK_DeviceInfo]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'MonitorPointInfo'
ALTER TABLE [dbo].[MonitorPointInfo]
ADD CONSTRAINT [PK_MonitorPointInfo]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [MonitorPointInfoId] in table 'DeviceInfo'
ALTER TABLE [dbo].[DeviceInfo]
ADD CONSTRAINT [FK_MonitorPointInfoDeviceInfo]
    FOREIGN KEY ([MonitorPointInfoId])
    REFERENCES [dbo].[MonitorPointInfo]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_MonitorPointInfoDeviceInfo'
CREATE INDEX [IX_FK_MonitorPointInfoDeviceInfo]
ON [dbo].[DeviceInfo]
    ([MonitorPointInfoId]);
GO

-- Creating foreign key on [DeviceInfoId] in table 'PointPicture'
ALTER TABLE [dbo].[PointPicture]
ADD CONSTRAINT [FK_DeviceInfoPointPicture]
    FOREIGN KEY ([DeviceInfoId])
    REFERENCES [dbo].[DeviceInfo]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_DeviceInfoPointPicture'
CREATE INDEX [IX_FK_DeviceInfoPointPicture]
ON [dbo].[PointPicture]
    ([DeviceInfoId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------