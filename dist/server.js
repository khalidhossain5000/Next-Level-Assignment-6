
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/app/middlewares/globalErrorHandler.ts
import httpStatus from "http-status";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Area {\n  id             String               @id @default(uuid())\n  name           String\n  code           String               @unique @db.VarChar(10)\n  address        String\n  status         InfrastructureStatus @default(ACTIVE)\n  feederId       String\n  feeder         Feeder               @relation("FeederAreas", fields: [feederId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  loadSheddings  LoadShedding[]       @relation("AreaLoadSheddings")\n  plannedOutages PlannedOutage[]      @relation("AreaPlannedOutages")\n  outages        Outage[]\n  createdAt      DateTime             @default(now())\n  updatedAt      DateTime             @updatedAt\n\n  @@index([name], name: "idx_area_name")\n  @@index([code], name: "idx_area_code")\n  @@index([feederId], name: "idx_area_feeder_id")\n  @@map("Areas")\n}\n\nenum Role {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BAN\n}\n\nenum TechnicianStatus {\n  AVAILABLE\n  BUSY\n  UNAVAILABLE\n}\n\nenum AuthProvider {\n  GOOGLE\n  CREDENTIAL\n}\n\nenum TechnicianProfileStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum InfrastructureStatus {\n  ACTIVE\n  INACTIVE\n}\n\nenum OutagePriority {\n  HIGH\n  NORMAL\n}\n\nenum OutageStatus {\n  REPORTED\n  ACKNOWLEDGED\n  ASSIGNED\n  IN_PROGRESS\n  RESTORED\n  CANCELLED\n}\n\nenum LoadSheddingStatus {\n  PENDING\n  ONGOING\n  SCHEDULED\n  CANCELLED\n  COMPLETED\n}\n\nenum PlannedOutageStatus {\n  SCHEDULED\n  ONGOING\n  CANCELLED\n  COMPLETED\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  CANCELLED\n}\n\nmodel Feeder {\n  id           String               @id @default(uuid())\n  name         String\n  code         String               @unique @db.VarChar(10)\n  voltageLevel String\n  status       InfrastructureStatus @default(ACTIVE)\n\n  substationId String\n  substation   Substation @relation("SubstationFeeders", fields: [substationId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  areas Area[] @relation("FeederAreas")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([name], name: "idx_feeder_name")\n  @@index([code], name: "idx_feeder_code")\n  @@index([substationId], name: "idx_feeder_substation_id")\n  @@map("Feeders")\n}\n\nmodel LoadShedding {\n  id        String             @id @default(uuid())\n  title     String\n  startTime DateTime\n  endTime   DateTime\n  status    LoadSheddingStatus @default(SCHEDULED)\n  reason    String?            @default("N/A")\n  areaId    String\n  area      Area               @relation("AreaLoadSheddings", fields: [areaId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([areaId], name: "idx_load_shedding_area_id")\n  @@index([status, startTime], name: "idx_load_shedding_status_start_time")\n  @@map("LoadSheddings")\n}\n\nmodel Outage {\n  id             String         @id @default(uuid())\n  cause          String\n  description    String\n  priority       OutagePriority @default(NORMAL)\n  reported_At    DateTime       @default(now())\n  status         OutageStatus   @default(REPORTED)\n  acknowledgedAt DateTime?\n  startedAt      DateTime?\n  isDeleted      Boolean        @default(false)\n  //foreign key of user to know which user reported unexpected outage\n  userId         String\n  user           User           @relation("OutageReporter", fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  payments       Payment[]      @relation("OutagePayments")\n\n  //technican foregin key to know which technican is assigned to this outage\n  technicianId String?\n  techician    User?   @relation("OutageTechnician", fields: [technicianId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  //area id to sknow which are\n\n  areaId String\n\n  area Area @relation(fields: [areaId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId], name: "idx_outage_user_id")\n  @@index([technicianId], name: "idx_outage_technician_id")\n  @@index([status, createdAt], name: "idx_outage_status_created_at")\n  @@index([priority], name: "idx_outage_priority")\n  @@map("Outages")\n}\n\nmodel Payment {\n  id             String        @id @default(uuid())\n  amount         Decimal       @db.Decimal(10, 2)\n  provider       String\n  transactionId  String        @unique\n  status         PaymentStatus @default(PENDING)\n  paidAt         DateTime?\n  customerId     String\n  customer       User          @relation("CustomerPayments", fields: [customerId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  outageReportId String\n  outage         Outage        @relation("OutagePayments", fields: [outageReportId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n\n  @@index([customerId], name: "idx_payment_customer_id")\n  @@index([outageReportId], name: "idx_payment_outage_report_id")\n  @@index([status], name: "idx_payment_status")\n  @@map("Payments")\n}\n\nmodel PlannedOutage {\n  id          String              @id @default(uuid())\n  title       String\n  reason      String\n  description String\n  status      PlannedOutageStatus @default(SCHEDULED)\n  startTime   DateTime\n  endTime     DateTime\n  areaId      String\n  area        Area                @relation("AreaPlannedOutages", fields: [areaId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  createdAt   DateTime            @default(now())\n  updatedAt   DateTime            @updatedAt\n\n  @@index([areaId], name: "idx_planned_outage_area_id")\n  @@index([status, startTime], name: "idx_planned_outage_status_start_time")\n  @@index([startTime, endTime], name: "idx_planned_outage_start_end_time")\n  @@map("PlannedOutages")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Substation {\n  id       String                @id @default(uuid())\n  name     String\n  capacity String\n  code     String                @unique @db.VarChar(10)\n  location String\n  status   InfrastructureStatus? @default(ACTIVE)\n  //foregin key making realtien with zone\n  zoneId   String\n  zone     Zone                  @relation(fields: [zoneId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  feeders Feeder[] @relation("SubstationFeeders")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([name], name: "idx_substation_name")\n  @@index([code], name: "idx_substation_code")\n  @@index([zoneId], name: "idx_substation_zone_id")\n  @@map("Substations")\n}\n\nmodel TechnicianProfile {\n  id             String           @id @default(uuid())\n  expertise      String[]         @default([])\n  experience     Int              @default(0)\n  availability   TechnicianStatus @default(AVAILABLE)\n  bio            String?\n  resume         String?\n  resumePublicId String?\n\n  technicianvProfileVerificationStatus TechnicianProfileStatus @default(PENDING)\n  rejectionReason                      String?\n\n  // Relation to User\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id])\n\n  @@index([id], name: "idx_technician_id")\n  @@map("TechnicianProfiles")\n}\n\nmodel User {\n  id                   String       @id @default(uuid())\n  name                 String\n  email                String       @unique\n  profileImage         String?      @default("https://i.ibb.co.com/mrH7HCPN/default-profile.png")\n  profileImagePublicId String       @default("")\n  googleId             String?      @unique\n  authProvider         AuthProvider @default(CREDENTIAL)\n\n  role              Role               @default(CUSTOMER)\n  emailVerified     Boolean            @default(false)\n  status            UserStatus         @default(ACTIVE)\n  password          String?\n  technicianProfile TechnicianProfile?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  reportedOutages Outage[]  @relation("OutageReporter")\n  assignedOutages Outage[]  @relation("OutageTechnician")\n  payments        Payment[] @relation("CustomerPayments")\n\n  @@index([email], name: "idx_user_email")\n  @@map("Users")\n}\n\nmodel Zone {\n  id                String               @id @default(uuid())\n  name              String\n  code              String               @unique @db.VarChar(10)\n  description       String\n  status            InfrastructureStatus @default(ACTIVE)\n  zoneImageUrl      String\n  zoneImagePublicId String\n  substations       Substation[]\n  createdAt         DateTime             @default(now())\n  updatedAt         DateTime             @updatedAt\n\n  @@index([name], name: "idx_zone_name")\n  @@index([code], name: "idx_zone_code")\n  @@map("Zones")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Area":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InfrastructureStatus"},{"name":"feederId","kind":"scalar","type":"String"},{"name":"feeder","kind":"object","type":"Feeder","relationName":"FeederAreas"},{"name":"loadSheddings","kind":"object","type":"LoadShedding","relationName":"AreaLoadSheddings"},{"name":"plannedOutages","kind":"object","type":"PlannedOutage","relationName":"AreaPlannedOutages"},{"name":"outages","kind":"object","type":"Outage","relationName":"AreaToOutage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"Areas","schema":null},"Feeder":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"voltageLevel","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InfrastructureStatus"},{"name":"substationId","kind":"scalar","type":"String"},{"name":"substation","kind":"object","type":"Substation","relationName":"SubstationFeeders"},{"name":"areas","kind":"object","type":"Area","relationName":"FeederAreas"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"Feeders","schema":null},"LoadShedding":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"LoadSheddingStatus"},{"name":"reason","kind":"scalar","type":"String"},{"name":"areaId","kind":"scalar","type":"String"},{"name":"area","kind":"object","type":"Area","relationName":"AreaLoadSheddings"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"LoadSheddings","schema":null},"Outage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cause","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"priority","kind":"enum","type":"OutagePriority"},{"name":"reported_At","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"OutageStatus"},{"name":"acknowledgedAt","kind":"scalar","type":"DateTime"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OutageReporter"},{"name":"payments","kind":"object","type":"Payment","relationName":"OutagePayments"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"techician","kind":"object","type":"User","relationName":"OutageTechnician"},{"name":"areaId","kind":"scalar","type":"String"},{"name":"area","kind":"object","type":"Area","relationName":"AreaToOutage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"Outages","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"provider","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerPayments"},{"name":"outageReportId","kind":"scalar","type":"String"},{"name":"outage","kind":"object","type":"Outage","relationName":"OutagePayments"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"Payments","schema":null},"PlannedOutage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PlannedOutageStatus"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"areaId","kind":"scalar","type":"String"},{"name":"area","kind":"object","type":"Area","relationName":"AreaPlannedOutages"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"PlannedOutages","schema":null},"Substation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InfrastructureStatus"},{"name":"zoneId","kind":"scalar","type":"String"},{"name":"zone","kind":"object","type":"Zone","relationName":"SubstationToZone"},{"name":"feeders","kind":"object","type":"Feeder","relationName":"SubstationFeeders"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"Substations","schema":null},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expertise","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"availability","kind":"enum","type":"TechnicianStatus"},{"name":"bio","kind":"scalar","type":"String"},{"name":"resume","kind":"scalar","type":"String"},{"name":"resumePublicId","kind":"scalar","type":"String"},{"name":"technicianvProfileVerificationStatus","kind":"enum","type":"TechnicianProfileStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianProfileToUser"}],"dbName":"TechnicianProfiles","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profileImage","kind":"scalar","type":"String"},{"name":"profileImagePublicId","kind":"scalar","type":"String"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"role","kind":"enum","type":"Role"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"password","kind":"scalar","type":"String"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"reportedOutages","kind":"object","type":"Outage","relationName":"OutageReporter"},{"name":"assignedOutages","kind":"object","type":"Outage","relationName":"OutageTechnician"},{"name":"payments","kind":"object","type":"Payment","relationName":"CustomerPayments"}],"dbName":"Users","schema":null},"Zone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InfrastructureStatus"},{"name":"zoneImageUrl","kind":"scalar","type":"String"},{"name":"zoneImagePublicId","kind":"scalar","type":"String"},{"name":"substations","kind":"object","type":"Substation","relationName":"SubstationToZone"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"Zones","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","substations","_count","zone","feeders","substation","areas","feeder","area","loadSheddings","plannedOutages","user","technicianProfile","reportedOutages","assignedOutages","customer","outage","payments","techician","outages","Area.findUnique","Area.findUniqueOrThrow","Area.findFirst","Area.findFirstOrThrow","Area.findMany","data","Area.createOne","Area.createMany","Area.createManyAndReturn","Area.updateOne","Area.updateMany","Area.updateManyAndReturn","create","update","Area.upsertOne","Area.deleteOne","Area.deleteMany","having","_min","_max","Area.groupBy","Area.aggregate","Feeder.findUnique","Feeder.findUniqueOrThrow","Feeder.findFirst","Feeder.findFirstOrThrow","Feeder.findMany","Feeder.createOne","Feeder.createMany","Feeder.createManyAndReturn","Feeder.updateOne","Feeder.updateMany","Feeder.updateManyAndReturn","Feeder.upsertOne","Feeder.deleteOne","Feeder.deleteMany","Feeder.groupBy","Feeder.aggregate","LoadShedding.findUnique","LoadShedding.findUniqueOrThrow","LoadShedding.findFirst","LoadShedding.findFirstOrThrow","LoadShedding.findMany","LoadShedding.createOne","LoadShedding.createMany","LoadShedding.createManyAndReturn","LoadShedding.updateOne","LoadShedding.updateMany","LoadShedding.updateManyAndReturn","LoadShedding.upsertOne","LoadShedding.deleteOne","LoadShedding.deleteMany","LoadShedding.groupBy","LoadShedding.aggregate","Outage.findUnique","Outage.findUniqueOrThrow","Outage.findFirst","Outage.findFirstOrThrow","Outage.findMany","Outage.createOne","Outage.createMany","Outage.createManyAndReturn","Outage.updateOne","Outage.updateMany","Outage.updateManyAndReturn","Outage.upsertOne","Outage.deleteOne","Outage.deleteMany","Outage.groupBy","Outage.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","_avg","_sum","Payment.groupBy","Payment.aggregate","PlannedOutage.findUnique","PlannedOutage.findUniqueOrThrow","PlannedOutage.findFirst","PlannedOutage.findFirstOrThrow","PlannedOutage.findMany","PlannedOutage.createOne","PlannedOutage.createMany","PlannedOutage.createManyAndReturn","PlannedOutage.updateOne","PlannedOutage.updateMany","PlannedOutage.updateManyAndReturn","PlannedOutage.upsertOne","PlannedOutage.deleteOne","PlannedOutage.deleteMany","PlannedOutage.groupBy","PlannedOutage.aggregate","Substation.findUnique","Substation.findUniqueOrThrow","Substation.findFirst","Substation.findFirstOrThrow","Substation.findMany","Substation.createOne","Substation.createMany","Substation.createManyAndReturn","Substation.updateOne","Substation.updateMany","Substation.updateManyAndReturn","Substation.upsertOne","Substation.deleteOne","Substation.deleteMany","Substation.groupBy","Substation.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","TechnicianProfile.groupBy","TechnicianProfile.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Zone.findUnique","Zone.findUniqueOrThrow","Zone.findFirst","Zone.findFirstOrThrow","Zone.findMany","Zone.createOne","Zone.createMany","Zone.createManyAndReturn","Zone.updateOne","Zone.updateMany","Zone.updateManyAndReturn","Zone.upsertOne","Zone.deleteOne","Zone.deleteMany","Zone.groupBy","Zone.aggregate","AND","OR","NOT","id","name","code","description","InfrastructureStatus","status","zoneImageUrl","zoneImagePublicId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","email","profileImage","profileImagePublicId","googleId","AuthProvider","authProvider","Role","role","emailVerified","UserStatus","password","expertise","experience","TechnicianStatus","availability","bio","resume","resumePublicId","TechnicianProfileStatus","technicianvProfileVerificationStatus","rejectionReason","userId","has","hasEvery","hasSome","capacity","location","zoneId","title","reason","PlannedOutageStatus","startTime","endTime","areaId","amount","provider","transactionId","PaymentStatus","paidAt","customerId","outageReportId","cause","OutagePriority","priority","reported_At","OutageStatus","acknowledgedAt","startedAt","isDeleted","technicianId","LoadSheddingStatus","voltageLevel","substationId","address","feederId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "qwVboAEPCQAA-wIAIAsAAPwCACAMAAD9AgAgFQAAuwIAIL4BAAD6AgAwvwEAAA0AEMABAAD6AgAwwQEBAAAAAcIBAQCfAgAhwwEBAAAAAcYBAACgAsYBIskBQAChAgAhygFAAKECACGOAgEAnwIAIY8CAQCfAgAhAQAAAAEAIA4FAACDAwAgBgAAhAMAIL4BAACBAwAwvwEAAAMAEMABAACBAwAwwQEBAJ8CACHCAQEAnwIAIcMBAQCfAgAhxgEAAIIDxgEjyQFAAKECACHKAUAAoQIAIfIBAQCfAgAh8wEBAJ8CACH0AQEAnwIAIQMFAADpBAAgBgAA6gQAIMYBAAD-AwAgDgUAAIMDACAGAACEAwAgvgEAAIEDADC_AQAAAwAQwAEAAIEDADDBAQEAAAABwgEBAJ8CACHDAQEAAAABxgEAAIIDxgEjyQFAAKECACHKAUAAoQIAIfIBAQCfAgAh8wEBAJ8CACH0AQEAnwIAIQMAAAADACABAAAEADACAAAFACABAAAAAwAgDQcAAP8CACAIAACAAwAgvgEAAP4CADC_AQAACAAQwAEAAP4CADDBAQEAnwIAIcIBAQCfAgAhwwEBAJ8CACHGAQAAoALGASLJAUAAoQIAIcoBQAChAgAhjAIBAJ8CACGNAgEAnwIAIQIHAADnBAAgCAAA6AQAIA0HAAD_AgAgCAAAgAMAIL4BAAD-AgAwvwEAAAgAEMABAAD-AgAwwQEBAAAAAcIBAQCfAgAhwwEBAAAAAcYBAACgAsYBIskBQAChAgAhygFAAKECACGMAgEAnwIAIY0CAQCfAgAhAwAAAAgAIAEAAAkAMAIAAAoAIAEAAAAIACAPCQAA-wIAIAsAAPwCACAMAAD9AgAgFQAAuwIAIL4BAAD6AgAwvwEAAA0AEMABAAD6AgAwwQEBAJ8CACHCAQEAnwIAIcMBAQCfAgAhxgEAAKACxgEiyQFAAKECACHKAUAAoQIAIY4CAQCfAgAhjwIBAJ8CACEECQAA5AQAIAsAAOUEACAMAADmBAAgFQAAtwQAIAMAAAANACABAAAOADACAAABACABAAAADQAgDQoAAPUCACC-AQAA-AIAML8BAAARABDAAQAA-AIAMMEBAQCfAgAhxgEAAPkCjAIiyQFAAKECACHKAUAAoQIAIfUBAQCfAgAh9gEBALUCACH4AUAAoQIAIfkBQAChAgAh-gEBAJ8CACECCgAA4wQAIPYBAAD-AwAgDQoAAPUCACC-AQAA-AIAML8BAAARABDAAQAA-AIAMMEBAQAAAAHGAQAA-QKMAiLJAUAAoQIAIcoBQAChAgAh9QEBAJ8CACH2AQEAtQIAIfgBQAChAgAh-QFAAKECACH6AQEAnwIAIQMAAAARACABAAASADACAAATACAOCgAA9QIAIL4BAAD2AgAwvwEAABUAEMABAAD2AgAwwQEBAJ8CACHEAQEAnwIAIcYBAAD3AvgBIskBQAChAgAhygFAAKECACH1AQEAnwIAIfYBAQCfAgAh-AFAAKECACH5AUAAoQIAIfoBAQCfAgAhAQoAAOMEACAOCgAA9QIAIL4BAAD2AgAwvwEAABUAEMABAAD2AgAwwQEBAAAAAcQBAQCfAgAhxgEAAPcC-AEiyQFAAKECACHKAUAAoQIAIfUBAQCfAgAh9gEBAJ8CACH4AUAAoQIAIfkBQAChAgAh-gEBAJ8CACEDAAAAFQAgAQAAFgAwAgAAFwAgFQoAAPUCACANAADMAgAgEwAAvAIAIBQAAPQCACC-AQAA8QIAML8BAAAZABDAAQAA8QIAMMEBAQCfAgAhxAEBAJ8CACHGAQAA8wKHAiLJAUAAoQIAIcoBQAChAgAh7gEBAJ8CACH6AQEAnwIAIYICAQCfAgAhhAIAAPIChAIihQJAAKECACGHAkAA7wIAIYgCQADvAgAhiQIgALgCACGKAgEAtQIAIQcKAADjBAAgDQAAwAQAIBMAALgEACAUAADABAAghwIAAP4DACCIAgAA_gMAIIoCAAD-AwAgFQoAAPUCACANAADMAgAgEwAAvAIAIBQAAPQCACC-AQAA8QIAML8BAAAZABDAAQAA8QIAMMEBAQAAAAHEAQEAnwIAIcYBAADzAocCIskBQAChAgAhygFAAKECACHuAQEAnwIAIfoBAQCfAgAhggIBAJ8CACGEAgAA8gKEAiKFAkAAoQIAIYcCQADvAgAhiAJAAO8CACGJAiAAuAIAIYoCAQC1AgAhAwAAABkAIAEAABoAMAIAABsAIA4NAADMAgAgvgEAAMgCADC_AQAAHQAQwAEAAMgCADDBAQEAnwIAIeQBAAC-AgAg5QECAMkCACHnAQAAygLnASLoAQEAtQIAIekBAQC1AgAh6gEBALUCACHsAQAAywLsASLtAQEAtQIAIe4BAQCfAgAhAQAAAB0AIAMAAAAZACABAAAaADACAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgDxEAAMwCACASAADwAgAgvgEAAOwCADC_AQAAIQAQwAEAAOwCADDBAQEAnwIAIcYBAADuAv8BIskBQAChAgAhygFAAKECACH7ARAA7QIAIfwBAQCfAgAh_QEBAJ8CACH_AUAA7wIAIYACAQCfAgAhgQIBAJ8CACEDEQAAwAQAIBIAAOIEACD_AQAA_gMAIA8RAADMAgAgEgAA8AIAIL4BAADsAgAwvwEAACEAEMABAADsAgAwwQEBAAAAAcYBAADuAv8BIskBQAChAgAhygFAAKECACH7ARAA7QIAIfwBAQCfAgAh_QEBAAAAAf8BQADvAgAhgAIBAJ8CACGBAgEAnwIAIQMAAAAhACABAAAiADACAAAjACABAAAAGQAgAQAAABkAIAEAAAAhACADAAAAIQAgAQAAIgAwAgAAIwAgFA4AALoCACAPAAC7AgAgEAAAuwIAIBMAALwCACC-AQAAtAIAML8BAAApABDAAQAAtAIAMMEBAQCfAgAhwgEBAJ8CACHGAQAAuQLjASLJAUAAoQIAIcoBQAChAgAh2QEBAJ8CACHaAQEAtQIAIdsBAQCfAgAh3AEBALUCACHeAQAAtgLeASLgAQAAtwLgASLhASAAuAIAIeMBAQC1AgAhAQAAACkAIAEAAAAhACABAAAAEQAgAQAAABUAIAEAAAAZACABAAAAAQAgAwAAAA0AIAEAAA4AMAIAAAEAIAMAAAANACABAAAOADACAAABACADAAAADQAgAQAADgAwAgAAAQAgDAkAAOEEACALAAD1AwAgDAAA9gMAIBUAAPcDACDBAQEAAAABwgEBAAAAAcMBAQAAAAHGAQAAAMYBAskBQAAAAAHKAUAAAAABjgIBAAAAAY8CAQAAAAEBGwAAMwAgCMEBAQAAAAHCAQEAAAABwwEBAAAAAcYBAAAAxgECyQFAAAAAAcoBQAAAAAGOAgEAAAABjwIBAAAAAQEbAAA1ADABGwAANQAwDAkAAOAEACALAACwAwAgDAAAsQMAIBUAALIDACDBAQEAiAMAIcIBAQCIAwAhwwEBAIgDACHGAQAAiQPGASLJAUAAigMAIcoBQACKAwAhjgIBAIgDACGPAgEAiAMAIQIAAAABACAbAAA4ACAIwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAIkDxgEiyQFAAIoDACHKAUAAigMAIY4CAQCIAwAhjwIBAIgDACECAAAADQAgGwAAOgAgAgAAAA0AIBsAADoAIAMAAAABACAiAAAzACAjAAA4ACABAAAAAQAgAQAAAA0AIAMEAADdBAAgKAAA3wQAICkAAN4EACALvgEAAOsCADC_AQAAQQAQwAEAAOsCADDBAQEAlAIAIcIBAQCUAgAhwwEBAJQCACHGAQAAlQLGASLJAUAAlgIAIcoBQACWAgAhjgIBAJQCACGPAgEAlAIAIQMAAAANACABAABAADAnAABBACADAAAADQAgAQAADgAwAgAAAQAgAQAAAAoAIAEAAAAKACADAAAACAAgAQAACQAwAgAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAIACABAAAJADACAAAKACAKBwAA3AQAIAgAAPkDACDBAQEAAAABwgEBAAAAAcMBAQAAAAHGAQAAAMYBAskBQAAAAAHKAUAAAAABjAIBAAAAAY0CAQAAAAEBGwAASQAgCMEBAQAAAAHCAQEAAAABwwEBAAAAAcYBAAAAxgECyQFAAAAAAcoBQAAAAAGMAgEAAAABjQIBAAAAAQEbAABLADABGwAASwAwCgcAANsEACAIAACkAwAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAIkDxgEiyQFAAIoDACHKAUAAigMAIYwCAQCIAwAhjQIBAIgDACECAAAACgAgGwAATgAgCMEBAQCIAwAhwgEBAIgDACHDAQEAiAMAIcYBAACJA8YBIskBQACKAwAhygFAAIoDACGMAgEAiAMAIY0CAQCIAwAhAgAAAAgAIBsAAFAAIAIAAAAIACAbAABQACADAAAACgAgIgAASQAgIwAATgAgAQAAAAoAIAEAAAAIACADBAAA2AQAICgAANoEACApAADZBAAgC74BAADqAgAwvwEAAFcAEMABAADqAgAwwQEBAJQCACHCAQEAlAIAIcMBAQCUAgAhxgEAAJUCxgEiyQFAAJYCACHKAUAAlgIAIYwCAQCUAgAhjQIBAJQCACEDAAAACAAgAQAAVgAwJwAAVwAgAwAAAAgAIAEAAAkAMAIAAAoAIAEAAAATACABAAAAEwAgAwAAABEAIAEAABIAMAIAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgCgoAANcEACDBAQEAAAABxgEAAACMAgLJAUAAAAABygFAAAAAAfUBAQAAAAH2AQEAAAAB-AFAAAAAAfkBQAAAAAH6AQEAAAABARsAAF8AIAnBAQEAAAABxgEAAACMAgLJAUAAAAABygFAAAAAAfUBAQAAAAH2AQEAAAAB-AFAAAAAAfkBQAAAAAH6AQEAAAABARsAAGEAMAEbAABhADAKCgAA1gQAIMEBAQCIAwAhxgEAAPEDjAIiyQFAAIoDACHKAUAAigMAIfUBAQCIAwAh9gEBAMEDACH4AUAAigMAIfkBQACKAwAh-gEBAIgDACECAAAAEwAgGwAAZAAgCcEBAQCIAwAhxgEAAPEDjAIiyQFAAIoDACHKAUAAigMAIfUBAQCIAwAh9gEBAMEDACH4AUAAigMAIfkBQACKAwAh-gEBAIgDACECAAAAEQAgGwAAZgAgAgAAABEAIBsAAGYAIAMAAAATACAiAABfACAjAABkACABAAAAEwAgAQAAABEAIAQEAADTBAAgKAAA1QQAICkAANQEACD2AQAA_gMAIAy-AQAA5gIAML8BAABtABDAAQAA5gIAMMEBAQCUAgAhxgEAAOcCjAIiyQFAAJYCACHKAUAAlgIAIfUBAQCUAgAh9gEBAKQCACH4AUAAlgIAIfkBQACWAgAh-gEBAJQCACEDAAAAEQAgAQAAbAAwJwAAbQAgAwAAABEAIAEAABIAMAIAABMAIAEAAAAbACABAAAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgEgoAAJ4EACANAADXAwAgEwAA2AMAIBQAANkDACDBAQEAAAABxAEBAAAAAcYBAAAAhwICyQFAAAAAAcoBQAAAAAHuAQEAAAAB-gEBAAAAAYICAQAAAAGEAgAAAIQCAoUCQAAAAAGHAkAAAAABiAJAAAAAAYkCIAAAAAGKAgEAAAABARsAAHUAIA7BAQEAAAABxAEBAAAAAcYBAAAAhwICyQFAAAAAAcoBQAAAAAHuAQEAAAAB-gEBAAAAAYICAQAAAAGEAgAAAIQCAoUCQAAAAAGHAkAAAAABiAJAAAAAAYkCIAAAAAGKAgEAAAABARsAAHcAMAEbAAB3ADABAAAAKQAgEgoAAJwEACANAADDAwAgEwAAxAMAIBQAAMUDACDBAQEAiAMAIcQBAQCIAwAhxgEAAL4DhwIiyQFAAIoDACHKAUAAigMAIe4BAQCIAwAh-gEBAIgDACGCAgEAiAMAIYQCAAC9A4QCIoUCQACKAwAhhwJAAL8DACGIAkAAvwMAIYkCIADAAwAhigIBAMEDACECAAAAGwAgGwAAewAgDsEBAQCIAwAhxAEBAIgDACHGAQAAvgOHAiLJAUAAigMAIcoBQACKAwAh7gEBAIgDACH6AQEAiAMAIYICAQCIAwAhhAIAAL0DhAIihQJAAIoDACGHAkAAvwMAIYgCQAC_AwAhiQIgAMADACGKAgEAwQMAIQIAAAAZACAbAAB9ACACAAAAGQAgGwAAfQAgAQAAACkAIAMAAAAbACAiAAB1ACAjAAB7ACABAAAAGwAgAQAAABkAIAYEAADQBAAgKAAA0gQAICkAANEEACCHAgAA_gMAIIgCAAD-AwAgigIAAP4DACARvgEAAN8CADC_AQAAhQEAEMABAADfAgAwwQEBAJQCACHEAQEAlAIAIcYBAADhAocCIskBQACWAgAhygFAAJYCACHuAQEAlAIAIfoBAQCUAgAhggIBAJQCACGEAgAA4AKEAiKFAkAAlgIAIYcCQADYAgAhiAJAANgCACGJAiAApwIAIYoCAQCkAgAhAwAAABkAIAEAAIQBADAnAACFAQAgAwAAABkAIAEAABoAMAIAABsAIAEAAAAjACABAAAAIwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAAhACABAAAiADACAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgDBEAANUDACASAACTBAAgwQEBAAAAAcYBAAAA_wECyQFAAAAAAcoBQAAAAAH7ARAAAAAB_AEBAAAAAf0BAQAAAAH_AUAAAAABgAIBAAAAAYECAQAAAAEBGwAAjQEAIArBAQEAAAABxgEAAAD_AQLJAUAAAAABygFAAAAAAfsBEAAAAAH8AQEAAAAB_QEBAAAAAf8BQAAAAAGAAgEAAAABgQIBAAAAAQEbAACPAQAwARsAAI8BADAMEQAA0wMAIBIAAJEEACDBAQEAiAMAIcYBAADRA_8BIskBQACKAwAhygFAAIoDACH7ARAA0AMAIfwBAQCIAwAh_QEBAIgDACH_AUAAvwMAIYACAQCIAwAhgQIBAIgDACECAAAAIwAgGwAAkgEAIArBAQEAiAMAIcYBAADRA_8BIskBQACKAwAhygFAAIoDACH7ARAA0AMAIfwBAQCIAwAh_QEBAIgDACH_AUAAvwMAIYACAQCIAwAhgQIBAIgDACECAAAAIQAgGwAAlAEAIAIAAAAhACAbAACUAQAgAwAAACMAICIAAI0BACAjAACSAQAgAQAAACMAIAEAAAAhACAGBAAAywQAICgAAM4EACApAADNBAAgagAAzAQAIGsAAM8EACD_AQAA_gMAIA2-AQAA1QIAML8BAACbAQAQwAEAANUCADDBAQEAlAIAIcYBAADXAv8BIskBQACWAgAhygFAAJYCACH7ARAA1gIAIfwBAQCUAgAh_QEBAJQCACH_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_gMAIOoBAAD-AwAg7QEAAP4DACADAAAAHQAgAQAAzQEAMAIAAMoBACADAAAAHQAgAQAAzQEAMAIAAMoBACADAAAAHQAgAQAAzQEAMAIAAMoBACALDQAAvwQAIMEBAQAAAAHkAQAAsQQAIOUBAgAAAAHnAQAAAOcBAugBAQAAAAHpAQEAAAAB6gEBAAAAAewBAAAA7AEC7QEBAAAAAe4BAQAAAAEBGwAA0QEAIArBAQEAAAAB5AEAALEEACDlAQIAAAAB5wEAAADnAQLoAQEAAAAB6QEBAAAAAeoBAQAAAAHsAQAAAOwBAu0BAQAAAAHuAQEAAAABARsAANMBADABGwAA0wEAMAsNAAC-BAAgwQEBAIgDACHkAQAArQQAIOUBAgCuBAAh5wEAAK8E5wEi6AEBAMEDACHpAQEAwQMAIeoBAQDBAwAh7AEAALAE7AEi7QEBAMEDACHuAQEAiAMAIQIAAADKAQAgGwAA1gEAIArBAQEAiAMAIeQBAACtBAAg5QECAK4EACHnAQAArwTnASLoAQEAwQMAIekBAQDBAwAh6gEBAMEDACHsAQAAsATsASLtAQEAwQMAIe4BAQCIAwAhAgAAAB0AIBsAANgBACACAAAAHQAgGwAA2AEAIAMAAADKAQAgIgAA0QEAICMAANYBACABAAAAygEAIAEAAAAdACAJBAAAuQQAICgAALwEACApAAC7BAAgagAAugQAIGsAAL0EACDoAQAA_gMAIOkBAAD-AwAg6gEAAP4DACDtAQAA_gMAIA2-AQAAvQIAML8BAADfAQAQwAEAAL0CADDBAQEAlAIAIeQBAAC-AgAg5QECAL8CACHnAQAAwALnASLoAQEApAIAIekBAQCkAgAh6gEBAKQCACHsAQAAwQLsASLtAQEApAIAIe4BAQCUAgAhAwAAAB0AIAEAAN4BADAnAADfAQAgAwAAAB0AIAEAAM0BADACAADKAQAgFA4AALoCACAPAAC7AgAgEAAAuwIAIBMAALwCACC-AQAAtAIAML8BAAApABDAAQAAtAIAMMEBAQAAAAHCAQEAnwIAIcYBAAC5AuMBIskBQAChAgAhygFAAKECACHZAQEAAAAB2gEBALUCACHbAQEAnwIAIdwBAQAAAAHeAQAAtgLeASLgAQAAtwLgASLhASAAuAIAIeMBAQC1AgAhAQAAAOIBACABAAAA4gEAIAcOAAC2BAAgDwAAtwQAIBAAALcEACATAAC4BAAg2gEAAP4DACDcAQAA_gMAIOMBAAD-AwAgAwAAACkAIAEAAOUBADACAADiAQAgAwAAACkAIAEAAOUBADACAADiAQAgAwAAACkAIAEAAOUBADACAADiAQAgEQ4AALIEACAPAACzBAAgEAAAtAQAIBMAALUEACDBAQEAAAABwgEBAAAAAcYBAAAA4wECyQFAAAAAAcoBQAAAAAHZAQEAAAAB2gEBAAAAAdsBAQAAAAHcAQEAAAAB3gEAAADeAQLgAQAAAOABAuEBIAAAAAHjAQEAAAABARsAAOkBACANwQEBAAAAAcIBAQAAAAHGAQAAAOMBAskBQAAAAAHKAUAAAAAB2QEBAAAAAdoBAQAAAAHbAQEAAAAB3AEBAAAAAd4BAAAA3gEC4AEAAADgAQLhASAAAAAB4wEBAAAAAQEbAADrAQAwARsAAOsBADARDgAAhQQAIA8AAIYEACAQAACHBAAgEwAAiAQAIMEBAQCIAwAhwgEBAIgDACHGAQAAhATjASLJAUAAigMAIcoBQACKAwAh2QEBAIgDACHaAQEAwQMAIdsBAQCIAwAh3AEBAMEDACHeAQAAggTeASLgAQAAgwTgASLhASAAwAMAIeMBAQDBAwAhAgAAAOIBACAbAADuAQAgDcEBAQCIAwAhwgEBAIgDACHGAQAAhATjASLJAUAAigMAIcoBQACKAwAh2QEBAIgDACHaAQEAwQMAIdsBAQCIAwAh3AEBAMEDACHeAQAAggTeASLgAQAAgwTgASLhASAAwAMAIeMBAQDBAwAhAgAAACkAIBsAAPABACACAAAAKQAgGwAA8AEAIAMAAADiAQAgIgAA6QEAICMAAO4BACABAAAA4gEAIAEAAAApACAGBAAA_wMAICgAAIEEACApAACABAAg2gEAAP4DACDcAQAA_gMAIOMBAAD-AwAgEL4BAACjAgAwvwEAAPcBABDAAQAAowIAMMEBAQCUAgAhwgEBAJQCACHGAQAAqALjASLJAUAAlgIAIcoBQACWAgAh2QEBAJQCACHaAQEApAIAIdsBAQCUAgAh3AEBAKQCACHeAQAApQLeASLgAQAApgLgASLhASAApwIAIeMBAQCkAgAhAwAAACkAIAEAAPYBADAnAAD3AQAgAwAAACkAIAEAAOUBADACAADiAQAgDQMAAKICACC-AQAAngIAML8BAAD9AQAQwAEAAJ4CADDBAQEAAAABwgEBAJ8CACHDAQEAAAABxAEBAJ8CACHGAQAAoALGASLHAQEAnwIAIcgBAQCfAgAhyQFAAKECACHKAUAAoQIAIQEAAAD6AQAgAQAAAPoBACANAwAAogIAIL4BAACeAgAwvwEAAP0BABDAAQAAngIAMMEBAQCfAgAhwgEBAJ8CACHDAQEAnwIAIcQBAQCfAgAhxgEAAKACxgEixwEBAJ8CACHIAQEAnwIAIckBQAChAgAhygFAAKECACEBAwAA_QMAIAMAAAD9AQAgAQAA_gEAMAIAAPoBACADAAAA_QEAIAEAAP4BADACAAD6AQAgAwAAAP0BACABAAD-AQAwAgAA-gEAIAoDAAD8AwAgwQEBAAAAAcIBAQAAAAHDAQEAAAABxAEBAAAAAcYBAAAAxgECxwEBAAAAAcgBAQAAAAHJAUAAAAABygFAAAAAAQEbAACCAgAgCcEBAQAAAAHCAQEAAAABwwEBAAAAAcQBAQAAAAHGAQAAAMYBAscBAQAAAAHIAQEAAAAByQFAAAAAAcoBQAAAAAEBGwAAhAIAMAEbAACEAgAwCgMAAIsDACDBAQEAiAMAIcIBAQCIAwAhwwEBAIgDACHEAQEAiAMAIcYBAACJA8YBIscBAQCIAwAhyAEBAIgDACHJAUAAigMAIcoBQACKAwAhAgAAAPoBACAbAACHAgAgCcEBAQCIAwAhwgEBAIgDACHDAQEAiAMAIcQBAQCIAwAhxgEAAIkDxgEixwEBAIgDACHIAQEAiAMAIckBQACKAwAhygFAAIoDACECAAAA_QEAIBsAAIkCACACAAAA_QEAIBsAAIkCACADAAAA-gEAICIAAIICACAjAACHAgAgAQAAAPoBACABAAAA_QEAIAMEAACFAwAgKAAAhwMAICkAAIYDACAMvgEAAJMCADC_AQAAkAIAEMABAACTAgAwwQEBAJQCACHCAQEAlAIAIcMBAQCUAgAhxAEBAJQCACHGAQAAlQLGASLHAQEAlAIAIcgBAQCUAgAhyQFAAJYCACHKAUAAlgIAIQMAAAD9AQAgAQAAjwIAMCcAAJACACADAAAA_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_AQAAHQAQwAEAAMgCADDBAQEAnwIAIeQBAAC-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-AEI0gEAANMC-AEiBMsBAAAA-AECzAEAAAD4AQjNAQAAAPgBCNIBAADUAvgBIg2-AQAA1QIAML8BAACbAQAQwAEAANUCADDBAQEAlAIAIcYBAADXAv8BIskBQACWAgAhygFAAJYCACH7ARAA1gIAIfwBAQCUAgAh_QEBAJQCACH_AUAA2AIAIYACAQCUAgAhgQIBAJQCACENBAAAmAIAICgAAN4CACApAADeAgAgagAA3gIAIGsAAN4CACDLARAAAAABzAEQAAAABM0BEAAAAATOARAAAAABzwEQAAAAAdABEAAAAAHRARAAAAAB0gEQAN0CACEHBAAAmAIAICgAANwCACApAADcAgAgywEAAAD_AQLMAQAAAP8BCM0BAAAA_wEI0gEAANsC_wEiCwQAALICACAoAADaAgAgKQAA2gIAIMsBQAAAAAHMAUAAAAAFzQFAAAAABc4BQAAAAAHPAUAAAAAB0AFAAAAAAdEBQAAAAAHSAUAA2QIAIQsEAACyAgAgKAAA2gIAICkAANoCACDLAUAAAAABzAFAAAAABc0BQAAAAAXOAUAAAAABzwFAAAAAAdABQAAAAAHRAUAAAAAB0gFAANkCACEIywFAAAAAAcwBQAAAAAXNAUAAAAAFzgFAAAAAAc8BQAAAAAHQAUAAAAAB0QFAAAAAAdIBQADaAgAhBwQAAJgCACAoAADcAgAgKQAA3AIAIMsBAAAA_wECzAEAAAD_AQjNAQAAAP8BCNIBAADbAv8BIgTLAQAAAP8BAswBAAAA_wEIzQEAAAD_AQjSAQAA3AL_ASINBAAAmAIAICgAAN4CACApAADeAgAgagAA3gIAIGsAAN4CACDLARAAAAABzAEQAAAABM0BEAAAAATOARAAAAABzwEQAAAAAdABEAAAAAHRARAAAAAB0gEQAN0CACEIywEQAAAAAcwBEAAAAATNARAAAAAEzgEQAAAAAc8BEAAAAAHQARAAAAAB0QEQAAAAAdIBEADeAgAhEb4BAADfAgAwvwEAAIUBABDAAQAA3wIAMMEBAQCUAgAhxAEBAJQCACHGAQAA4QKHAiLJAUAAlgIAIcoBQACWAgAh7gEBAJQCACH6AQEAlAIAIYICAQCUAgAhhAIAAOAChAIihQJAAJYCACGHAkAA2AIAIYgCQADYAgAhiQIgAKcCACGKAgEApAIAIQcEAACYAgAgKAAA5QIAICkAAOUCACDLAQAAAIQCAswBAAAAhAIIzQEAAACEAgjSAQAA5AKEAiIHBAAAmAIAICgAAOMCACApAADjAgAgywEAAACHAgLMAQAAAIcCCM0BAAAAhwII0gEAAOIChwIiBwQAAJgCACAoAADjAgAgKQAA4wIAIMsBAAAAhwICzAEAAACHAgjNAQAAAIcCCNIBAADiAocCIgTLAQAAAIcCAswBAAAAhwIIzQEAAACHAgjSAQAA4wKHAiIHBAAAmAIAICgAAOUCACApAADlAgAgywEAAACEAgLMAQAAAIQCCM0BAAAAhAII0gEAAOQChAIiBMsBAAAAhAICzAEAAACEAgjNAQAAAIQCCNIBAADlAoQCIgy-AQAA5gIAML8BAABtABDAAQAA5gIAMMEBAQCUAgAhxgEAAOcCjAIiyQFAAJYCACHKAUAAlgIAIfUBAQCUAgAh9gEBAKQCACH4AUAAlgIAIfkBQACWAgAh-gEBAJQCACEHBAAAmAIAICgAAOkCACApAADpAgAgywEAAACMAgLMAQAAAIwCCM0BAAAAjAII0gEAAOgCjAIiBwQAAJgCACAoAADpAgAgKQAA6QIAIMsBAAAAjAICzAEAAACMAgjNAQAAAIwCCNIBAADoAowCIgTLAQAAAIwCAswBAAAAjAIIzQEAAACMAgjSAQAA6QKMAiILvgEAAOoCADC_AQAAVwAQwAEAAOoCADDBAQEAlAIAIcIBAQCUAgAhwwEBAJQCACHGAQAAlQLGASLJAUAAlgIAIcoBQACWAgAhjAIBAJQCACGNAgEAlAIAIQu-AQAA6wIAML8BAABBABDAAQAA6wIAMMEBAQCUAgAhwgEBAJQCACHDAQEAlAIAIcYBAACVAsYBIskBQACWAgAhygFAAJYCACGOAgEAlAIAIY8CAQCUAgAhDxEAAMwCACASAADwAgAgvgEAAOwCADC_AQAAIQAQwAEAAOwCADDBAQEAnwIAIcYBAADuAv8BIskBQAChAgAhygFAAKECACH7ARAA7QIAIfwBAQCfAgAh_QEBAJ8CACH_AUAA7wIAIYACAQCfAgAhgQIBAJ8CACEIywEQAAAAAcwBEAAAAATNARAAAAAEzgEQAAAAAc8BEAAAAAHQARAAAAAB0QEQAAAAAdIBEADeAgAhBMsBAAAA_wECzAEAAAD_AQjNAQAAAP8BCNIBAADcAv8BIgjLAUAAAAABzAFAAAAABc0BQAAAAAXOAUAAAAABzwFAAAAAAdABQAAAAAHRAUAAAAAB0gFAANoCACEXCgAA9QIAIA0AAMwCACATAAC8AgAgFAAA9AIAIL4BAADxAgAwvwEAABkAEMABAADxAgAwwQEBAJ8CACHEAQEAnwIAIcYBAADzAocCIskBQAChAgAhygFAAKECACHuAQEAnwIAIfoBAQCfAgAhggIBAJ8CACGEAgAA8gKEAiKFAkAAoQIAIYcCQADvAgAhiAJAAO8CACGJAiAAuAIAIYoCAQC1AgAhkAIAABkAIJECAAAZACAVCgAA9QIAIA0AAMwCACATAAC8AgAgFAAA9AIAIL4BAADxAgAwvwEAABkAEMABAADxAgAwwQEBAJ8CACHEAQEAnwIAIcYBAADzAocCIskBQAChAgAhygFAAKECACHuAQEAnwIAIfoBAQCfAgAhggIBAJ8CACGEAgAA8gKEAiKFAkAAoQIAIYcCQADvAgAhiAJAAO8CACGJAiAAuAIAIYoCAQC1AgAhBMsBAAAAhAICzAEAAACEAgjNAQAAAIQCCNIBAADlAoQCIgTLAQAAAIcCAswBAAAAhwIIzQEAAACHAgjSAQAA4wKHAiIWDgAAugIAIA8AALsCACAQAAC7AgAgEwAAvAIAIL4BAAC0AgAwvwEAACkAEMABAAC0AgAwwQEBAJ8CACHCAQEAnwIAIcYBAAC5AuMBIskBQAChAgAhygFAAKECACHZAQEAnwIAIdoBAQC1AgAh2wEBAJ8CACHcAQEAtQIAId4BAAC2At4BIuABAAC3AuABIuEBIAC4AgAh4wEBALUCACGQAgAAKQAgkQIAACkAIBEJAAD7AgAgCwAA_AIAIAwAAP0CACAVAAC7AgAgvgEAAPoCADC_AQAADQAQwAEAAPoCADDBAQEAnwIAIcIBAQCfAgAhwwEBAJ8CACHGAQAAoALGASLJAUAAoQIAIcoBQAChAgAhjgIBAJ8CACGPAgEAnwIAIZACAAANACCRAgAADQAgDgoAAPUCACC-AQAA9gIAML8BAAAVABDAAQAA9gIAMMEBAQCfAgAhxAEBAJ8CACHGAQAA9wL4ASLJAUAAoQIAIcoBQAChAgAh9QEBAJ8CACH2AQEAnwIAIfgBQAChAgAh-QFAAKECACH6AQEAnwIAIQTLAQAAAPgBAswBAAAA-AEIzQEAAAD4AQjSAQAA1AL4ASINCgAA9QIAIL4BAAD4AgAwvwEAABEAEMABAAD4AgAwwQEBAJ8CACHGAQAA-QKMAiLJAUAAoQIAIcoBQAChAgAh9QEBAJ8CACH2AQEAtQIAIfgBQAChAgAh-QFAAKECACH6AQEAnwIAIQTLAQAAAIwCAswBAAAAjAIIzQEAAACMAgjSAQAA6QKMAiIPCQAA-wIAIAsAAPwCACAMAAD9AgAgFQAAuwIAIL4BAAD6AgAwvwEAAA0AEMABAAD6AgAwwQEBAJ8CACHCAQEAnwIAIcMBAQCfAgAhxgEAAKACxgEiyQFAAKECACHKAUAAoQIAIY4CAQCfAgAhjwIBAJ8CACEPBwAA_wIAIAgAAIADACC-AQAA_gIAML8BAAAIABDAAQAA_gIAMMEBAQCfAgAhwgEBAJ8CACHDAQEAnwIAIcYBAACgAsYBIskBQAChAgAhygFAAKECACGMAgEAnwIAIY0CAQCfAgAhkAIAAAgAIJECAAAIACAD1gEAABEAINcBAAARACDYAQAAEQAgA9YBAAAVACDXAQAAFQAg2AEAABUAIA0HAAD_AgAgCAAAgAMAIL4BAAD-AgAwvwEAAAgAEMABAAD-AgAwwQEBAJ8CACHCAQEAnwIAIcMBAQCfAgAhxgEAAKACxgEiyQFAAKECACHKAUAAoQIAIYwCAQCfAgAhjQIBAJ8CACEQBQAAgwMAIAYAAIQDACC-AQAAgQMAML8BAAADABDAAQAAgQMAMMEBAQCfAgAhwgEBAJ8CACHDAQEAnwIAIcYBAACCA8YBI8kBQAChAgAhygFAAKECACHyAQEAnwIAIfMBAQCfAgAh9AEBAJ8CACGQAgAAAwAgkQIAAAMAIAPWAQAADQAg1wEAAA0AINgBAAANACAOBQAAgwMAIAYAAIQDACC-AQAAgQMAML8BAAADABDAAQAAgQMAMMEBAQCfAgAhwgEBAJ8CACHDAQEAnwIAIcYBAACCA8YBI8kBQAChAgAhygFAAKECACHyAQEAnwIAIfMBAQCfAgAh9AEBAJ8CACEEywEAAADGAQPMAQAAAMYBCc0BAAAAxgEJ0gEAANACxgEjDwMAAKICACC-AQAAngIAML8BAAD9AQAQwAEAAJ4CADDBAQEAnwIAIcIBAQCfAgAhwwEBAJ8CACHEAQEAnwIAIcYBAACgAsYBIscBAQCfAgAhyAEBAJ8CACHJAUAAoQIAIcoBQAChAgAhkAIAAP0BACCRAgAA_QEAIAPWAQAACAAg1wEAAAgAINgBAAAIACAAAAABlQIBAAAAAQGVAgAAAMYBAgGVAkAAAAABCyIAAIwDADAjAACRAwAwkgIAAI0DADCTAgAAjgMAMJQCAACPAwAglQIAAJADADCWAgAAkAMAMJcCAACQAwAwmAIAAJADADCZAgAAkgMAMJoCAACTAwAwCQYAAPsDACDBAQEAAAABwgEBAAAAAcMBAQAAAAHGAQAAAMYBA8kBQAAAAAHKAUAAAAAB8gEBAAAAAfMBAQAAAAECAAAABQAgIgAA-gMAIAMAAAAFACAiAAD6AwAgIwAAlwMAIAEbAACrBQAwDgUAAIMDACAGAACEAwAgvgEAAIEDADC_AQAAAwAQwAEAAIEDADDBAQEAAAABwgEBAJ8CACHDAQEAAAABxgEAAIIDxgEjyQFAAKECACHKAUAAoQIAIfIBAQCfAgAh8wEBAJ8CACH0AQEAnwIAIQIAAAAFACAbAACXAwAgAgAAAJQDACAbAACVAwAgDL4BAACTAwAwvwEAAJQDABDAAQAAkwMAMMEBAQCfAgAhwgEBAJ8CACHDAQEAnwIAIcYBAACCA8YBI8kBQAChAgAhygFAAKECACHyAQEAnwIAIfMBAQCfAgAh9AEBAJ8CACEMvgEAAJMDADC_AQAAlAMAEMABAACTAwAwwQEBAJ8CACHCAQEAnwIAIcMBAQCfAgAhxgEAAIIDxgEjyQFAAKECACHKAUAAoQIAIfIBAQCfAgAh8wEBAJ8CACH0AQEAnwIAIQjBAQEAiAMAIcIBAQCIAwAhwwEBAIgDACHGAQAAlgPGASPJAUAAigMAIcoBQACKAwAh8gEBAIgDACHzAQEAiAMAIQGVAgAAAMYBAwkGAACYAwAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAJYDxgEjyQFAAIoDACHKAUAAigMAIfIBAQCIAwAh8wEBAIgDACELIgAAmQMAMCMAAJ4DADCSAgAAmgMAMJMCAACbAwAwlAIAAJwDACCVAgAAnQMAMJYCAACdAwAwlwIAAJ0DADCYAgAAnQMAMJkCAACfAwAwmgIAAKADADAICAAA-QMAIMEBAQAAAAHCAQEAAAABwwEBAAAAAcYBAAAAxgECyQFAAAAAAcoBQAAAAAGMAgEAAAABAgAAAAoAICIAAPgDACADAAAACgAgIgAA-AMAICMAAKMDACABGwAAqgUAMA0HAAD_AgAgCAAAgAMAIL4BAAD-AgAwvwEAAAgAEMABAAD-AgAwwQEBAAAAAcIBAQCfAgAhwwEBAAAAAcYBAACgAsYBIskBQAChAgAhygFAAKECACGMAgEAnwIAIY0CAQCfAgAhAgAAAAoAIBsAAKMDACACAAAAoQMAIBsAAKIDACALvgEAAKADADC_AQAAoQMAEMABAACgAwAwwQEBAJ8CACHCAQEAnwIAIcMBAQCfAgAhxgEAAKACxgEiyQFAAKECACHKAUAAoQIAIYwCAQCfAgAhjQIBAJ8CACELvgEAAKADADC_AQAAoQMAEMABAACgAwAwwQEBAJ8CACHCAQEAnwIAIcMBAQCfAgAhxgEAAKACxgEiyQFAAKECACHKAUAAoQIAIYwCAQCfAgAhjQIBAJ8CACEHwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAIkDxgEiyQFAAIoDACHKAUAAigMAIYwCAQCIAwAhCAgAAKQDACDBAQEAiAMAIcIBAQCIAwAhwwEBAIgDACHGAQAAiQPGASLJAUAAigMAIcoBQACKAwAhjAIBAIgDACELIgAApQMAMCMAAKoDADCSAgAApgMAMJMCAACnAwAwlAIAAKgDACCVAgAAqQMAMJYCAACpAwAwlwIAAKkDADCYAgAAqQMAMJkCAACrAwAwmgIAAKwDADAKCwAA9QMAIAwAAPYDACAVAAD3AwAgwQEBAAAAAcIBAQAAAAHDAQEAAAABxgEAAADGAQLJAUAAAAABygFAAAAAAY4CAQAAAAECAAAAAQAgIgAA9AMAIAMAAAABACAiAAD0AwAgIwAArwMAIAEbAACpBQAwDwkAAPsCACALAAD8AgAgDAAA_QIAIBUAALsCACC-AQAA-gIAML8BAAANABDAAQAA-gIAMMEBAQAAAAHCAQEAnwIAIcMBAQAAAAHGAQAAoALGASLJAUAAoQIAIcoBQAChAgAhjgIBAJ8CACGPAgEAnwIAIQIAAAABACAbAACvAwAgAgAAAK0DACAbAACuAwAgC74BAACsAwAwvwEAAK0DABDAAQAArAMAMMEBAQCfAgAhwgEBAJ8CACHDAQEAnwIAIcYBAACgAsYBIskBQAChAgAhygFAAKECACGOAgEAnwIAIY8CAQCfAgAhC74BAACsAwAwvwEAAK0DABDAAQAArAMAMMEBAQCfAgAhwgEBAJ8CACHDAQEAnwIAIcYBAACgAsYBIskBQAChAgAhygFAAKECACGOAgEAnwIAIY8CAQCfAgAhB8EBAQCIAwAhwgEBAIgDACHDAQEAiAMAIcYBAACJA8YBIskBQACKAwAhygFAAIoDACGOAgEAiAMAIQoLAACwAwAgDAAAsQMAIBUAALIDACDBAQEAiAMAIcIBAQCIAwAhwwEBAIgDACHGAQAAiQPGASLJAUAAigMAIcoBQACKAwAhjgIBAIgDACELIgAA5wMAMCMAAOwDADCSAgAA6AMAMJMCAADpAwAwlAIAAOoDACCVAgAA6wMAMJYCAADrAwAwlwIAAOsDADCYAgAA6wMAMJkCAADtAwAwmgIAAO4DADALIgAA2gMAMCMAAN8DADCSAgAA2wMAMJMCAADcAwAwlAIAAN0DACCVAgAA3gMAMJYCAADeAwAwlwIAAN4DADCYAgAA3gMAMJkCAADgAwAwmgIAAOEDADALIgAAswMAMCMAALgDADCSAgAAtAMAMJMCAAC1AwAwlAIAALYDACCVAgAAtwMAMJYCAAC3AwAwlwIAALcDADCYAgAAtwMAMJkCAAC5AwAwmgIAALoDADAQDQAA1wMAIBMAANgDACAUAADZAwAgwQEBAAAAAcQBAQAAAAHGAQAAAIcCAskBQAAAAAHKAUAAAAAB7gEBAAAAAYICAQAAAAGEAgAAAIQCAoUCQAAAAAGHAkAAAAABiAJAAAAAAYkCIAAAAAGKAgEAAAABAgAAABsAICIAANYDACADAAAAGwAgIgAA1gMAICMAAMIDACABGwAAqAUAMBUKAAD1AgAgDQAAzAIAIBMAALwCACAUAAD0AgAgvgEAAPECADC_AQAAGQAQwAEAAPECADDBAQEAAAABxAEBAJ8CACHGAQAA8wKHAiLJAUAAoQIAIcoBQAChAgAh7gEBAJ8CACH6AQEAnwIAIYICAQCfAgAhhAIAAPIChAIihQJAAKECACGHAkAA7wIAIYgCQADvAgAhiQIgALgCACGKAgEAtQIAIQIAAAAbACAbAADCAwAgAgAAALsDACAbAAC8AwAgEb4BAAC6AwAwvwEAALsDABDAAQAAugMAMMEBAQCfAgAhxAEBAJ8CACHGAQAA8wKHAiLJAUAAoQIAIcoBQAChAgAh7gEBAJ8CACH6AQEAnwIAIYICAQCfAgAhhAIAAPIChAIihQJAAKECACGHAkAA7wIAIYgCQADvAgAhiQIgALgCACGKAgEAtQIAIRG-AQAAugMAML8BAAC7AwAQwAEAALoDADDBAQEAnwIAIcQBAQCfAgAhxgEAAPMChwIiyQFAAKECACHKAUAAoQIAIe4BAQCfAgAh-gEBAJ8CACGCAgEAnwIAIYQCAADyAoQCIoUCQAChAgAhhwJAAO8CACGIAkAA7wIAIYkCIAC4AgAhigIBALUCACENwQEBAIgDACHEAQEAiAMAIcYBAAC-A4cCIskBQACKAwAhygFAAIoDACHuAQEAiAMAIYICAQCIAwAhhAIAAL0DhAIihQJAAIoDACGHAkAAvwMAIYgCQAC_AwAhiQIgAMADACGKAgEAwQMAIQGVAgAAAIQCAgGVAgAAAIcCAgGVAkAAAAABAZUCIAAAAAEBlQIBAAAAARANAADDAwAgEwAAxAMAIBQAAMUDACDBAQEAiAMAIcQBAQCIAwAhxgEAAL4DhwIiyQFAAIoDACHKAUAAigMAIe4BAQCIAwAhggIBAIgDACGEAgAAvQOEAiKFAkAAigMAIYcCQAC_AwAhiAJAAL8DACGJAiAAwAMAIYoCAQDBAwAhBSIAAJoFACAjAACmBQAgkgIAAJsFACCTAgAApQUAIJgCAADiAQAgCyIAAMYDADAjAADLAwAwkgIAAMcDADCTAgAAyAMAMJQCAADJAwAglQIAAMoDADCWAgAAygMAMJcCAADKAwAwmAIAAMoDADCZAgAAzAMAMJoCAADNAwAwByIAAJgFACAjAACjBQAgkgIAAJkFACCTAgAAogUAIJYCAAApACCXAgAAKQAgmAIAAOIBACAKEQAA1QMAIMEBAQAAAAHGAQAAAP8BAskBQAAAAAHKAUAAAAAB-wEQAAAAAfwBAQAAAAH9AQEAAAAB_wFAAAAAAYACAQAAAAECAAAAIwAgIgAA1AMAIAMAAAAjACAiAADUAwAgIwAA0gMAIAEbAAChBQAwDxEAAMwCACASAADwAgAgvgEAAOwCADC_AQAAIQAQwAEAAOwCADDBAQEAAAABxgEAAO4C_wEiyQFAAKECACHKAUAAoQIAIfsBEADtAgAh_AEBAJ8CACH9AQEAAAAB_wFAAO8CACGAAgEAnwIAIYECAQCfAgAhAgAAACMAIBsAANIDACACAAAAzgMAIBsAAM8DACANvgEAAM0DADC_AQAAzgMAEMABAADNAwAwwQEBAJ8CACHGAQAA7gL_ASLJAUAAoQIAIcoBQAChAgAh-wEQAO0CACH8AQEAnwIAIf0BAQCfAgAh_wFAAO8CACGAAgEAnwIAIYECAQCfAgAhDb4BAADNAwAwvwEAAM4DABDAAQAAzQMAMMEBAQCfAgAhxgEAAO4C_wEiyQFAAKECACHKAUAAoQIAIfsBEADtAgAh_AEBAJ8CACH9AQEAnwIAIf8BQADvAgAhgAIBAJ8CACGBAgEAnwIAIQnBAQEAiAMAIcYBAADRA_8BIskBQACKAwAhygFAAIoDACH7ARAA0AMAIfwBAQCIAwAh_QEBAIgDACH_AUAAvwMAIYACAQCIAwAhBZUCEAAAAAGbAhAAAAABnAIQAAAAAZ0CEAAAAAGeAhAAAAABAZUCAAAA_wECChEAANMDACDBAQEAiAMAIcYBAADRA_8BIskBQACKAwAhygFAAIoDACH7ARAA0AMAIfwBAQCIAwAh_QEBAIgDACH_AUAAvwMAIYACAQCIAwAhBSIAAJwFACAjAACfBQAgkgIAAJ0FACCTAgAAngUAIJgCAADiAQAgChEAANUDACDBAQEAAAABxgEAAAD_AQLJAUAAAAABygFAAAAAAfsBEAAAAAH8AQEAAAAB_QEBAAAAAf8BQAAAAAGAAgEAAAABAyIAAJwFACCSAgAAnQUAIJgCAADiAQAgEA0AANcDACATAADYAwAgFAAA2QMAIMEBAQAAAAHEAQEAAAABxgEAAACHAgLJAUAAAAABygFAAAAAAe4BAQAAAAGCAgEAAAABhAIAAACEAgKFAkAAAAABhwJAAAAAAYgCQAAAAAGJAiAAAAABigIBAAAAAQMiAACaBQAgkgIAAJsFACCYAgAA4gEAIAQiAADGAwAwkgIAAMcDADCUAgAAyQMAIJgCAADKAwAwAyIAAJgFACCSAgAAmQUAIJgCAADiAQAgCcEBAQAAAAHEAQEAAAABxgEAAAD4AQLJAUAAAAABygFAAAAAAfUBAQAAAAH2AQEAAAAB-AFAAAAAAfkBQAAAAAECAAAAFwAgIgAA5gMAIAMAAAAXACAiAADmAwAgIwAA5QMAIAEbAACXBQAwDgoAAPUCACC-AQAA9gIAML8BAAAVABDAAQAA9gIAMMEBAQAAAAHEAQEAnwIAIcYBAAD3AvgBIskBQAChAgAhygFAAKECACH1AQEAnwIAIfYBAQCfAgAh-AFAAKECACH5AUAAoQIAIfoBAQCfAgAhAgAAABcAIBsAAOUDACACAAAA4gMAIBsAAOMDACANvgEAAOEDADC_AQAA4gMAEMABAADhAwAwwQEBAJ8CACHEAQEAnwIAIcYBAAD3AvgBIskBQAChAgAhygFAAKECACH1AQEAnwIAIfYBAQCfAgAh-AFAAKECACH5AUAAoQIAIfoBAQCfAgAhDb4BAADhAwAwvwEAAOIDABDAAQAA4QMAMMEBAQCfAgAhxAEBAJ8CACHGAQAA9wL4ASLJAUAAoQIAIcoBQAChAgAh9QEBAJ8CACH2AQEAnwIAIfgBQAChAgAh-QFAAKECACH6AQEAnwIAIQnBAQEAiAMAIcQBAQCIAwAhxgEAAOQD-AEiyQFAAIoDACHKAUAAigMAIfUBAQCIAwAh9gEBAIgDACH4AUAAigMAIfkBQACKAwAhAZUCAAAA-AECCcEBAQCIAwAhxAEBAIgDACHGAQAA5AP4ASLJAUAAigMAIcoBQACKAwAh9QEBAIgDACH2AQEAiAMAIfgBQACKAwAh-QFAAIoDACEJwQEBAAAAAcQBAQAAAAHGAQAAAPgBAskBQAAAAAHKAUAAAAAB9QEBAAAAAfYBAQAAAAH4AUAAAAAB-QFAAAAAAQjBAQEAAAABxgEAAACMAgLJAUAAAAABygFAAAAAAfUBAQAAAAH2AQEAAAAB-AFAAAAAAfkBQAAAAAECAAAAEwAgIgAA8wMAIAMAAAATACAiAADzAwAgIwAA8gMAIAEbAACWBQAwDQoAAPUCACC-AQAA-AIAML8BAAARABDAAQAA-AIAMMEBAQAAAAHGAQAA-QKMAiLJAUAAoQIAIcoBQAChAgAh9QEBAJ8CACH2AQEAtQIAIfgBQAChAgAh-QFAAKECACH6AQEAnwIAIQIAAAATACAbAADyAwAgAgAAAO8DACAbAADwAwAgDL4BAADuAwAwvwEAAO8DABDAAQAA7gMAMMEBAQCfAgAhxgEAAPkCjAIiyQFAAKECACHKAUAAoQIAIfUBAQCfAgAh9gEBALUCACH4AUAAoQIAIfkBQAChAgAh-gEBAJ8CACEMvgEAAO4DADC_AQAA7wMAEMABAADuAwAwwQEBAJ8CACHGAQAA-QKMAiLJAUAAoQIAIcoBQAChAgAh9QEBAJ8CACH2AQEAtQIAIfgBQAChAgAh-QFAAKECACH6AQEAnwIAIQjBAQEAiAMAIcYBAADxA4wCIskBQACKAwAhygFAAIoDACH1AQEAiAMAIfYBAQDBAwAh-AFAAIoDACH5AUAAigMAIQGVAgAAAIwCAgjBAQEAiAMAIcYBAADxA4wCIskBQACKAwAhygFAAIoDACH1AQEAiAMAIfYBAQDBAwAh-AFAAIoDACH5AUAAigMAIQjBAQEAAAABxgEAAACMAgLJAUAAAAABygFAAAAAAfUBAQAAAAH2AQEAAAAB-AFAAAAAAfkBQAAAAAEKCwAA9QMAIAwAAPYDACAVAAD3AwAgwQEBAAAAAcIBAQAAAAHDAQEAAAABxgEAAADGAQLJAUAAAAABygFAAAAAAY4CAQAAAAEEIgAA5wMAMJICAADoAwAwlAIAAOoDACCYAgAA6wMAMAQiAADaAwAwkgIAANsDADCUAgAA3QMAIJgCAADeAwAwBCIAALMDADCSAgAAtAMAMJQCAAC2AwAgmAIAALcDADAICAAA-QMAIMEBAQAAAAHCAQEAAAABwwEBAAAAAcYBAAAAxgECyQFAAAAAAcoBQAAAAAGMAgEAAAABBCIAAKUDADCSAgAApgMAMJQCAACoAwAgmAIAAKkDADAJBgAA-wMAIMEBAQAAAAHCAQEAAAABwwEBAAAAAcYBAAAAxgEDyQFAAAAAAcoBQAAAAAHyAQEAAAAB8wEBAAAAAQQiAACZAwAwkgIAAJoDADCUAgAAnAMAIJgCAACdAwAwBCIAAIwDADCSAgAAjQMAMJQCAACPAwAgmAIAAJADADAAAAAAAAGVAgAAAN4BAgGVAgAAAOABAgGVAgAAAOMBAgciAACoBAAgIwAAqwQAIJICAACpBAAgkwIAAKoEACCWAgAAHQAglwIAAB0AIJgCAADKAQAgCyIAAJ8EADAjAACjBAAwkgIAAKAEADCTAgAAoQQAMJQCAACiBAAglQIAALcDADCWAgAAtwMAMJcCAAC3AwAwmAIAALcDADCZAgAApAQAMJoCAAC6AwAwCyIAAJQEADAjAACYBAAwkgIAAJUEADCTAgAAlgQAMJQCAACXBAAglQIAALcDADCWAgAAtwMAMJcCAAC3AwAwmAIAALcDADCZAgAAmQQAMJoCAAC6AwAwCyIAAIkEADAjAACNBAAwkgIAAIoEADCTAgAAiwQAMJQCAACMBAAglQIAAMoDADCWAgAAygMAMJcCAADKAwAwmAIAAMoDADCZAgAAjgQAMJoCAADNAwAwChIAAJMEACDBAQEAAAABxgEAAAD_AQLJAUAAAAABygFAAAAAAfsBEAAAAAH8AQEAAAAB_QEBAAAAAf8BQAAAAAGBAgEAAAABAgAAACMAICIAAJIEACADAAAAIwAgIgAAkgQAICMAAJAEACABGwAAlQUAMAIAAAAjACAbAACQBAAgAgAAAM4DACAbAACPBAAgCcEBAQCIAwAhxgEAANED_wEiyQFAAIoDACHKAUAAigMAIfsBEADQAwAh_AEBAIgDACH9AQEAiAMAIf8BQAC_AwAhgQIBAIgDACEKEgAAkQQAIMEBAQCIAwAhxgEAANED_wEiyQFAAIoDACHKAUAAigMAIfsBEADQAwAh_AEBAIgDACH9AQEAiAMAIf8BQAC_AwAhgQIBAIgDACEFIgAAkAUAICMAAJMFACCSAgAAkQUAIJMCAACSBQAgmAIAABsAIAoSAACTBAAgwQEBAAAAAcYBAAAA_wECyQFAAAAAAcoBQAAAAAH7ARAAAAAB_AEBAAAAAf0BAQAAAAH_AUAAAAABgQIBAAAAAQMiAACQBQAgkgIAAJEFACCYAgAAGwAgEAoAAJ4EACANAADXAwAgEwAA2AMAIMEBAQAAAAHEAQEAAAABxgEAAACHAgLJAUAAAAABygFAAAAAAe4BAQAAAAH6AQEAAAABggIBAAAAAYQCAAAAhAIChQJAAAAAAYcCQAAAAAGIAkAAAAABiQIgAAAAAQIAAAAbACAiAACdBAAgAwAAABsAICIAAJ0EACAjAACbBAAgARsAAI8FADACAAAAGwAgGwAAmwQAIAIAAAC7AwAgGwAAmgQAIA3BAQEAiAMAIcQBAQCIAwAhxgEAAL4DhwIiyQFAAIoDACHKAUAAigMAIe4BAQCIAwAh-gEBAIgDACGCAgEAiAMAIYQCAAC9A4QCIoUCQACKAwAhhwJAAL8DACGIAkAAvwMAIYkCIADAAwAhEAoAAJwEACANAADDAwAgEwAAxAMAIMEBAQCIAwAhxAEBAIgDACHGAQAAvgOHAiLJAUAAigMAIcoBQACKAwAh7gEBAIgDACH6AQEAiAMAIYICAQCIAwAhhAIAAL0DhAIihQJAAIoDACGHAkAAvwMAIYgCQAC_AwAhiQIgAMADACEFIgAAigUAICMAAI0FACCSAgAAiwUAIJMCAACMBQAgmAIAAAEAIBAKAACeBAAgDQAA1wMAIBMAANgDACDBAQEAAAABxAEBAAAAAcYBAAAAhwICyQFAAAAAAcoBQAAAAAHuAQEAAAAB-gEBAAAAAYICAQAAAAGEAgAAAIQCAoUCQAAAAAGHAkAAAAABiAJAAAAAAYkCIAAAAAEDIgAAigUAIJICAACLBQAgmAIAAAEAIBAKAACeBAAgEwAA2AMAIBQAANkDACDBAQEAAAABxAEBAAAAAcYBAAAAhwICyQFAAAAAAcoBQAAAAAH6AQEAAAABggIBAAAAAYQCAAAAhAIChQJAAAAAAYcCQAAAAAGIAkAAAAABiQIgAAAAAYoCAQAAAAECAAAAGwAgIgAApwQAIAMAAAAbACAiAACnBAAgIwAApgQAIAEbAACJBQAwAgAAABsAIBsAAKYEACACAAAAuwMAIBsAAKUEACANwQEBAIgDACHEAQEAiAMAIcYBAAC-A4cCIskBQACKAwAhygFAAIoDACH6AQEAiAMAIYICAQCIAwAhhAIAAL0DhAIihQJAAIoDACGHAkAAvwMAIYgCQAC_AwAhiQIgAMADACGKAgEAwQMAIRAKAACcBAAgEwAAxAMAIBQAAMUDACDBAQEAiAMAIcQBAQCIAwAhxgEAAL4DhwIiyQFAAIoDACHKAUAAigMAIfoBAQCIAwAhggIBAIgDACGEAgAAvQOEAiKFAkAAigMAIYcCQAC_AwAhiAJAAL8DACGJAiAAwAMAIYoCAQDBAwAhEAoAAJ4EACATAADYAwAgFAAA2QMAIMEBAQAAAAHEAQEAAAABxgEAAACHAgLJAUAAAAABygFAAAAAAfoBAQAAAAGCAgEAAAABhAIAAACEAgKFAkAAAAABhwJAAAAAAYgCQAAAAAGJAiAAAAABigIBAAAAAQnBAQEAAAAB5AEAALEEACDlAQIAAAAB5wEAAADnAQLoAQEAAAAB6QEBAAAAAeoBAQAAAAHsAQAAAOwBAu0BAQAAAAECAAAAygEAICIAAKgEACADAAAAHQAgIgAAqAQAICMAAKwEACALAAAAHQAgGwAArAQAIMEBAQCIAwAh5AEAAK0EACDlAQIArgQAIecBAACvBOcBIugBAQDBAwAh6QEBAMEDACHqAQEAwQMAIewBAACwBOwBIu0BAQDBAwAhCcEBAQCIAwAh5AEAAK0EACDlAQIArgQAIecBAACvBOcBIugBAQDBAwAh6QEBAMEDACHqAQEAwQMAIewBAACwBOwBIu0BAQDBAwAhApUCAQAAAASfAgEAAAAFBZUCAgAAAAGbAgIAAAABnAICAAAAAZ0CAgAAAAGeAgIAAAABAZUCAAAA5wECAZUCAAAA7AECAZUCAQAAAAQDIgAAqAQAIJICAACpBAAgmAIAAMoBACAEIgAAnwQAMJICAACgBAAwlAIAAKIEACCYAgAAtwMAMAQiAACUBAAwkgIAAJUEADCUAgAAlwQAIJgCAAC3AwAwBCIAAIkEADCSAgAAigQAMJQCAACMBAAgmAIAAMoDADAFDQAAwAQAIOgBAAD-AwAg6QEAAP4DACDqAQAA_gMAIO0BAAD-AwAgAAAAAAAAAAUiAACEBQAgIwAAhwUAIJICAACFBQAgkwIAAIYFACCYAgAA4gEAIAMiAACEBQAgkgIAAIUFACCYAgAA4gEAIAcOAAC2BAAgDwAAtwQAIBAAALcEACATAAC4BAAg2gEAAP4DACDcAQAA_gMAIOMBAAD-AwAgAAAABSIAAP8EACAjAACCBQAgkgIAAIAFACCTAgAAgQUAIJgCAAD6AQAgAyIAAP8EACCSAgAAgAUAIJgCAAD6AQAgAAAABSIAAPoEACAjAAD9BAAgkgIAAPsEACCTAgAA_AQAIJgCAAABACADIgAA-gQAIJICAAD7BAAgmAIAAAEAIAAAAAAAAAAAAAAABSIAAPUEACAjAAD4BAAgkgIAAPYEACCTAgAA9wQAIJgCAAABACADIgAA9QQAIJICAAD2BAAgmAIAAAEAIAAAAAUiAADwBAAgIwAA8wQAIJICAADxBAAgkwIAAPIEACCYAgAABQAgAyIAAPAEACCSAgAA8QQAIJgCAAAFACAAAAAFIgAA6wQAICMAAO4EACCSAgAA7AQAIJMCAADtBAAgmAIAAAoAIAMiAADrBAAgkgIAAOwEACCYAgAACgAgBwoAAOMEACANAADABAAgEwAAuAQAIBQAAMAEACCHAgAA_gMAIIgCAAD-AwAgigIAAP4DACAECQAA5AQAIAsAAOUEACAMAADmBAAgFQAAtwQAIAIHAADnBAAgCAAA6AQAIAAAAwUAAOkEACAGAADqBAAgxgEAAP4DACAAAQMAAP0DACAACQcAANwEACDBAQEAAAABwgEBAAAAAcMBAQAAAAHGAQAAAMYBAskBQAAAAAHKAUAAAAABjAIBAAAAAY0CAQAAAAECAAAACgAgIgAA6wQAIAMAAAAIACAiAADrBAAgIwAA7wQAIAsAAAAIACAHAADbBAAgGwAA7wQAIMEBAQCIAwAhwgEBAIgDACHDAQEAiAMAIcYBAACJA8YBIskBQACKAwAhygFAAIoDACGMAgEAiAMAIY0CAQCIAwAhCQcAANsEACDBAQEAiAMAIcIBAQCIAwAhwwEBAIgDACHGAQAAiQPGASLJAUAAigMAIcoBQACKAwAhjAIBAIgDACGNAgEAiAMAIQoFAADFBAAgwQEBAAAAAcIBAQAAAAHDAQEAAAABxgEAAADGAQPJAUAAAAABygFAAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAQIAAAAFACAiAADwBAAgAwAAAAMAICIAAPAEACAjAAD0BAAgDAAAAAMAIAUAAMQEACAbAAD0BAAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAJYDxgEjyQFAAIoDACHKAUAAigMAIfIBAQCIAwAh8wEBAIgDACH0AQEAiAMAIQoFAADEBAAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAJYDxgEjyQFAAIoDACHKAUAAigMAIfIBAQCIAwAh8wEBAIgDACH0AQEAiAMAIQsJAADhBAAgDAAA9gMAIBUAAPcDACDBAQEAAAABwgEBAAAAAcMBAQAAAAHGAQAAAMYBAskBQAAAAAHKAUAAAAABjgIBAAAAAY8CAQAAAAECAAAAAQAgIgAA9QQAIAMAAAANACAiAAD1BAAgIwAA-QQAIA0AAAANACAJAADgBAAgDAAAsQMAIBUAALIDACAbAAD5BAAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAIkDxgEiyQFAAIoDACHKAUAAigMAIY4CAQCIAwAhjwIBAIgDACELCQAA4AQAIAwAALEDACAVAACyAwAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAIkDxgEiyQFAAIoDACHKAUAAigMAIY4CAQCIAwAhjwIBAIgDACELCQAA4QQAIAsAAPUDACAVAAD3AwAgwQEBAAAAAcIBAQAAAAHDAQEAAAABxgEAAADGAQLJAUAAAAABygFAAAAAAY4CAQAAAAGPAgEAAAABAgAAAAEAICIAAPoEACADAAAADQAgIgAA-gQAICMAAP4EACANAAAADQAgCQAA4AQAIAsAALADACAVAACyAwAgGwAA_gQAIMEBAQCIAwAhwgEBAIgDACHDAQEAiAMAIcYBAACJA8YBIskBQACKAwAhygFAAIoDACGOAgEAiAMAIY8CAQCIAwAhCwkAAOAEACALAACwAwAgFQAAsgMAIMEBAQCIAwAhwgEBAIgDACHDAQEAiAMAIcYBAACJA8YBIskBQACKAwAhygFAAIoDACGOAgEAiAMAIY8CAQCIAwAhCcEBAQAAAAHCAQEAAAABwwEBAAAAAcQBAQAAAAHGAQAAAMYBAscBAQAAAAHIAQEAAAAByQFAAAAAAcoBQAAAAAECAAAA-gEAICIAAP8EACADAAAA_QEAICIAAP8EACAjAACDBQAgCwAAAP0BACAbAACDBQAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxAEBAIgDACHGAQAAiQPGASLHAQEAiAMAIcgBAQCIAwAhyQFAAIoDACHKAUAAigMAIQnBAQEAiAMAIcIBAQCIAwAhwwEBAIgDACHEAQEAiAMAIcYBAACJA8YBIscBAQCIAwAhyAEBAIgDACHJAUAAigMAIcoBQACKAwAhEA8AALMEACAQAAC0BAAgEwAAtQQAIMEBAQAAAAHCAQEAAAABxgEAAADjAQLJAUAAAAABygFAAAAAAdkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHeAQAAAN4BAuABAAAA4AEC4QEgAAAAAeMBAQAAAAECAAAA4gEAICIAAIQFACADAAAAKQAgIgAAhAUAICMAAIgFACASAAAAKQAgDwAAhgQAIBAAAIcEACATAACIBAAgGwAAiAUAIMEBAQCIAwAhwgEBAIgDACHGAQAAhATjASLJAUAAigMAIcoBQACKAwAh2QEBAIgDACHaAQEAwQMAIdsBAQCIAwAh3AEBAMEDACHeAQAAggTeASLgAQAAgwTgASLhASAAwAMAIeMBAQDBAwAhEA8AAIYEACAQAACHBAAgEwAAiAQAIMEBAQCIAwAhwgEBAIgDACHGAQAAhATjASLJAUAAigMAIcoBQACKAwAh2QEBAIgDACHaAQEAwQMAIdsBAQCIAwAh3AEBAMEDACHeAQAAggTeASLgAQAAgwTgASLhASAAwAMAIeMBAQDBAwAhDcEBAQAAAAHEAQEAAAABxgEAAACHAgLJAUAAAAABygFAAAAAAfoBAQAAAAGCAgEAAAABhAIAAACEAgKFAkAAAAABhwJAAAAAAYgCQAAAAAGJAiAAAAABigIBAAAAAQsJAADhBAAgCwAA9QMAIAwAAPYDACDBAQEAAAABwgEBAAAAAcMBAQAAAAHGAQAAAMYBAskBQAAAAAHKAUAAAAABjgIBAAAAAY8CAQAAAAECAAAAAQAgIgAAigUAIAMAAAANACAiAACKBQAgIwAAjgUAIA0AAAANACAJAADgBAAgCwAAsAMAIAwAALEDACAbAACOBQAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAIkDxgEiyQFAAIoDACHKAUAAigMAIY4CAQCIAwAhjwIBAIgDACELCQAA4AQAIAsAALADACAMAACxAwAgwQEBAIgDACHCAQEAiAMAIcMBAQCIAwAhxgEAAIkDxgEiyQFAAIoDACHKAUAAigMAIY4CAQCIAwAhjwIBAIgDACENwQEBAAAAAcQBAQAAAAHGAQAAAIcCAskBQAAAAAHKAUAAAAAB7gEBAAAAAfoBAQAAAAGCAgEAAAABhAIAAACEAgKFAkAAAAABhwJAAAAAAYgCQAAAAAGJAiAAAAABEQoAAJ4EACANAADXAwAgFAAA2QMAIMEBAQAAAAHEAQEAAAABxgEAAACHAgLJAUAAAAABygFAAAAAAe4BAQAAAAH6AQEAAAABggIBAAAAAYQCAAAAhAIChQJAAAAAAYcCQAAAAAGIAkAAAAABiQIgAAAAAYoCAQAAAAECAAAAGwAgIgAAkAUAIAMAAAAZACAiAACQBQAgIwAAlAUAIBMAAAAZACAKAACcBAAgDQAAwwMAIBQAAMUDACAbAACUBQAgwQEBAIgDACHEAQEAiAMAIcYBAAC-A4cCIskBQACKAwAhygFAAIoDACHuAQEAiAMAIfoBAQCIAwAhggIBAIgDACGEAgAAvQOEAiKFAkAAigMAIYcCQAC_AwAhiAJAAL8DACGJAiAAwAMAIYoCAQDBAwAhEQoAAJwEACANAADDAwAgFAAAxQMAIMEBAQCIAwAhxAEBAIgDACHGAQAAvgOHAiLJAUAAigMAIcoBQACKAwAh7gEBAIgDACH6AQEAiAMAIYICAQCIAwAhhAIAAL0DhAIihQJAAIoDACGHAkAAvwMAIYgCQAC_AwAhiQIgAMADACGKAgEAwQMAIQnBAQEAAAABxgEAAAD_AQLJAUAAAAABygFAAAAAAfsBEAAAAAH8AQEAAAAB_QEBAAAAAf8BQAAAAAGBAgEAAAABCMEBAQAAAAHGAQAAAIwCAskBQAAAAAHKAUAAAAAB9QEBAAAAAfYBAQAAAAH4AUAAAAAB-QFAAAAAAQnBAQEAAAABxAEBAAAAAcYBAAAA-AECyQFAAAAAAcoBQAAAAAH1AQEAAAAB9gEBAAAAAfgBQAAAAAH5AUAAAAABEA4AALIEACAPAACzBAAgEwAAtQQAIMEBAQAAAAHCAQEAAAABxgEAAADjAQLJAUAAAAABygFAAAAAAdkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHeAQAAAN4BAuABAAAA4AEC4QEgAAAAAeMBAQAAAAECAAAA4gEAICIAAJgFACAQDgAAsgQAIBAAALQEACATAAC1BAAgwQEBAAAAAcIBAQAAAAHGAQAAAOMBAskBQAAAAAHKAUAAAAAB2QEBAAAAAdoBAQAAAAHbAQEAAAAB3AEBAAAAAd4BAAAA3gEC4AEAAADgAQLhASAAAAAB4wEBAAAAAQIAAADiAQAgIgAAmgUAIBAOAACyBAAgDwAAswQAIBAAALQEACDBAQEAAAABwgEBAAAAAcYBAAAA4wECyQFAAAAAAcoBQAAAAAHZAQEAAAAB2gEBAAAAAdsBAQAAAAHcAQEAAAAB3gEAAADeAQLgAQAAAOABAuEBIAAAAAHjAQEAAAABAgAAAOIBACAiAACcBQAgAwAAACkAICIAAJwFACAjAACgBQAgEgAAACkAIA4AAIUEACAPAACGBAAgEAAAhwQAIBsAAKAFACDBAQEAiAMAIcIBAQCIAwAhxgEAAIQE4wEiyQFAAIoDACHKAUAAigMAIdkBAQCIAwAh2gEBAMEDACHbAQEAiAMAIdwBAQDBAwAh3gEAAIIE3gEi4AEAAIME4AEi4QEgAMADACHjAQEAwQMAIRAOAACFBAAgDwAAhgQAIBAAAIcEACDBAQEAiAMAIcIBAQCIAwAhxgEAAIQE4wEiyQFAAIoDACHKAUAAigMAIdkBAQCIAwAh2gEBAMEDACHbAQEAiAMAIdwBAQDBAwAh3gEAAIIE3gEi4AEAAIME4AEi4QEgAMADACHjAQEAwQMAIQnBAQEAAAABxgEAAAD_AQLJAUAAAAABygFAAAAAAfsBEAAAAAH8AQEAAAAB_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_tQEDgAG2AQOBAbcBA4IBuAEDgwG6AQOEAbwBEYUBvQE-hgG_AQOHAcEBEYgBwgE_iQHDAQOKAcQBA4sBxQERjAHIAUCNAckBRI4BywEMjwHMAQyQAc4BDJEBzwEMkgHQAQyTAdIBDJQB1AERlQHVAUWWAdcBDJcB2QERmAHaAUaZAdsBDJoB3AEMmwHdARGcAeABR50B4QFNngHjAQufAeQBC6AB5gELoQHnAQuiAegBC6MB6gELpAHsARGlAe0BTqYB7wELpwHxARGoAfIBT6kB8wELqgH0AQurAfUBEawB-AFQrQH5AVSuAfsBBK8B_AEEsAH_AQSxAYACBLIBgQIEswGDAgS0AYUCEbUBhgJVtgGIAgS3AYoCEbgBiwJWuQGMAgS6AY0CBLsBjgIRvAGRAle9AZICWw"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AreaScalarFieldEnum: () => AreaScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  FeederScalarFieldEnum: () => FeederScalarFieldEnum,
  JsonNull: () => JsonNull2,
  LoadSheddingScalarFieldEnum: () => LoadSheddingScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OutageScalarFieldEnum: () => OutageScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PlannedOutageScalarFieldEnum: () => PlannedOutageScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubstationScalarFieldEnum: () => SubstationScalarFieldEnum,
  TechnicianProfileScalarFieldEnum: () => TechnicianProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  ZoneScalarFieldEnum: () => ZoneScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Area: "Area",
  Feeder: "Feeder",
  LoadShedding: "LoadShedding",
  Outage: "Outage",
  Payment: "Payment",
  PlannedOutage: "PlannedOutage",
  Substation: "Substation",
  TechnicianProfile: "TechnicianProfile",
  User: "User",
  Zone: "Zone"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AreaScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  address: "address",
  status: "status",
  feederId: "feederId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var FeederScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  voltageLevel: "voltageLevel",
  status: "status",
  substationId: "substationId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var LoadSheddingScalarFieldEnum = {
  id: "id",
  title: "title",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  reason: "reason",
  areaId: "areaId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OutageScalarFieldEnum = {
  id: "id",
  cause: "cause",
  description: "description",
  priority: "priority",
  reported_At: "reported_At",
  status: "status",
  acknowledgedAt: "acknowledgedAt",
  startedAt: "startedAt",
  isDeleted: "isDeleted",
  userId: "userId",
  technicianId: "technicianId",
  areaId: "areaId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  provider: "provider",
  transactionId: "transactionId",
  status: "status",
  paidAt: "paidAt",
  customerId: "customerId",
  outageReportId: "outageReportId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PlannedOutageScalarFieldEnum = {
  id: "id",
  title: "title",
  reason: "reason",
  description: "description",
  status: "status",
  startTime: "startTime",
  endTime: "endTime",
  areaId: "areaId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubstationScalarFieldEnum = {
  id: "id",
  name: "name",
  capacity: "capacity",
  code: "code",
  location: "location",
  status: "status",
  zoneId: "zoneId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TechnicianProfileScalarFieldEnum = {
  id: "id",
  expertise: "expertise",
  experience: "experience",
  availability: "availability",
  bio: "bio",
  resume: "resume",
  resumePublicId: "resumePublicId",
  technicianvProfileVerificationStatus: "technicianvProfileVerificationStatus",
  rejectionReason: "rejectionReason",
  userId: "userId"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profileImage: "profileImage",
  profileImagePublicId: "profileImagePublicId",
  googleId: "googleId",
  authProvider: "authProvider",
  role: "role",
  emailVerified: "emailVerified",
  status: "status",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ZoneScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  description: "description",
  status: "status",
  zoneImageUrl: "zoneImageUrl",
  zoneImagePublicId: "zoneImagePublicId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BAN: "BAN"
};
var TechnicianStatus = {
  AVAILABLE: "AVAILABLE",
  BUSY: "BUSY",
  UNAVAILABLE: "UNAVAILABLE"
};
var AuthProvider = {
  GOOGLE: "GOOGLE",
  CREDENTIAL: "CREDENTIAL"
};
var TechnicianProfileStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var OutagePriority = {
  HIGH: "HIGH",
  NORMAL: "NORMAL"
};
var OutageStatus = {
  REPORTED: "REPORTED",
  ACKNOWLEDGED: "ACKNOWLEDGED",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  RESTORED: "RESTORED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  tester_admin_name: process.env.TESTER_ADMIN_NAME,
  tester_admin_email: process.env.TESTER_ADMIN_EMAIL,
  tester_admin_password: process.env.TESTER_ADMIN_PASSWORD,
  tester_technician_name: process.env.TESTER_TECHNICIAN_NAME,
  tester_technician_email: process.env.TESTER_TECHNICIAN_EMAIL,
  tester_technician_password: process.env.TESTER_TECHNICIAN_PASSWORD,
  tester_customer_name: process.env.TESTER_CUSTOMER_NAME,
  tester_customer_email: process.env.TESTER_CUSTOMER_EMAIL,
  tester_customer_password: process.env.TESTER_CUSTOMER_PASSWORD,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  smtp_sender: process.env.SMTP_SENDER,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  ssl_commerz_store_id: process.env.SSL_COMMERZ_STORE_ID,
  ssl_commerz_store_pass: process.env.SSL_COMMERZ_STORE_PASSWORD,
  outage_priority_payment_fee: process.env.PRIORITY_RESTORATION_FEE,
  payment_result_redirect_base_url: process.env.PAYMENT_RESULT_REDIRECT_BASE_URL
};

// src/app/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/app/middlewares/globalErrorHandler.ts
var globalErrorHandler = async (err, _req, res, _next) => {
  if (config_default.node_env === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  const errorName = err.name || "Internal Server Error";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.BAD_REQUEST, errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof AppError) {
    errorMessage = err.message;
    statusCode = err.statusCode;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    name: config_default.node_env === "development" ? errorName : "Internal Server Error",
    message: config_default.node_env === "development" ? errorMessage : "Internal Server Error",
    error: config_default.node_env === "development" ? err : void 0,
    stack: config_default.node_env === "development" ? err.stack : void 0
  });
};

// src/app/middlewares/notFound.ts
import httpStatus2 from "http-status";
var notFound = (req, res) => {
  res.status(httpStatus2.NOT_FOUND).json({
    message: "Route not found",
    path: req.originalUrl,
    date: /* @__PURE__ */ new Date()
  });
};

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error, "error in catchAsync.ts");
      next(error);
    }
  };
};

// src/app/modules/auth/auth.controller.ts
import httpStatus4 from "http-status";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/modules/auth/auth.service.ts
import httpStatus3 from "http-status";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// src/app/lib/redis.ts
import { createClient } from "redis";
var redisClient = createClient({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});

// src/app/modules/auth/auth.service.ts
import path3 from "path";
import ejs from "ejs";

// src/app/lib/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/app/lib/googleAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/app/lib/cloudinary.ts
import { v2 as Cloudinary } from "cloudinary";
Cloudinary.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret
});
var cloudinary = Cloudinary;

// src/app/modules/auth/auth.service.ts
var registerUserInDb = async (payload) => {
  const { name, password, role } = payload;
  const email = payload.email.trim().toLowerCase();
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExists) throw new AppError(httpStatus3.CONFLICT, "User already exists with this email");
  const hashedPassword = await bcrypt.hash(password, 10);
  const otpValue = crypto.randomInt(1e5, 1e6).toString();
  const otpKey = `user-registration-otp:${email}`;
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: 10 * 60
      // 10 minutes in seconds
    }
  });
  const userRegisterKey = `user-registration-data:${email}`;
  const redisUserDataPayload = {
    name,
    email,
    password: hashedPassword,
    role
  };
  await redisClient.set(
    userRegisterKey,
    JSON.stringify(redisUserDataPayload),
    {
      expiration: {
        type: "EX",
        value: 10 * 60
      }
    }
  );
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/verify-email.ejs"
  );
  const templateData = {
    name,
    otp: otpValue,
    expirationTime: 10
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.smtp_user,
    to: email,
    subject: "Email verification otp ",
    html
  });
};
var verifyOtpAndCreateUser = async (payload) => {
  const { otp } = payload;
  const email = payload.email.trim().toLowerCase();
  const isUserExist = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExist && isUserExist.emailVerified === true) throw new AppError(httpStatus3.BAD_REQUEST, "User already verified,Please login now");
  if (isUserExist?.status === "BAN") throw new AppError(httpStatus3.FORBIDDEN, "User is banned,Please contact support for more information");
  const otpKey = `user-registration-otp:${email}`;
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) throw new AppError(httpStatus3.BAD_REQUEST, "OTP expired or not found,Please register again");
  if (redisOtp !== otp) throw new AppError(httpStatus3.BAD_REQUEST, "Invalid OTP,Please try again");
  redisClient.del(otpKey);
  const userRegisterKey = `user-registration-data:${email}`;
  const redisUserData = await redisClient.get(userRegisterKey);
  if (!redisUserData) throw new AppError(httpStatus3.BAD_REQUEST, "User data not found,Otp is expired,Please register again");
  const userPayload = JSON.parse(redisUserData);
  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: userPayload.name,
        email: userPayload.email,
        password: userPayload.password,
        role: userPayload.role,
        emailVerified: true
      },
      omit: { password: true }
    });
    if (user.role === Role.TECHNICIAN) {
      await tx.technicianProfile.create({
        data: {
          userId: user.id
        }
      });
    }
    return user;
  });
  await redisClient.del(userRegisterKey);
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/welcome-email.ejs"
  );
  const templateData = {
    name: createdUser.name
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.smtp_user,
    to: email,
    subject: "Welcome to PowerPulse ",
    html
  });
  const jwtPayload = {
    userId: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
    role: createdUser.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3,
    createdUser
  };
};
var loginUser = async (payload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) throw new AppError(httpStatus3.NOT_FOUND, "User havent register yet,register first");
  if (user.status === "BAN") throw new AppError(httpStatus3.BAD_REQUEST, "User is banned");
  const isPasswordMatched = await bcrypt.compare(
    password,
    user?.password
  );
  if (!isPasswordMatched) throw new AppError(httpStatus3.UNAUTHORIZED, "Invalid credentials try again");
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var refreshToken = async (token) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(
      httpStatus3.UNAUTHORIZED,
      config_default.node_env === "development" ? verifiedRefreshToken.error : "Invalid refresh token"
    );
  }
  const data = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });
  if (!user || user.status !== "ACTIVE") {
    throw new AppError(httpStatus3.UNAUTHORIZED, "User is inactive or not found");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var googleLogin = async (payload) => {
  let googleIdTokenPayload = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google login id token failed", error);
    throw new AppError(
      httpStatus3.UNAUTHORIZED,
      "Invalid or expired Google ID token"
    );
  }
  if (!googleIdTokenPayload) {
    throw new AppError(
      httpStatus3.UNAUTHORIZED,
      "Invalid or expired Google ID token"
    );
  }
  if (!googleIdTokenPayload.email) {
    throw new AppError(
      httpStatus3.BAD_REQUEST,
      "Email not found in Google account"
    );
  }
  if (!googleIdTokenPayload.name) {
    throw new AppError(
      httpStatus3.BAD_REQUEST,
      "Name not found in Google account"
    );
  }
  const email = googleIdTokenPayload.email.trim().toLowerCase();
  const googleId = googleIdTokenPayload.sub;
  let user = await prisma.user.findUnique({
    where: {
      googleId
    }
  });
  if (user) {
    if (user.status === UserStatus.BAN) {
      throw new AppError(
        httpStatus3.FORBIDDEN,
        "User is banned"
      );
    }
  }
  if (!user) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existingUser) {
      if (!existingUser.emailVerified) {
        throw new AppError(
          httpStatus3.FORBIDDEN,
          "Email is not verified"
        );
      }
      if (existingUser.status === UserStatus.BAN) {
        throw new AppError(
          httpStatus3.FORBIDDEN,
          "User is banned"
        );
      }
      user = await prisma.user.update({
        where: {
          id: existingUser.id
        },
        data: {
          googleId
        }
      });
    }
  }
  if (!user) {
    if (!payload.role) {
      throw new AppError(
        httpStatus3.BAD_REQUEST,
        "Role is required for new Google registration"
      );
    }
    if (payload.role !== Role.CUSTOMER && payload.role !== Role.TECHNICIAN) {
      throw new AppError(
        httpStatus3.BAD_REQUEST,
        "Invalid registration role"
      );
    }
    user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email,
          profileImage: googleIdTokenPayload.picture,
          role: payload.role,
          googleId,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true
        }
      });
      if (createdUser.role === Role.TECHNICIAN) {
        await tx.technicianProfile.create({
          data: {
            userId: createdUser.id
          }
        });
      }
      return createdUser;
    });
  }
  if (!user) {
    throw new AppError(
      httpStatus3.NOT_FOUND,
      "User not found"
    );
  }
  if (user.status === UserStatus.BAN) {
    throw new AppError(
      httpStatus3.FORBIDDEN,
      "User is banned"
    );
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      technicianProfile: true
    },
    omit: {
      password: true
    }
  });
  if (!isUserExists) {
    throw new AppError(httpStatus3.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var updateUserProfileInDb = async (payload, profileImage, userId) => {
  let profileImageUrl = null;
  let profileImagePublicId = null;
  if (profileImage) {
    const uploadResult = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image"
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            if (!result) {
              return reject(
                new AppError(
                  httpStatus3.INTERNAL_SERVER_ERROR,
                  "No result returned from Cloudinary"
                )
              );
            }
            resolve(result);
          }
        ).end(profileImage.buffer);
      }
    );
    profileImageUrl = uploadResult.secure_url;
    profileImagePublicId = uploadResult.public_id;
  }
  if (!payload.name) throw new AppError(httpStatus3.BAD_REQUEST, "Name is required");
  const updateData = {
    name: payload.name
  };
  if (profileImage) {
    updateData.profileImage = profileImageUrl;
    updateData.profileImagePublicId = profileImagePublicId;
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: updateData,
    omit: {
      password: true
    }
  });
  return updatedUser;
};
var authServices = {
  registerUserInDb,
  verifyOtpAndCreateUser,
  loginUser,
  refreshToken,
  googleLogin,
  getMe,
  updateUserProfileInDb
};

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/app/modules/auth/auth.controller.ts
var registerUser = catchAsync(async (req, res) => {
  const payload = req.body;
  await authServices.registerUserInDb(payload);
  sendResponse(res, {
    statusCode: httpStatus4.CREATED,
    success: true,
    message: "Registration successfull otp send to verify email now verify it",
    data: null
  });
});
var verifyUserEmail = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authServices.verifyOtpAndCreateUser(payload);
  const { accessToken, refreshToken: refreshToken3, createdUser } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus4.CREATED,
    success: true,
    message: "User registered successfully",
    data: { accessToken, refreshToken: refreshToken3, createdUser }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const { accessToken, refreshToken: refreshToken3 } = await authServices.loginUser(payload);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus4.CREATED,
    success: true,
    message: "User Login successfull",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  if (!req.cookies.refreshToken) {
    throw new AppError(httpStatus4.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await authServices.refreshToken(req.cookies.refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var googleLoginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authServices.googleLogin(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "Google Login successfull",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus4.UNAUTHORIZED,
      "User information is missing in the request"
    );
  }
  const result = await authServices.getMe(user);
  sendResponse(res, {
    statusCode: httpStatus4.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var updateUserProfile = catchAsync(async (req, res) => {
  const profileImageFile = req.file;
  const payload = JSON.parse(req.body.data);
  const userId = req.user?.userId;
  const result = await authServices.updateUserProfileInDb(
    payload,
    profileImageFile ?? null,
    userId
  );
  sendResponse(res, {
    statusCode: httpStatus4.CREATED,
    success: true,
    message: "User profile updated successfully",
    data: result
  });
});
var authController = {
  registerUser,
  verifyUserEmail,
  loginUser: loginUser2,
  refreshToken: refreshToken2,
  googleLoginUser,
  getMe: getMe2,
  updateUserProfile
};

// src/app/middlewares/checkAuth.ts
import httpStatus5 from "http-status";
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus5.UNAUTHORIZED,
        "You are not logged in. Please log in to access this resource."
      );
    }
    console.log("AUTH MIDDLEWARE IS HITTED OVER HERE");
    const verifiedToken = jwtUtils.verifyToken(token, config_default.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new AppError(httpStatus5.UNAUTHORIZED, verifiedToken.error);
    }
    const { email, name, userId, role } = verifiedToken.data;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus5.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource."
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        email,
        name,
        role
      }
    });
    if (!user) {
      throw new AppError(httpStatus5.UNAUTHORIZED, "User not found. Please log in again.");
    }
    if (user.status === "BAN") {
      throw new AppError(
        httpStatus5.FORBIDDEN,
        "Your account has been Banned. Please contact support."
      );
    }
    req.user = {
      email,
      name,
      userId,
      role
    };
    next();
  });
};

// src/app/middlewares/validateRequest.ts
import httpStatus6 from "http-status";
var validateRequest = (zodSchema) => {
  return catchAsync((req, res, next) => {
    const payload = req.body ?? {};
    console.log(payload, "this is payload in validate resuques");
    const result = zodSchema.safeParse(payload);
    if (!result.success) {
      console.log(result.error);
      console.log(result.error.issues);
      throw new AppError(httpStatus6.BAD_REQUEST, result.error.issues[0].message);
    }
    req.body = result.data;
    next();
  });
};

// src/app/modules/auth/auth.validation.ts
import z from "zod";
var registerUserValidationZodSchema = z.object({
  name: z.string("Not a string").min(5, "Name must be at least 5 char").max(50, "Name can not have more that 50 character"),
  email: z.email("Invalid email address,Try again"),
  password: z.string("Password should be a string"),
  role: z.enum(["CUSTOMER", "TECHNICIAN", "ADMIN"])
});
var loginSchema = z.object({
  email: z.email("Invalid email address,Try again"),
  password: z.string("Password should be a string")
});
var userValidation = {
  registerUserValidationZodSchema,
  loginSchema
};

// src/app/lib/multer.ts
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ storage, limits: {
  fileSize: 5 * 1024 * 1024
  // 5 MB
} });

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validateRequest(userValidation.registerUserValidationZodSchema), authController.registerUser);
router.post("/verify-email", authController.verifyUserEmail);
router.post("/login", validateRequest(userValidation.loginSchema), authController.loginUser);
router.post("/refresh-token", authController.refreshToken);
router.post("/google-login", authController.googleLoginUser);
router.patch("/update-profile", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), upload.single("profileImage"), authController.updateUserProfile);
router.get("/get-me", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), authController.getMe);
var AuthRoutes = router;

// src/app/modules/technicianProfile/technician-profile.route.ts
import { Router as Router2 } from "express";

// src/app/modules/technicianProfile/technician-profile.controller.ts
import httpStatus8 from "http-status";

// src/app/modules/technicianProfile/technician-profile.validation.ts
import z2 from "zod";
var technicianProfileZodSchema = z2.object({
  expertise: z2.array(z2.string().min(5, "Expertise must be at least 5 characters")).min(1, "At least one expertise is required"),
  experience: z2.coerce.number().int().min(0, "Experience cannot be negative").default(0),
  bio: z2.string("Bio should be string").min(10, "minimum 10 char required").max(200, "Bio should not be more that 200 char"),
  resumeUrl: z2.url().optional()
});

// src/app/modules/technicianProfile/technician-profile.service.ts
import httpStatus7 from "http-status";
var updateTechnicicanProfileInDb = async (payload, resume, technicianUserId) => {
  const resumeUploadResult = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto"
        },
        async (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new AppError(
                httpStatus7.INTERNAL_SERVER_ERROR,
                "No result returned from Cloudinary"
              )
            );
          }
          resolve(result);
        }
      ).end(resume?.buffer);
    }
  );
  const updatedTechnicianProfile = await prisma.technicianProfile.update({
    where: {
      userId: technicianUserId
    },
    data: {
      expertise: payload.expertise,
      experience: payload.experience,
      bio: payload.bio,
      resume: resumeUploadResult.secure_url,
      resumePublicId: resumeUploadResult.public_id
    },
    include: {
      user: {
        omit: {
          password: true
        }
      }
    }
  });
  return updatedTechnicianProfile;
};
var technicianProfileApprovalInDb = async (payload) => {
  const techProfile = await prisma.technicianProfile.findUnique({
    where: {
      id: payload.technicianId
    }
  });
  if (!techProfile) {
    throw new AppError(httpStatus7.NOT_FOUND, "Technican profile is not exist");
  }
  if (payload.status === TechnicianProfileStatus.REJECTED && techProfile.technicianvProfileVerificationStatus === TechnicianProfileStatus.APPROVED) {
    throw new AppError(httpStatus7.BAD_REQUEST, `Technican profile is approved cant reject it again`);
  }
  if (payload.status === TechnicianProfileStatus.PENDING && (techProfile.technicianvProfileVerificationStatus === TechnicianProfileStatus.APPROVED || techProfile.technicianvProfileVerificationStatus === TechnicianProfileStatus.REJECTED)) {
    throw new AppError(httpStatus7.BAD_REQUEST, `Technican profile is approved OR REJECTED CANT MAKE IT PENDING`);
  }
  if (techProfile.technicianvProfileVerificationStatus === payload.status) {
    throw new AppError(httpStatus7.CONFLICT, `Technican profile is already ${payload.status}`);
  }
  const updatedResult = await prisma.technicianProfile.update({
    where: {
      id: payload.technicianId
    },
    data: {
      technicianvProfileVerificationStatus: payload.status
    }
  });
  return updatedResult;
};
var TechnicianProfileService = {
  updateTechnicicanProfileInDb,
  technicianProfileApprovalInDb
};

// src/app/modules/technicianProfile/technician-profile.controller.ts
var updateTechnicianProfile = catchAsync(async (req, res) => {
  const resume = req.file;
  if (!resume) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      "Resume is required"
    );
  }
  const zodValidationResult = technicianProfileZodSchema.safeParse(
    JSON.parse(req.body.data)
  );
  if (!zodValidationResult.success) {
    throw new AppError(httpStatus8.BAD_REQUEST, zodValidationResult.error.issues[0].message);
  }
  const payload = zodValidationResult.data;
  const technicianUserId = req.user?.userId;
  console.log(resume, "thisis the files in controller", payload, technicianUserId);
  const result = await TechnicianProfileService.updateTechnicicanProfileInDb(payload, resume, technicianUserId);
  sendResponse(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "Technicain profile is updated successfully",
    data: result
  });
});
var profileApproval = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await TechnicianProfileService.technicianProfileApprovalInDb(payload);
  sendResponse(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "Technicain profile approval status updated successfully",
    data: result
  });
});
var TechnicianProfileController = {
  updateTechnicianProfile,
  profileApproval
};

// src/app/modules/technicianProfile/technician-profile.route.ts
var router2 = Router2();
router2.patch("/", auth(Role.TECHNICIAN), upload.single("resume"), TechnicianProfileController.updateTechnicianProfile);
router2.patch("/update-status", auth(Role.ADMIN), TechnicianProfileController.profileApproval);
var TechnicianRoutes = router2;

// src/app/modules/distributionInfrastructure/zone/zone.route.ts
import { Router as Router3 } from "express";

// src/app/modules/distributionInfrastructure/zone/zone.controller.ts
import httpStatus10 from "http-status";

// src/app/modules/distributionInfrastructure/zone/zone.service.ts
import httpStatus9 from "http-status";
var createZoneInDb = async (payload, zoneImageFile) => {
  const existingZoneCode = await prisma.zone.findUnique({
    where: {
      code: payload.code
    }
  });
  if (existingZoneCode) {
    throw new AppError(
      httpStatus9.CONFLICT,
      "Zone code already exists"
    );
  }
  const { name, code, description, status } = payload;
  const zoneImageUploadResult = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image"
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new AppError(
                httpStatus9.INTERNAL_SERVER_ERROR,
                "No result returned from Cloudinary"
              )
            );
          }
          resolve(result);
        }
      ).end(zoneImageFile.buffer);
    }
  );
  const zoneResult = await prisma.zone.create({
    data: {
      name,
      code,
      description,
      status,
      zoneImageUrl: zoneImageUploadResult.secure_url,
      zoneImagePublicId: zoneImageUploadResult.public_id
    },
    include: {
      substations: true
    }
  });
  return zoneResult;
};
var getAllZoneFromDb = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { code: { contains: query.searchTerm, mode: "insensitive" } },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.code) {
    andConditions.push({
      code: { equals: query.code, mode: "insensitive" }
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  const allZones = await prisma.zone.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      substations: true
    }
  });
  const totalZoneCount = await prisma.zone.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allZones,
    meta: {
      page,
      limit,
      total: totalZoneCount,
      totalPages: Math.ceil(totalZoneCount / limit)
    }
  };
};
var getZoneDetails = async (zoneId) => {
  const zoneDetails = await prisma.zone.findUnique({
    where: {
      id: zoneId
    },
    include: {
      substations: true
    }
  });
  return zoneDetails;
};
var updateZoneInDb = async (zoneId, payload, zoneImageFile) => {
  const existingZone = await prisma.zone.findUnique({
    where: { id: zoneId }
  });
  if (!existingZone) {
    throw new AppError(httpStatus9.NOT_FOUND, "Zone not found");
  }
  if (payload.code && payload.code !== existingZone.code) {
    const zoneWithSameCode = await prisma.zone.findUnique({
      where: { code: payload.code }
    });
    if (zoneWithSameCode) {
      throw new AppError(httpStatus9.CONFLICT, "Zone code already exists");
    }
  }
  const data = { ...payload };
  if (zoneImageFile) {
    const zoneImageUploadResult = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            if (!result) {
              return reject(
                new AppError(
                  httpStatus9.INTERNAL_SERVER_ERROR,
                  "No result returned from Cloudinary"
                )
              );
            }
            resolve(result);
          }
        ).end(zoneImageFile.buffer);
      }
    );
    data.zoneImageUrl = zoneImageUploadResult.secure_url;
    data.zoneImagePublicId = zoneImageUploadResult.public_id;
  }
  return prisma.zone.update({
    where: { id: zoneId },
    data,
    include: { substations: true }
  });
};
var ZoneService = {
  createZoneInDb,
  getAllZoneFromDb,
  getZoneDetails,
  updateZoneInDb
};

// src/app/modules/distributionInfrastructure/zone/zone.validation.ts
import z3 from "zod";
var createZoneZodSchema = z3.object({
  name: z3.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars"),
  code: z3.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars"),
  description: z3.string("Not a string").min(5, "Description should minimum have 5 char").max(150, "Max 150 chars"),
  status: z3.enum(["ACTIVE", "INACTIVE"])
});
var updateZoneZodSchema = createZoneZodSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  "At least one zone field is required for update"
);

// src/app/modules/distributionInfrastructure/zone/zone.controller.ts
var createZone = catchAsync(async (req, res) => {
  const zoneImageFile = req.file;
  const zodValidationResult = createZoneZodSchema.safeParse(JSON.parse(req.body.data));
  if (!zodValidationResult.success) {
    throw new AppError(httpStatus10.BAD_REQUEST, zodValidationResult.error.issues[0].message);
  }
  const payload = zodValidationResult.data;
  if (!zoneImageFile) throw new AppError(httpStatus10.BAD_REQUEST, "Zone image is required please add a image");
  const result = await ZoneService.createZoneInDb(payload, zoneImageFile);
  sendResponse(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "Zone created successfully",
    data: result
  });
});
var getAllZone = catchAsync(async (req, res) => {
  const { data, meta } = await ZoneService.getAllZoneFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "All Zone Retrieved Successfully",
    data,
    meta
  });
});
var getZoneDetails2 = catchAsync(async (req, res) => {
  const zoneId = req.params.zoneId;
  const result = await ZoneService.getZoneDetails(zoneId);
  sendResponse(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: " Zone Details Successfully",
    data: result
  });
});
var updateZone = catchAsync(async (req, res) => {
  const zoneId = req.params.zoneId;
  const zoneImageFile = req.file;
  const zodValidationResult = updateZoneZodSchema.safeParse(
    JSON.parse(req.body.data)
  );
  if (!zodValidationResult.success) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      zodValidationResult.error.issues[0].message
    );
  }
  const result = await ZoneService.updateZoneInDb(
    zoneId,
    zodValidationResult.data,
    zoneImageFile
  );
  sendResponse(res, {
    statusCode: httpStatus10.OK,
    success: true,
    message: "Zone updated successfully",
    data: result
  });
});
var ZoneController = {
  createZone,
  getAllZone,
  getZoneDetails: getZoneDetails2,
  updateZone
};

// src/app/modules/distributionInfrastructure/zone/zone.route.ts
var router3 = Router3();
router3.post("/", auth(Role.ADMIN), upload.single("zoneImage"), ZoneController.createZone);
router3.patch("/:zoneId", auth(Role.ADMIN), upload.single("zoneImage"), ZoneController.updateZone);
router3.get("/", ZoneController.getAllZone);
router3.get("/:zoneId", ZoneController.getZoneDetails);
var ZoneRoutes = router3;

// src/app/modules/distributionInfrastructure/substation/substation.route.ts
import { Router as Router4 } from "express";

// src/app/modules/distributionInfrastructure/substation/substation.validation.ts
import z4 from "zod";
var createSubstationZodSchema = z4.object({
  name: z4.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars"),
  code: z4.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars"),
  capacity: z4.string("Not a string").min(5, "capacity should minimum have 5 char").max(50, "Max 150 chars"),
  location: z4.string("Not a string").min(5, "Location should minimum have 5 char").max(60, "Max 60 chars"),
  zoneId: z4.string("Not a string")
});
var updateSubstationZodSchema = z4.object({
  name: z4.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars").optional(),
  code: z4.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars").optional(),
  capacity: z4.string("Not a string").min(5, "capacity should minimum have 5 char").max(50, "Max 50 chars").optional(),
  location: z4.string("Not a string").min(5, "Location should minimum have 5 char").max(60, "Max 60 chars").optional(),
  zoneId: z4.string("Not a string").min(1, "Zone ID is required").optional(),
  status: z4.enum(["ACTIVE", "INACTIVE"]).optional()
}).refine((payload) => Object.keys(payload).length > 0, {
  message: "At least one substation field is required for update"
});
var substationValidation = {
  createSubstationZodSchema,
  updateSubstationZodSchema
};

// src/app/modules/distributionInfrastructure/substation/substation.service.ts
import httpStatus11 from "http-status";
var createSubstation = async (payload) => {
  const { name, code, capacity, location, zoneId } = payload;
  const createdSubstationResult = await prisma.substation.create({
    data: {
      name,
      capacity,
      code,
      location,
      zoneId
    },
    include: {
      zone: true,
      feeders: true
    }
  });
  return createdSubstationResult;
};
var getAllSubstationFromDb = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { code: { contains: query.searchTerm, mode: "insensitive" } },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  const allSubstation = await prisma.substation.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      zone: true,
      feeders: true
    }
  });
  const totalZoneCount = await prisma.substation.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allSubstation,
    meta: {
      page,
      limit,
      total: totalZoneCount,
      totalPages: Math.ceil(totalZoneCount / limit)
    }
  };
};
var getSubstationDetails = async (substationId) => {
  const substationDetails = await prisma.substation.findUnique({
    where: {
      id: substationId
    },
    include: {
      feeders: true,
      zone: true
    }
  });
  return substationDetails;
};
var updateSubstation = async (substationId, payload) => {
  const existingSubstation = await prisma.substation.findUnique({
    where: { id: substationId }
  });
  if (!existingSubstation) {
    throw new AppError(httpStatus11.NOT_FOUND, "Substation not found");
  }
  if (payload.code && payload.code !== existingSubstation.code) {
    const substationWithSameCode = await prisma.substation.findUnique({
      where: { code: payload.code }
    });
    if (substationWithSameCode) {
      throw new AppError(httpStatus11.CONFLICT, "Substation code already exists");
    }
  }
  if (payload.zoneId && payload.zoneId !== existingSubstation.zoneId) {
    const zone = await prisma.zone.findUnique({
      where: { id: payload.zoneId }
    });
    if (!zone) {
      throw new AppError(httpStatus11.NOT_FOUND, "Zone not found");
    }
  }
  return prisma.substation.update({
    where: { id: substationId },
    data: payload,
    include: {
      zone: true,
      feeders: true
    }
  });
};
var SubstationService = {
  createSubstation,
  getAllSubstationFromDb,
  getSubstationDetails,
  updateSubstation
};

// src/app/modules/distributionInfrastructure/substation/substation.controller.ts
import httpStatus12 from "http-status";
var createSubstation2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await SubstationService.createSubstation(payload);
  sendResponse(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: "Substation created successfully",
    data: result
  });
});
var getAllSubstation = catchAsync(async (req, res) => {
  const { data, meta } = await SubstationService.getAllSubstationFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: "All Substation Retrieved Successfully",
    data,
    meta
  });
});
var getSubstationDetails2 = catchAsync(async (req, res) => {
  const substationId = req.params.substationId;
  const result = await SubstationService.getSubstationDetails(substationId);
  sendResponse(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: " Zone Details Successfully",
    data: result
  });
});
var updateSubstation2 = catchAsync(async (req, res) => {
  const substationId = req.params.substationId;
  const result = await SubstationService.updateSubstation(
    substationId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus12.OK,
    success: true,
    message: "Substation updated successfully",
    data: result
  });
});
var SubstationController = {
  createSubstation: createSubstation2,
  getAllSubstation,
  getSubstationDetails: getSubstationDetails2,
  updateSubstation: updateSubstation2
};

// src/app/modules/distributionInfrastructure/substation/substation.route.ts
var router4 = Router4();
router4.post("/", auth(Role.ADMIN), validateRequest(substationValidation.createSubstationZodSchema), SubstationController.createSubstation);
router4.patch("/:substationId", auth(Role.ADMIN), validateRequest(substationValidation.updateSubstationZodSchema), SubstationController.updateSubstation);
router4.get("/", SubstationController.getAllSubstation);
router4.get("/:substationId", SubstationController.getSubstationDetails);
var SubstationRoutes = router4;

// src/app/modules/distributionInfrastructure/feeder/feeder.route.ts
import { Router as Router5 } from "express";

// src/app/modules/distributionInfrastructure/feeder/feeder.validation.ts
import z5 from "zod";
var createFeederZodSchema = z5.object({
  name: z5.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars"),
  code: z5.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars"),
  voltageLevel: z5.string("Not a string").min(5, "capacity should minimum have 5 char").max(50, "Max 150 chars"),
  substationId: z5.string("Not a string")
});
var updateFeederZodSchema = z5.object({
  name: z5.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars").optional(),
  code: z5.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars").optional(),
  voltageLevel: z5.string("Not a string").min(5, "Voltage level should minimum have 5 chars").max(50, "Max 50 chars").optional(),
  substationId: z5.string("Not a string").min(1, "Substation ID is required").optional(),
  status: z5.enum(["ACTIVE", "INACTIVE"]).optional()
});
var feederValidation = {
  createFeederZodSchema,
  updateFeederZodSchema
};

// src/app/modules/distributionInfrastructure/feeder/feeder.controller.ts
import httpStatus14 from "http-status";

// src/app/modules/distributionInfrastructure/feeder/feeder.service.ts
import httpStatus13 from "http-status";
var createFeederInDb = async (payload) => {
  const { name, code, voltageLevel, substationId } = payload;
  const createdSubstationResult = await prisma.feeder.create({
    data: {
      name,
      voltageLevel,
      code,
      substationId
    },
    include: {
      substation: true,
      areas: true
    }
  });
  return createdSubstationResult;
};
var getAllFeederFromDb = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { code: { contains: query.searchTerm, mode: "insensitive" } },
        {
          voltageLevel: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  const allFeeders = await prisma.feeder.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      areas: true,
      substation: true,
      zone: true
    }
  });
  const totalFeederCount = await prisma.feeder.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allFeeders,
    meta: {
      page,
      limit,
      total: totalFeederCount,
      totalPages: Math.ceil(totalFeederCount / limit)
    }
  };
};
var getFeederDetails = async (feederId) => {
  const substationDetails = await prisma.feeder.findUnique({
    where: {
      id: feederId
    },
    include: {
      areas: true,
      substation: true,
      zone: true
    }
  });
  return substationDetails;
};
var updateFeeder = async (feederId, payload) => {
  const existingFeeder = await prisma.feeder.findUnique({
    where: { id: feederId }
  });
  if (!existingFeeder) {
    throw new AppError(httpStatus13.NOT_FOUND, "Feeder not found");
  }
  if (payload.code && payload.code !== existingFeeder.code) {
    const feederWithSameCode = await prisma.feeder.findUnique({
      where: { code: payload.code }
    });
    if (feederWithSameCode) {
      throw new AppError(httpStatus13.CONFLICT, "Feeder code already exists");
    }
  }
  if (payload.substationId && payload.substationId !== existingFeeder.substationId) {
    const substation = await prisma.substation.findUnique({
      where: { id: payload.substationId }
    });
    if (!substation) {
      throw new AppError(httpStatus13.NOT_FOUND, "Substation not found");
    }
  }
  return prisma.feeder.update({
    where: { id: feederId },
    data: payload,
    include: {
      substation: true,
      areas: true
    }
  });
};
var FeederService = {
  createFeederInDb,
  getAllFeederFromDb,
  getFeederDetails,
  updateFeeder
};

// src/app/modules/distributionInfrastructure/feeder/feeder.controller.ts
var createFeeder = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await FeederService.createFeederInDb(payload);
  sendResponse(res, {
    statusCode: httpStatus14.OK,
    success: true,
    message: "Feeder created successfully",
    data: result
  });
});
var getAllFeeder = catchAsync(async (req, res) => {
  const { data, meta } = await FeederService.getAllFeederFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus14.OK,
    success: true,
    message: "All Feeder Retrieved Successfully",
    data,
    meta
  });
});
var getFeederDetails2 = catchAsync(async (req, res) => {
  const feederId = req.params.feederId;
  const result = await FeederService.getFeederDetails(feederId);
  sendResponse(res, {
    statusCode: httpStatus14.OK,
    success: true,
    message: " Feeder Details Retrieved Successfully",
    data: result
  });
});
var updateFeeder2 = catchAsync(async (req, res) => {
  const feederId = req.params.feederId;
  const result = await FeederService.updateFeeder(feederId, req.body);
  sendResponse(res, {
    statusCode: httpStatus14.OK,
    success: true,
    message: "Feeder updated successfully",
    data: result
  });
});
var FeederController = {
  createFeeder,
  getAllFeeder,
  getFeederDetails: getFeederDetails2,
  updateFeeder: updateFeeder2
};

// src/app/modules/distributionInfrastructure/feeder/feeder.route.ts
var router5 = Router5();
router5.post("/", auth(Role.ADMIN), validateRequest(feederValidation.createFeederZodSchema), FeederController.createFeeder);
router5.patch("/:feederId", auth(Role.ADMIN), validateRequest(feederValidation.updateFeederZodSchema), FeederController.updateFeeder);
router5.get("/", FeederController.getAllFeeder);
router5.get("/:feederId", FeederController.getFeederDetails);
var FeederRoutes = router5;

// src/app/modules/distributionInfrastructure/area/area.route.ts
import { Router as Router6 } from "express";

// src/app/modules/distributionInfrastructure/area/area.validation.ts
import z6 from "zod";
var createAreaZodSchema = z6.object({
  name: z6.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars"),
  code: z6.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars"),
  address: z6.string("Not a string").min(5, " address should minimum have 5 char").max(300, "Max 300 chars"),
  feederId: z6.string("Not a string")
});
var updateAreaZodSchema = z6.object({
  name: z6.string("Name is not a string").min(5, "Name should minimum have 5 char").max(100, "Name should not be more than 100 chars").optional(),
  code: z6.string("Not a string").min(5, "Code should minimum have 5 char").max(10, "Max 10 chars").optional(),
  address: z6.string("Not a string").min(5, "Address should minimum have 5 char").max(300, "Max 300 chars").optional(),
  feederId: z6.string("Not a string").min(1, "Feeder ID is required").optional(),
  status: z6.enum(["ACTIVE", "INACTIVE"]).optional()
});
var areaValidation = {
  createAreaZodSchema,
  updateAreaZodSchema
};

// src/app/modules/distributionInfrastructure/area/area.controller.ts
import httpStatus16 from "http-status";

// src/app/modules/distributionInfrastructure/area/area.service.ts
import httpStatus15 from "http-status";
var createAreaInDb = async (payload) => {
  const { name, code, address, feederId } = payload;
  const createdAreaResult = await prisma.area.create({
    data: {
      name,
      address,
      code,
      feederId
    }
  });
  return createdAreaResult;
};
var getAllAreaFromDb = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { code: { contains: query.searchTerm, mode: "insensitive" } },
        {
          address: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  const allAreas = await prisma.area.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      feeder: true,
      substation: true,
      zone: true
    }
  });
  const totalAreaCount = await prisma.area.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allAreas,
    meta: {
      page,
      limit,
      total: totalAreaCount,
      totalPages: Math.ceil(totalAreaCount / limit)
    }
  };
};
var getAreaDetails = async (areaId) => {
  const areaDetails = await prisma.area.findUnique({
    where: {
      id: areaId
    },
    include: {
      feeder: true,
      substation: true,
      zone: true
    }
  });
  return areaDetails;
};
var updateArea = async (areaId, payload) => {
  const existingArea = await prisma.area.findUnique({
    where: { id: areaId }
  });
  if (!existingArea) {
    throw new AppError(httpStatus15.NOT_FOUND, "Area not found");
  }
  if (payload.code && payload.code !== existingArea.code) {
    const areaWithSameCode = await prisma.area.findUnique({
      where: { code: payload.code }
    });
    if (areaWithSameCode) {
      throw new AppError(httpStatus15.CONFLICT, "Area code already exists");
    }
  }
  if (payload.feederId && payload.feederId !== existingArea.feederId) {
    const feeder = await prisma.feeder.findUnique({
      where: { id: payload.feederId }
    });
    if (!feeder) {
      throw new AppError(httpStatus15.NOT_FOUND, "Feeder not found");
    }
  }
  return prisma.area.update({
    where: { id: areaId },
    data: payload,
    include: {
      feeder: true
    }
  });
};
var AreaService = {
  createAreaInDb,
  getAllAreaFromDb,
  getAreaDetails,
  updateArea
};

// src/app/modules/distributionInfrastructure/area/area.controller.ts
var createArea = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AreaService.createAreaInDb(payload);
  sendResponse(res, {
    statusCode: httpStatus16.OK,
    success: true,
    message: "Area created successfully",
    data: result
  });
});
var getAllArea = catchAsync(async (req, res) => {
  const { data, meta } = await AreaService.getAllAreaFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus16.OK,
    success: true,
    message: "All Area Retrieved Successfully",
    data,
    meta
  });
});
var getAreaDetails2 = catchAsync(async (req, res) => {
  const areaId = req.params.areaId;
  const result = await AreaService.getAreaDetails(areaId);
  sendResponse(res, {
    statusCode: httpStatus16.OK,
    success: true,
    message: " Area Details Retrieved Successfully",
    data: result
  });
});
var updateArea2 = catchAsync(async (req, res) => {
  const areaId = req.params.areaId;
  const result = await AreaService.updateArea(areaId, req.body);
  sendResponse(res, {
    statusCode: httpStatus16.OK,
    success: true,
    message: "Area updated successfully",
    data: result
  });
});
var AreaController = {
  createArea,
  getAllArea,
  getAreaDetails: getAreaDetails2,
  updateArea: updateArea2
};

// src/app/modules/distributionInfrastructure/area/area.route.ts
var router6 = Router6();
router6.post("/", auth(Role.ADMIN), validateRequest(areaValidation.createAreaZodSchema), AreaController.createArea);
router6.patch("/:areaId", auth(Role.ADMIN), validateRequest(areaValidation.updateAreaZodSchema), AreaController.updateArea);
router6.get("/", AreaController.getAllArea);
router6.get("/:areaId", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), AreaController.getAreaDetails);
var AreaRoutes = router6;

// src/app/modules/outage/outage.route.ts
import { Router as Router7 } from "express";

// src/app/modules/outage/outage.controller.ts
import httpStatus18 from "http-status";

// src/app/modules/outage/outage.service.ts
import httpStatus17 from "http-status";
var createOutageInDb = async (payload, userId) => {
  const { cause, description, areaId } = payload;
  const outageCreatedResult = await prisma.outage.create({
    data: {
      cause,
      description,
      userId,
      areaId
    }
  });
  return outageCreatedResult;
};
var getAllOutageFromDb = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  andConditions.push({
    isDeleted: false
  });
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { cause: { contains: query.searchTerm, mode: "insensitive" } },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  const allOutages = await prisma.outage.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      techician: true,
      user: true
    }
  });
  const totalOutagesCount = await prisma.outage.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allOutages,
    meta: {
      page,
      limit,
      total: totalOutagesCount,
      totalPages: Math.ceil(totalOutagesCount / limit)
    }
  };
};
var getCurrentUserAddedAllOutagesFromDb = async (userId) => {
  const currentUserOutages = await prisma.outage.findMany({
    where: {
      userId,
      isDeleted: false
    },
    include: {
      techician: true,
      user: true
    }
  });
  return currentUserOutages;
};
var getOutageDetailsFromDb = async (outageId, userId) => {
  const outage = await prisma.outage.findUnique({
    where: { id: outageId },
    include: {
      area: true,
      techician: true,
      user: true
    }
  });
  if (!outage || outage.isDeleted) {
    throw new AppError(httpStatus17.NOT_FOUND, "Outage not found");
  }
  return outage;
};
var updateOutageInDb = async (outageId, userId, payload) => {
  const outage = await prisma.outage.findUnique({
    where: { id: outageId },
    select: { userId: true, isDeleted: true }
  });
  if (!outage || outage.isDeleted) {
    throw new AppError(httpStatus17.NOT_FOUND, "Outage not found");
  }
  if (outage.userId !== userId) {
    throw new AppError(httpStatus17.FORBIDDEN, "You are not allowed to update this outage");
  }
  return prisma.outage.update({
    where: { id: outageId },
    data: payload
  });
};
var assignTechnician = async (outageId, technicianId) => {
  const ifOutageExist = await prisma.outage.findUnique({
    where: {
      id: outageId
    }
  });
  if (!ifOutageExist) {
    throw new AppError(httpStatus17.NOT_FOUND, "Outage not found");
  }
  if (ifOutageExist.isDeleted) {
    throw new AppError(httpStatus17.NOT_FOUND, "Outage is deleted");
  }
  if (ifOutageExist.status === OutageStatus.RESTORED || ifOutageExist.status === OutageStatus.CANCELLED) {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "Technician cannot be assigned to a restored or cancelled outage"
    );
  }
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId
    },
    include: {
      technicianProfile: true
    }
  });
  if (!technician) {
    throw new AppError(httpStatus17.NOT_FOUND, "Technician not found");
  }
  if (technician.role !== Role.TECHNICIAN) {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "Selected user is not a technician"
    );
  }
  if (technician.status === UserStatus.BAN) {
    throw new AppError(httpStatus17.FORBIDDEN, "This technician is banned");
  }
  if (!technician.technicianProfile) {
    throw new AppError(httpStatus17.BAD_REQUEST, "Technician profile not found");
  }
  if (technician.technicianProfile.technicianvProfileVerificationStatus !== TechnicianProfileStatus.APPROVED) {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "Technician profile is not approved"
    );
  }
  if (technician.technicianProfile.availability !== TechnicianStatus.AVAILABLE) {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "Technician is currently unavailable"
    );
  }
  if (ifOutageExist.technicianId === technicianId) {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "This technician is already assigned to the outage"
    );
  }
  const transactionResult = await prisma.$transaction(async (tx) => {
    const updatedResult = await tx.outage.update({
      where: {
        id: outageId
      },
      data: {
        technicianId,
        status: OutageStatus.ASSIGNED
      }
    });
    await tx.technicianProfile.update({
      where: {
        userId: technicianId
      },
      data: {
        availability: TechnicianStatus.BUSY
      }
    });
    return updatedResult;
  });
  return transactionResult;
};
var updateOutageStatusInDb = async (outageId, status, userId, userRole) => {
  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId
    },
    select: {
      id: true,
      status: true,
      technicianId: true,
      isDeleted: true
    }
  });
  if (!outage) {
    throw new AppError(httpStatus17.NOT_FOUND, "Outage not found");
  }
  if (outage.isDeleted) {
    throw new AppError(httpStatus17.NOT_FOUND, "Outage is deleted");
  }
  if (outage.status === status) {
    throw new AppError(httpStatus17.BAD_REQUEST, `Outage is already ${status}`);
  }
  if (status === OutageStatus.ACKNOWLEDGED) {
    if (userRole !== Role.ADMIN) {
      throw new AppError(
        httpStatus17.FORBIDDEN,
        "Only admin can acknowledge an outage"
      );
    }
    if (outage.status !== OutageStatus.REPORTED) {
      throw new AppError(
        httpStatus17.BAD_REQUEST,
        "Only a reported outage can be acknowledged"
      );
    }
    const updatedOutage = await prisma.outage.update({
      where: {
        id: outageId
      },
      data: {
        status: OutageStatus.ACKNOWLEDGED,
        acknowledgedAt: /* @__PURE__ */ new Date()
      }
    });
    return updatedOutage;
  }
  if (status === OutageStatus.IN_PROGRESS) {
    if (userRole !== Role.TECHNICIAN) {
      throw new AppError(
        httpStatus17.FORBIDDEN,
        "Only technician can start outage work"
      );
    }
    if (outage.status !== OutageStatus.ASSIGNED) {
      throw new AppError(
        httpStatus17.BAD_REQUEST,
        "Only an assigned outage can be moved to in progress"
      );
    }
    if (outage.technicianId !== userId) {
      throw new AppError(
        httpStatus17.FORBIDDEN,
        "You are not assigned to this outage"
      );
    }
    const updatedOutage = await prisma.outage.update({
      where: {
        id: outageId
      },
      data: {
        status: OutageStatus.IN_PROGRESS,
        startedAt: /* @__PURE__ */ new Date()
      }
    });
    return updatedOutage;
  }
  if (status === OutageStatus.RESTORED) {
    if (userRole !== Role.TECHNICIAN) {
      throw new AppError(
        httpStatus17.FORBIDDEN,
        "Only technician can restore an outage"
      );
    }
    if (outage.status !== OutageStatus.IN_PROGRESS) {
      throw new AppError(
        httpStatus17.BAD_REQUEST,
        "Only an in-progress outage can be restored"
      );
    }
    if (outage.technicianId !== userId) {
      throw new AppError(
        httpStatus17.FORBIDDEN,
        "You are not assigned to this outage"
      );
    }
    const transactionResult = await prisma.$transaction(async (tx) => {
      const updatedOutage = await tx.outage.update({
        where: {
          id: outageId
        },
        data: {
          status: OutageStatus.RESTORED,
          restoredAt: /* @__PURE__ */ new Date()
        }
      });
      await tx.technicianProfile.update({
        where: {
          userId
        },
        data: {
          availability: TechnicianStatus.AVAILABLE
        }
      });
      return updatedOutage;
    });
    return transactionResult;
  }
  throw new AppError(
    httpStatus17.BAD_REQUEST,
    `Invalid outage status transition to ${status}`
  );
};
var deleteOutageFromDb = async (outageId, requestedUserId) => {
  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId
    }
  });
  if (!outage) {
    throw new AppError(httpStatus17.NOT_FOUND, "Outage not found");
  }
  if (outage.userId !== requestedUserId) {
    throw new AppError(
      httpStatus17.FORBIDDEN,
      "You are not allowed to delete this outage"
    );
  }
  if (outage.isDeleted) {
    throw new AppError(httpStatus17.BAD_REQUEST, "Outage is already deleted");
  }
  const deletedOutage = await prisma.outage.update({
    where: {
      id: outageId
    },
    data: {
      isDeleted: true
    }
  });
  return deletedOutage;
};
var OutageService = {
  createOutageInDb,
  getAllOutageFromDb,
  getCurrentUserAddedAllOutagesFromDb,
  getOutageDetailsFromDb,
  updateOutageInDb,
  assignTechnician,
  updateOutageStatusInDb,
  deleteOutageFromDb
};

// src/app/modules/outage/outage.controller.ts
var createOutage = catchAsync(async (req, res) => {
  const payload = req.body;
  const userId = req.user?.userId;
  const result = await OutageService.createOutageInDb(payload, userId);
  sendResponse(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "Unexpected Outage created successfully",
    data: result
  });
});
var getAllOutageForAdminManage = catchAsync(async (req, res) => {
  const { data, meta } = await OutageService.getAllOutageFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "All Outages Retrieved Successfully",
    data,
    meta
  });
});
var getCurrentUserAddedOutages = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await OutageService.getCurrentUserAddedAllOutagesFromDb(userId);
  sendResponse(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "All Outages Retrieved Successfully",
    data: result
  });
});
var getOutageDetails = catchAsync(async (req, res) => {
  const result = await OutageService.getOutageDetailsFromDb(
    req.params.outageId,
    req.user?.userId
  );
  sendResponse(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "Outage details retrieved successfully",
    data: result
  });
});
var updateOutage = catchAsync(async (req, res) => {
  const result = await OutageService.updateOutageInDb(
    req.params.outageId,
    req.user?.userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "Outage updated successfully",
    data: result
  });
});
var assignTechnicianToReportedOutage = catchAsync(
  async (req, res) => {
    const { outageId } = req.params;
    const { technicianId } = req.body;
    const result = await OutageService.assignTechnician(
      outageId,
      technicianId
    );
    sendResponse(res, {
      statusCode: httpStatus18.OK,
      success: true,
      message: "Technician assigned successfully",
      data: result
    });
  }
);
var updateOutageStatus = catchAsync(
  async (req, res) => {
    const { outageId } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const result = await OutageService.updateOutageStatusInDb(
      outageId,
      status,
      userId,
      userRole
    );
    sendResponse(res, {
      statusCode: httpStatus18.OK,
      success: true,
      message: "Outage status updated successfully",
      data: result
    });
  }
);
var deleteOutage = catchAsync(
  async (req, res) => {
    const outageId = req.params.outageId;
    const requestedUserId = req.user?.userId;
    const result = await OutageService.deleteOutageFromDb(outageId, requestedUserId);
    sendResponse(res, {
      statusCode: httpStatus18.OK,
      success: true,
      message: "Outage status updated successfully",
      data: result
    });
  }
);
var OutageController = {
  createOutage,
  getAllOutageForAdminManage,
  getCurrentUserAddedOutages,
  getOutageDetails,
  updateOutage,
  assignTechnicianToReportedOutage,
  updateOutageStatus,
  deleteOutage
};

// src/app/modules/outage/outage.validation.ts
import z7 from "zod";
var createOutageZodSchema = z7.object({
  cause: z7.string("cause Cause is not a string").min(5, "Cause should minimum have 5 char").max(50, "Cause should not be more than 50 chars"),
  description: z7.string("description description Not a string").min(5, "description should minimum have 5 char").max(400, "Max 400 chars"),
  areaId: z7.string("Not a string areaId")
});
var updateOutageZodSchema = z7.object({
  cause: z7.string("cause Cause is not a string").min(5, "Cause should minimum have 5 char").max(50, "Cause should not be more than 50 chars").optional(),
  description: z7.string("description description Not a string").min(5, "description should minimum have 5 char").max(400, "Max 400 chars").optional(),
  areaId: z7.string("Not a string areaId").optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one outage field is required"
});
var outageValidation = {
  createOutageZodSchema,
  updateOutageZodSchema
};

// src/app/modules/outage/outage.route.ts
var router7 = Router7();
router7.post("/", auth(Role.CUSTOMER), validateRequest(outageValidation.createOutageZodSchema), OutageController.createOutage);
router7.get("/", auth(Role.ADMIN), OutageController.getAllOutageForAdminManage);
router7.get("/my-outage", auth(Role.CUSTOMER), OutageController.getCurrentUserAddedOutages);
router7.get("/:outageId", auth(Role.ADMIN, Role.CUSTOMER), OutageController.getOutageDetails);
router7.patch("/:outageId", auth(Role.CUSTOMER), validateRequest(outageValidation.updateOutageZodSchema), OutageController.updateOutage);
router7.patch("/:outageId/assign-technician", auth(Role.ADMIN), OutageController.assignTechnicianToReportedOutage);
router7.patch(
  "/:outageId/status",
  auth(Role.ADMIN, Role.TECHNICIAN),
  OutageController.updateOutageStatus
);
router7.delete("/:outageId", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), OutageController.deleteOutage);
var OutageRoutes = router7;

// src/app/modules/loadshedding/load-shedding.route.ts
import { Router as Router8 } from "express";

// src/app/modules/loadshedding/load-shedding.validation.ts
import z8 from "zod";
var createLoadSheddingZodSchema = z8.object({
  title: z8.string("Title is not a string").min(3, "Title should minimum have 3 chars").max(150, "Title should not be more than 150 chars"),
  startTime: z8.coerce.date("Start time must be a valid date"),
  endTime: z8.coerce.date("End time must be a valid date"),
  status: z8.enum(["ONGOING", "SCHEDULED", "CANCELLED", "COMPLETED"]).optional(),
  reason: z8.string("Reason is not a string").min(5, "Reason should minimum have 5 chars").max(400, "Reason should not be more than 400 chars").optional(),
  areaId: z8.string("Area ID is not a string").min(1, "Area ID is required")
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be later than start time",
  path: ["endTime"]
});
var updateLoadSheddingZodSchema = z8.object({
  title: z8.string("Title is not a string").min(3, "Title should minimum have 3 chars").max(150, "Title should not be more than 150 chars").optional(),
  startTime: z8.coerce.date("Start time must be a valid date").optional(),
  endTime: z8.coerce.date("End time must be a valid date").optional(),
  reason: z8.string("Reason is not a string").min(5, "Reason should minimum have 5 chars").max(400, "Reason should not be more than 400 chars").optional()
}).refine(
  (data) => data.startTime === void 0 || data.endTime === void 0 || data.endTime > data.startTime,
  {
    message: "End time must be later than start time",
    path: ["endTime"]
  }
);
var loadSheddingValidation = {
  createLoadSheddingZodSchema,
  updateLoadSheddingZodSchema
};

// src/app/modules/loadshedding/load-shedding.service.ts
import httpStatus19 from "http-status";
var createLoadSheddingScheduleInDb = async (payload) => {
  const { title, startTime, endTime, reason, areaId } = payload;
  if (startTime >= endTime) {
    throw new AppError(
      httpStatus19.BAD_REQUEST,
      "Start time must be before end time"
    );
  }
  if (startTime < /* @__PURE__ */ new Date()) {
    throw new AppError(
      httpStatus19.BAD_REQUEST,
      "Load shedding schedule cannot start in the past"
    );
  }
  const area = await prisma.area.findUnique({
    where: {
      id: areaId
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!area) {
    throw new AppError(
      httpStatus19.NOT_FOUND,
      "Area not found"
    );
  }
  if (area.status !== "ACTIVE") {
    throw new AppError(
      httpStatus19.BAD_REQUEST,
      "Cannot create load shedding schedule for an inactive area"
    );
  }
  const conflictingSchedule = await prisma.loadShedding.findFirst({
    where: {
      areaId,
      // Ignore cancelled schedules
      status: {
        not: "CANCELLED"
      },
      startTime: {
        lt: endTime
      },
      endTime: {
        gt: startTime
      }
    }
  });
  if (conflictingSchedule) {
    throw new AppError(
      httpStatus19.CONFLICT,
      "A load shedding schedule already exists for this area during the selected time"
    );
  }
  const createdSchedule = await prisma.loadShedding.create({
    data: {
      title,
      startTime,
      endTime,
      reason,
      areaId
    }
  });
  return createdSchedule;
};
var getAllLoadSheddingSchdeule = async (query) => {
  console.log(query, "query load sheddign schedule");
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: query.searchTerm, mode: "insensitive" } },
        {
          reason: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  const allLoadsheddingSchdeule = await prisma.loadShedding.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      area: true
    }
  });
  const totalLoadSheddingCount = await prisma.loadShedding.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allLoadsheddingSchdeule,
    meta: {
      page,
      limit,
      total: totalLoadSheddingCount,
      totalPages: Math.ceil(totalLoadSheddingCount / limit)
    }
  };
};
var getLoadSheddingDetails = async (loadsheddingId) => {
  const getDetails = await prisma.loadShedding.findUniqueOrThrow({
    where: {
      id: loadsheddingId
    },
    include: {
      area: true
    }
  });
  return getDetails;
};
var updateSchedule = async (payload, loadSheddingId) => {
  const existingSchedule = await prisma.loadShedding.findUnique({
    where: {
      id: loadSheddingId
    }
  });
  if (!existingSchedule) {
    throw new AppError(
      httpStatus19.NOT_FOUND,
      "Load shedding schedule not found"
    );
  }
  const finalStartTime = payload.startTime ?? existingSchedule.startTime;
  const finalEndTime = payload.endTime ?? existingSchedule.endTime;
  if (finalStartTime >= finalEndTime) {
    throw new AppError(
      httpStatus19.BAD_REQUEST,
      "Start time must be before end time"
    );
  }
  if (payload.startTime && finalStartTime < /* @__PURE__ */ new Date()) {
    throw new AppError(
      httpStatus19.BAD_REQUEST,
      "Load shedding schedule cannot start in the past"
    );
  }
  const area = await prisma.area.findUnique({
    where: {
      id: existingSchedule.areaId
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!area) {
    throw new AppError(
      httpStatus19.NOT_FOUND,
      "Area not found"
    );
  }
  if (area.status !== "ACTIVE") {
    throw new AppError(
      httpStatus19.BAD_REQUEST,
      "Cannot update schedule for an inactive area"
    );
  }
  const conflictingSchedule = await prisma.loadShedding.findFirst({
    where: {
      areaId: existingSchedule.areaId,
      id: {
        not: loadSheddingId
      },
      status: {
        not: "CANCELLED"
      },
      startTime: {
        lt: finalEndTime
      },
      endTime: {
        gt: finalStartTime
      }
    }
  });
  if (conflictingSchedule) {
    throw new AppError(
      httpStatus19.CONFLICT,
      "Another load shedding schedule already exists during the selected time"
    );
  }
  const updateData = {};
  if (payload.title !== void 0) {
    updateData.title = payload.title;
  }
  if (payload.startTime !== void 0) {
    updateData.startTime = payload.startTime;
  }
  if (payload.endTime !== void 0) {
    updateData.endTime = payload.endTime;
  }
  if (payload.reason !== void 0) {
    updateData.reason = payload.reason;
  }
  const updatedSchedule = await prisma.loadShedding.update({
    where: {
      id: loadSheddingId
    },
    data: updateData
  });
  return updatedSchedule;
};
var LoadSheddingService = {
  createLoadSheddingScheduleInDb,
  getAllLoadSheddingSchdeule,
  getLoadSheddingDetails,
  updateSchedule
};

// src/app/modules/loadshedding/load-shedding.controller.ts
import httpStatus20 from "http-status";
var createLoadShedding = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await LoadSheddingService.createLoadSheddingScheduleInDb(payload);
  sendResponse(res, {
    statusCode: httpStatus20.OK,
    success: true,
    message: "LoadShedding schedule created successfully",
    data: result
  });
});
var getAllLoadShedding = catchAsync(async (req, res) => {
  console.log(req.query, "LOAD SHEDING CONTROLLER HITTED");
  const result = await LoadSheddingService.getAllLoadSheddingSchdeule(req.query);
  sendResponse(res, {
    statusCode: httpStatus20.OK,
    success: true,
    message: "All LoadShedding schedule Retrived successfully",
    data: result
  });
});
var getLoadSheddingDetails2 = catchAsync(async (req, res) => {
  const loadsheddingId = req.params.loadsheddingId;
  const result = await LoadSheddingService.getLoadSheddingDetails(loadsheddingId);
  sendResponse(res, {
    statusCode: httpStatus20.OK,
    success: true,
    message: " Load shedding Details Retrived Successfully",
    data: result
  });
});
var updateLoadSheddingSchedule = catchAsync(async (req, res) => {
  const loadsheddingId = req.params.loadsheddingId;
  const payload = req.body;
  const result = await LoadSheddingService.updateSchedule(payload, loadsheddingId);
  sendResponse(res, {
    statusCode: httpStatus20.OK,
    success: true,
    message: " Loadshedding Details Successfully",
    data: result
  });
});
var LoadSheddingController = {
  createLoadShedding,
  getAllLoadShedding,
  getLoadSheddingDetails: getLoadSheddingDetails2,
  updateLoadSheddingSchedule
};

// src/app/modules/loadshedding/load-shedding.route.ts
var router8 = Router8();
router8.post("/", auth(Role.ADMIN), validateRequest(loadSheddingValidation.createLoadSheddingZodSchema), LoadSheddingController.createLoadShedding);
router8.get("/", LoadSheddingController.getAllLoadShedding);
router8.get("/:loadsheddingId", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), LoadSheddingController.getLoadSheddingDetails);
router8.patch("/:loadsheddingId", auth(Role.ADMIN), validateRequest(loadSheddingValidation.updateLoadSheddingZodSchema), LoadSheddingController.updateLoadSheddingSchedule);
var LoadSheddingRoutes = router8;

// src/app/modules/payment/payment.route.ts
import { Router as Router9 } from "express";

// src/app/modules/payment/payment.controller.ts
import httpsStatus from "http-status";

// src/app/modules/payment/payment.service.ts
import axios from "axios";
import httpStatus21 from "http-status";
var createPaymentInDb = async (outageReportId, customerId) => {
  const transId = `TRX_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const customer = await prisma.user.findUniqueOrThrow({
    where: {
      id: customerId,
      role: Role.CUSTOMER
    }
  });
  const outageReport = await prisma.outage.findUniqueOrThrow({
    where: {
      id: outageReportId
    },
    include: {
      user: true
    }
  });
  if (outageReport.userId !== customer.id)
    throw {
      statusCode: httpStatus21.FORBIDDEN,
      name: "Forbidden",
      message: "You are not allowed to pay for this Outage since this is not you added.Pay for your own"
    };
  const existingPayment = await prisma.payment.findFirst({
    where: {
      outageReportId,
      customerId,
      status: PaymentStatus.COMPLETED
    }
  });
  if (existingPayment)
    throw {
      statusCode: httpStatus21.CONFLICT,
      name: "Conflict error",
      message: "You already paid for this outage report Wait for admin tech further step."
    };
  const paymentData = {
    store_id: config_default.ssl_commerz_store_id,
    store_passwd: config_default.ssl_commerz_store_pass,
    total_amount: config_default.outage_priority_payment_fee,
    currency: "BDT",
    tran_id: transId,
    success_url: `${config_default.app_url}/api/v1/payment/confirm?outageReportId=${outageReportId}&tranId=${transId}&status=success`,
    fail_url: `${config_default.app_url}/api/v1/payment/confirm?outageReportId=${outageReportId}&tranId=${transId}&status=fail`,
    cancel_url: `${config_default.app_url}/api/v1/payment/confirm?outageReportId=${outageReportId}&tranId=${transId}&status=cancel`,
    cus_name: `${customer.name}`,
    cus_email: customer.email,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: 1e3,
    cus_country: "Bangladesh",
    // cus_phone: "01711111111",
    cus_fax: "01711111111"
  };
  const res = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    paymentData,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );
  const data = res.data;
  await prisma.payment.create({
    data: {
      transactionId: transId,
      provider: "SSL_Commerz",
      amount: config_default.outage_priority_payment_fee,
      customerId,
      outageReportId
    }
  });
  return { paymentGatewayUrl: data.GatewayPageURL };
};
var verifySslCommerzPayment = async (transId, status, val_id) => {
  const response = await axios.post(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${config_default.ssl_commerz_store_id}&store_passwd=${config_default.ssl_commerz_store_pass}&format=json
`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );
  const paymentData = response.data;
  if (paymentData.status === "VALID") {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUniqueOrThrow({
        where: {
          transactionId: transId
        },
        include: {
          customer: true,
          outage: true
        }
      });
      await tx.payment.update({
        where: {
          transactionId: transId
        },
        data: {
          status: PaymentStatus.COMPLETED,
          paidAt: /* @__PURE__ */ new Date()
        }
      });
      await tx.outage.update({
        where: {
          id: payment.outageReportId
        },
        data: {
          priority: OutagePriority.HIGH
        }
      });
    });
  } else if (paymentData.status === "FAILED" || paymentData.status === "INVALID_TRANSACTION") {
    await prisma.payment.update({
      where: {
        transactionId: transId
      },
      data: {
        status: PaymentStatus.FAILED
      }
    });
  }
  return status;
};
var paymentHistoryFromDb = async (customerId) => {
  const result = await prisma.payment.findMany({
    where: {
      customerId
    },
    include: {
      customer: {
        omit: {
          password: true
        }
      },
      outage: true
    }
  });
  console.log(result, "this is result paymentHistoryFromDb");
  return result;
};
var paymentDetailsFromDb = async (paymentId, customerId) => {
  const result = await prisma.payment.findUniqueOrThrow({
    where: {
      id: paymentId,
      customerId
    },
    include: {
      customer: {
        omit: {
          password: true
        }
      },
      outage: true
    }
  });
  return result;
};
var paymentServices = {
  createPaymentInDb,
  verifySslCommerzPayment,
  paymentHistoryFromDb,
  paymentDetailsFromDb
};

// src/app/modules/payment/payment.controller.ts
var createPayment = catchAsync(
  async (req, res, next) => {
    const outageReportId = req.body.outageReportId;
    const customerId = req.user?.userId;
    const result = await paymentServices.createPaymentInDb(
      outageReportId,
      customerId
    );
    sendResponse(res, {
      statusCode: httpsStatus.CREATED,
      success: true,
      message: "Payment is  created for reported outage",
      data: result
    });
  }
);
var verifySslCommerzPayment2 = catchAsync(
  async (req, res, next) => {
    const { tranId, status } = req.query;
    const val_id = req.body.val_id;
    await paymentServices.verifySslCommerzPayment(
      tranId,
      status,
      val_id
    );
    if (status === "success") {
      return res.redirect(`${config_default.payment_result_redirect_base_url}/success.html`);
    }
    if (status === "fail") {
      return res.redirect(`${config_default.payment_result_redirect_base_url}/failed.html`);
    }
    return res.redirect(`${config_default.payment_result_redirect_base_url}/cancel.html`);
  }
);
var getCustomersPaymentHistory = catchAsync(
  async (req, res, next) => {
    const customerId = req.user?.userId;
    const result = await paymentServices.paymentHistoryFromDb(
      customerId
    );
    sendResponse(res, {
      statusCode: httpsStatus.OK,
      success: true,
      message: "Your all payment history is retrived successfully",
      data: result
    });
  }
);
var getPaymentDetails = catchAsync(
  async (req, res, next) => {
    const paymentId = req.params?.paymentId;
    const customerId = req.user?.userId;
    const result = await paymentServices.paymentDetailsFromDb(
      paymentId,
      customerId
    );
    sendResponse(res, {
      statusCode: httpsStatus.OK,
      success: true,
      message: "Your payment details is retrived successfully",
      data: result
    });
  }
);
var paymentController = {
  createPayment,
  verifySslCommerzPayment: verifySslCommerzPayment2,
  getCustomersPaymentHistory,
  getPaymentDetails
};

// src/app/modules/payment/payment.route.ts
var router9 = Router9();
router9.post("/create", auth(Role.CUSTOMER), paymentController.createPayment);
router9.post("/confirm", paymentController.verifySslCommerzPayment);
router9.get("/", auth(Role.CUSTOMER), paymentController.getCustomersPaymentHistory);
router9.get("/:paymentId", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getPaymentDetails);
var PaymentRoutes = router9;

// src/app/modules/planned-outage/planned-outage.route.ts
import { Router as Router10 } from "express";

// src/app/modules/planned-outage/planned-outage.validation.ts
import z9 from "zod";
var plannedOutageStatus = z9.enum([
  "SCHEDULED",
  "ONGOING",
  "CANCELLED",
  "COMPLETED"
]);
var createPlannedOutageZodSchema = z9.object({
  title: z9.string("Title is not a string").trim().min(3, "Title should minimum have 3 chars").max(150, "Title should not be more than 150 chars"),
  reason: z9.string("Reason is not a string").trim().min(3, "Reason should minimum have 3 chars").max(400, "Reason should not be more than 400 chars"),
  description: z9.string("Description is not a string").trim().min(5, "Description should minimum have 5 chars").max(1e3, "Description should not be more than 1000 chars"),
  status: plannedOutageStatus.optional(),
  startTime: z9.coerce.date("Start time must be a valid date"),
  endTime: z9.coerce.date("End time must be a valid date"),
  areaId: z9.string("Area ID is not a string").trim().min(1, "Area ID is required")
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be later than start time",
  path: ["endTime"]
});
var updatePlannedOutageZodSchema = z9.object({
  title: z9.string("Title is not a string").trim().min(3, "Title should minimum have 3 chars").max(150, "Title should not be more than 150 chars").optional(),
  reason: z9.string("Reason is not a string").trim().min(3, "Reason should minimum have 3 chars").max(400, "Reason should not be more than 400 chars").optional(),
  description: z9.string("Description is not a string").trim().min(5, "Description should minimum have 5 chars").max(1e3, "Description should not be more than 1000 chars").optional(),
  status: plannedOutageStatus.optional(),
  startTime: z9.coerce.date("Start time must be a valid date").optional(),
  endTime: z9.coerce.date("End time must be a valid date").optional(),
  areaId: z9.string("Area ID is not a string").trim().min(1, "Area ID is required").optional()
}).refine(
  (data) => data.startTime === void 0 || data.endTime === void 0 || data.endTime > data.startTime,
  {
    message: "End time must be later than start time",
    path: ["endTime"]
  }
);
var plannedOutageValidation = {
  createPlannedOutageZodSchema,
  updatePlannedOutageZodSchema
};

// src/app/modules/planned-outage/planned-outage.controller.ts
import httpStatus23 from "http-status";

// src/app/modules/planned-outage/planned-outage.service.ts
import httpStatus22 from "http-status";
var createPlannedOutageInDb = async (payload) => {
  const { title, areaId, description, endTime, reason, startTime } = payload;
  if (startTime >= endTime) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Start time must be before end time"
    );
  }
  if (startTime < /* @__PURE__ */ new Date()) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Load shedding schedule cannot start in the past"
    );
  }
  const area = await prisma.area.findUnique({
    where: {
      id: areaId
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!area) {
    throw new AppError(httpStatus22.NOT_FOUND, "Area not found");
  }
  if (area.status !== "ACTIVE") {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Cannot create load shedding schedule for an inactive area"
    );
  }
  const plannedOutageConflict = await prisma.plannedOutage.findFirst({
    where: {
      areaId,
      // Ignore all cancelled schedules
      status: {
        not: "CANCELLED"
      },
      startTime: {
        lt: endTime
      },
      endTime: {
        gt: startTime
      }
    }
  });
  if (plannedOutageConflict) {
    throw new AppError(
      httpStatus22.CONFLICT,
      "A Planned Outage schedule already exists for this area during the selected time"
    );
  }
  const createdSchedule = await prisma.plannedOutage.create({
    data: {
      title,
      startTime,
      endTime,
      description,
      reason,
      areaId
    }
  });
  return createdSchedule;
};
var getAllPlannedOutage = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: query.searchTerm, mode: "insensitive" } },
        {
          reason: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  const allPlannedOutageSchedule = await prisma.plannedOutage.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      area: true
    }
  });
  const totalPlannedOutageCount = await prisma.plannedOutage.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allPlannedOutageSchedule,
    meta: {
      page,
      limit,
      total: totalPlannedOutageCount,
      totalPages: Math.ceil(totalPlannedOutageCount / limit)
    }
  };
};
var plannedOutageDetails = async (plannedOutageId) => {
  const getDetails = await prisma.plannedOutage.findUniqueOrThrow({
    where: {
      id: plannedOutageId
    },
    include: {
      area: true
    }
  });
  return getDetails;
};
var updatePlannedOutage = async (payload, planeedOutageId) => {
  const existingSchedule = await prisma.plannedOutage.findUnique({
    where: {
      id: planeedOutageId
    }
  });
  if (!existingSchedule) {
    throw new AppError(
      httpStatus22.NOT_FOUND,
      "Planned Outage schedule not found"
    );
  }
  const finalStartTime = payload.startTime ?? existingSchedule.startTime;
  const finalEndTime = payload.endTime ?? existingSchedule.endTime;
  if (finalStartTime >= finalEndTime) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Start time must be before end time"
    );
  }
  if (payload.startTime && finalStartTime < /* @__PURE__ */ new Date()) {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Load shedding schedule cannot start in the past"
    );
  }
  const area = await prisma.area.findUnique({
    where: {
      id: existingSchedule.areaId
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!area) {
    throw new AppError(httpStatus22.NOT_FOUND, "Area not found");
  }
  if (area.status !== "ACTIVE") {
    throw new AppError(
      httpStatus22.BAD_REQUEST,
      "Cannot update schedule for an inactive area"
    );
  }
  const conflictingSchedule = await prisma.plannedOutage.findFirst({
    where: {
      areaId: existingSchedule.areaId,
      id: {
        not: planeedOutageId
      },
      status: {
        not: "CANCELLED"
      },
      startTime: {
        lt: finalEndTime
      },
      endTime: {
        gt: finalStartTime
      }
    }
  });
  if (conflictingSchedule) {
    throw new AppError(
      httpStatus22.CONFLICT,
      "Another Planned Outage schedule already exists during the selected time"
    );
  }
  const updateData = {};
  if (payload.title !== void 0) {
    updateData.title = payload.title;
  }
  if (payload.startTime !== void 0) {
    updateData.startTime = payload.startTime;
  }
  if (payload.endTime !== void 0) {
    updateData.endTime = payload.endTime;
  }
  if (payload.reason !== void 0) {
    updateData.reason = payload.reason;
  }
  const updatedSchedule = await prisma.plannedOutage.update({
    where: {
      id: planeedOutageId
    },
    data: updateData
  });
  return updatedSchedule;
};
var PlannedOutageService = {
  createPlannedOutageInDb,
  getAllPlannedOutage,
  plannedOutageDetails,
  updatePlannedOutage
};

// src/app/modules/planned-outage/planned-outage.controller.ts
var createPlannedOutage = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await PlannedOutageService.createPlannedOutageInDb(payload);
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: "Planned Outage schedule created successfully",
    data: result
  });
});
var getAllPlannedOutageSchdeule = catchAsync(async (req, res) => {
  const result = await PlannedOutageService.getAllPlannedOutage(req.query);
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: "All Planned Outage schedule Retrived successfully",
    data: result
  });
});
var getPlannedOutageDetails = catchAsync(async (req, res) => {
  const plannedOutageId = req.params.plannedOutageId;
  const result = await PlannedOutageService.plannedOutageDetails(plannedOutageId);
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: " Planned Outage Details Retrived Successfully",
    data: result
  });
});
var updatePlannedOutageSchedule = catchAsync(async (req, res) => {
  const plannedOutageId = req.params.plannedOutageId;
  const payload = req.body;
  const result = await PlannedOutageService.updatePlannedOutage(payload, plannedOutageId);
  sendResponse(res, {
    statusCode: httpStatus23.OK,
    success: true,
    message: " planned Outage Updated Successfully",
    data: result
  });
});
var PlannedOutageController = {
  createPlannedOutage,
  getAllPlannedOutageSchdeule,
  getPlannedOutageDetails,
  updatePlannedOutageSchedule
};

// src/app/modules/planned-outage/planned-outage.route.ts
var router10 = Router10();
router10.post("/", auth(Role.ADMIN), validateRequest(plannedOutageValidation.createPlannedOutageZodSchema), PlannedOutageController.createPlannedOutage);
router10.get("/", PlannedOutageController.getAllPlannedOutageSchdeule);
router10.get("/:plannedOutageId", auth(Role.CUSTOMER, Role.ADMIN), PlannedOutageController.getAllPlannedOutageSchdeule);
router10.patch("/:plannedOutageId", auth(Role.ADMIN), validateRequest(plannedOutageValidation.updatePlannedOutageZodSchema), PlannedOutageController.getAllPlannedOutageSchdeule);
var PlannedOutageRoutes = router10;

// src/app/modules/admin/admin.route.ts
import { Router as Router11 } from "express";

// src/app/modules/admin/admin.controller.ts
import httpStatus25 from "http-status";

// src/app/modules/admin/admin.service.ts
import httpStatus24 from "http-status";
var getAllUsersFromDb = async () => {
  const result = await prisma.user.findMany({
    omit: {
      password: true
    },
    include: {
      reportedOutages: true,
      payments: true
    }
  });
  return result;
};
var updateUserStatus = async (userId, status) => {
  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      role: true,
      status: true
    }
  });
  if (!targetUser) {
    throw new AppError(
      httpStatus24.NOT_FOUND,
      "User not found"
    );
  }
  if (targetUser.role === Role.ADMIN) {
    throw new AppError(
      httpStatus24.FORBIDDEN,
      "Admin cannot change another admins status"
    );
  }
  if (targetUser.status === status) {
    throw new AppError(
      httpStatus24.BAD_REQUEST,
      `User is already ${status}`
    );
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status
    },
    omit: {
      password: true
    }
  });
  return updatedUser;
};
var getAllTechnicanProfileFromDb = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: Role.TECHNICIAN
    },
    omit: {
      password: true
    },
    include: {
      technicianProfile: true,
      assignedOutages: true
    }
  });
  return result;
};
var getAllPaymentRecord = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          transactionId: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  const allPayments = await prisma.payment.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      customer: {
        omit: {
          password: true
        }
      },
      outage: true
    }
  });
  const totalPaymentsCount = await prisma.payment.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allPayments,
    meta: {
      page,
      limit,
      total: totalPaymentsCount,
      totalPages: Math.ceil(totalPaymentsCount / limit)
    }
  };
};
var AdminService = {
  getAllUsersFromDb,
  updateUserStatus,
  getAllTechnicanProfileFromDb,
  getAllPaymentRecord
};

// src/app/modules/admin/admin.controller.ts
var getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsersFromDb();
  sendResponse(res, {
    statusCode: httpStatus25.OK,
    success: true,
    message: "All Users Data fetched successfully",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const status = req.body.status;
  const targetUserId = req.params.userId;
  const result = await AdminService.updateUserStatus(targetUserId, status);
  sendResponse(res, {
    statusCode: httpStatus25.OK,
    success: true,
    message: "User status updated successfully",
    data: result
  });
});
var getAllTechnicanUserData = catchAsync(async (req, res) => {
  const result = await AdminService.getAllTechnicanProfileFromDb();
  sendResponse(res, {
    statusCode: httpStatus25.OK,
    success: true,
    message: "All Technician Users Data fetched successfully",
    data: result
  });
});
var getAllPaymentRecord2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllPaymentRecord(req.query);
  sendResponse(res, {
    statusCode: httpStatus25.OK,
    success: true,
    message: "All Payment record Data fetched successfully",
    data: result
  });
});
var AdminController = {
  getAllUsers,
  updateUserStatus: updateUserStatus2,
  getAllTechnicanUserData,
  getAllPaymentRecord: getAllPaymentRecord2
};

// src/app/modules/admin/admin.route.ts
var router11 = Router11();
router11.get("/users", auth(Role.ADMIN), AdminController.getAllUsers);
router11.patch("/users/:userId", auth(Role.ADMIN), AdminController.updateUserStatus);
router11.get("/technician", auth(Role.ADMIN), AdminController.getAllTechnicanUserData);
router11.get("/payment-record", auth(Role.ADMIN), AdminController.getAllPaymentRecord);
var AdminRoutes = router11;

// src/app/modules/analytics/analytics.route.ts
import { Router as Router12 } from "express";

// src/app/modules/analytics/analytics.controller.ts
import httpStatus26 from "http-status";

// src/app/modules/analytics/analytics.service.ts
var getCustomerAnalyticsReport = async (userId) => {
  const totalReportedOutages = await prisma.outage.count({
    where: {
      userId,
      isDeleted: false
    }
  });
  const highPriorityOutages = await prisma.outage.count({
    where: {
      userId,
      isDeleted: false,
      priority: OutagePriority.HIGH
    }
  });
  const restoredOutages = await prisma.outage.count({
    where: {
      userId,
      isDeleted: false,
      status: OutageStatus.RESTORED
    }
  });
  const totalSpentResult = await prisma.payment.aggregate({
    where: {
      customerId: userId,
      status: PaymentStatus.COMPLETED
    },
    _sum: {
      amount: true
    }
  });
  const totalSpent = totalSpentResult._sum.amount?.toNumber() || 0;
  const outageStatus = await prisma.outage.groupBy({
    by: ["status"],
    where: {
      userId,
      isDeleted: false
    },
    _count: {
      _all: true
    }
  });
  return {
    totalReportedOutages,
    highPriorityOutages,
    restoredOutages,
    totalSpent,
    outageStatus
  };
};
var getTechnicianAnalyticsReport = async (userId) => {
  const totalAssignedOutages = await prisma.outage.count({
    where: {
      technicianId: userId,
      isDeleted: false
    }
  });
  const activeOutages = await prisma.outage.count({
    where: {
      technicianId: userId,
      isDeleted: false,
      status: {
        in: [OutageStatus.ASSIGNED, OutageStatus.IN_PROGRESS]
      }
    }
  });
  const restoredOutages = await prisma.outage.count({
    where: {
      technicianId: userId,
      isDeleted: false,
      status: OutageStatus.RESTORED
    }
  });
  const highPriorityOutages = await prisma.outage.count({
    where: {
      technicianId: userId,
      isDeleted: false,
      priority: OutagePriority.HIGH
    }
  });
  const outageStatus = await prisma.outage.groupBy({
    by: ["status"],
    where: {
      technicianId: userId,
      isDeleted: false
    },
    _count: {
      _all: true
    }
  });
  return {
    totalAssignedOutages,
    activeOutages,
    restoredOutages,
    highPriorityOutages,
    outageStatus
  };
};
var getAdminAnalyticsReport = async () => {
  const totalUsers = await prisma.user.count();
  const totalTechnicians = await prisma.user.count({
    where: {
      role: Role.TECHNICIAN
    }
  });
  const totalReportedOutages = await prisma.outage.count({
    where: {
      isDeleted: false
    }
  });
  const activeOutages = await prisma.outage.count({
    where: {
      isDeleted: false,
      status: {
        in: [
          OutageStatus.REPORTED,
          OutageStatus.ACKNOWLEDGED,
          OutageStatus.ASSIGNED,
          OutageStatus.IN_PROGRESS
        ]
      }
    }
  });
  const restoredOutages = await prisma.outage.count({
    where: {
      isDeleted: false,
      status: OutageStatus.RESTORED
    }
  });
  const totalRevenueResult = await prisma.payment.aggregate({
    where: {
      status: PaymentStatus.COMPLETED
    },
    _sum: {
      amount: true
    }
  });
  const totalRevenue = totalRevenueResult._sum.amount?.toNumber() || 0;
  const totalLoadSheddingSchedules = await prisma.loadShedding.count();
  const totalPlannedOutages = await prisma.plannedOutage.count();
  const outageStatus = await prisma.outage.groupBy({
    by: ["status"],
    where: {
      isDeleted: false
    },
    _count: {
      _all: true
    }
  });
  const userStatus = await prisma.user.groupBy({
    by: ["status"],
    _count: {
      _all: true
    }
  });
  return {
    totalUsers,
    totalTechnicians,
    totalReportedOutages,
    activeOutages,
    restoredOutages,
    totalRevenue,
    totalLoadSheddingSchedules,
    totalPlannedOutages,
    outageStatus,
    userStatus
  };
};
var AnalyticsServices = {
  getCustomerAnalyticsReport,
  getTechnicianAnalyticsReport,
  getAdminAnalyticsReport
};

// src/app/modules/analytics/analytics.controller.ts
var getCustomerAnalytics = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await AnalyticsServices.getCustomerAnalyticsReport(userId);
  sendResponse(res, {
    statusCode: httpStatus26.OK,
    success: true,
    message: "Customer Analytics Retrieved Successfully",
    data: result
  });
});
var getTechnicianAnalytics = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await AnalyticsServices.getTechnicianAnalyticsReport(userId);
  sendResponse(res, {
    statusCode: httpStatus26.OK,
    success: true,
    message: "Technician Analytics Retrieved Successfully",
    data: result
  });
});
var getAdminAnalytics = catchAsync(async (req, res) => {
  const result = await AnalyticsServices.getAdminAnalyticsReport();
  sendResponse(res, {
    statusCode: httpStatus26.OK,
    success: true,
    message: "Admin Analytics Retrieved Successfully",
    data: result
  });
});
var AnalyticsController = {
  getCustomerAnalytics,
  getTechnicianAnalytics,
  getAdminAnalytics
};

// src/app/modules/analytics/analytics.route.ts
var router12 = Router12();
router12.get(
  "/customer-analytics",
  auth(Role.CUSTOMER),
  AnalyticsController.getCustomerAnalytics
);
router12.get(
  "/technician-analytics",
  auth(Role.TECHNICIAN),
  AnalyticsController.getTechnicianAnalytics
);
router12.get(
  "/admin-analytics",
  auth(Role.ADMIN),
  AnalyticsController.getAdminAnalytics
);
var AnalyticsRoutes = router12;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: config_default.app_url,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/technician", TechnicianRoutes);
app.use("/api/v1/zone", ZoneRoutes);
app.use("/api/v1/substation", SubstationRoutes);
app.use("/api/v1/feeder", FeederRoutes);
app.use("/api/v1/area", AreaRoutes);
app.use("/api/v1/outage", OutageRoutes);
app.use("/api/v1/load-shedding", LoadSheddingRoutes);
app.use("/api/v1/payment", PaymentRoutes);
app.use("/api/v1/planned-outage", PlannedOutageRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/analytics", AnalyticsRoutes);
app.get("/", (req, res) => {
  res.send("Next level assignment 6 and Load Shedding & Power Management server is running");
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/app/utils/seed.ts
import bcrypt2 from "bcryptjs";
var seedTesterAdmin = async () => {
  try {
    const isTesterAdmin = await prisma.user.findUnique({
      where: {
        email: config_default.tester_admin_email
      }
    });
    if (isTesterAdmin) {
      console.log("Tester admin already exist this  email");
      return;
    }
    const name = config_default.tester_admin_email;
    const email = config_default.tester_admin_email;
    const password = config_default.tester_admin_password;
    const hashedPassword = await bcrypt2.hash(
      password,
      Number(config_default.bcrypt_salt_rounds)
    );
    const testerAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.ADMIN,
        emailVerified: true
      }
    });
    console.log(testerAdmin, "Teseter admin is created");
  } catch (error) {
    console.log(error, "error Tester admin seeding");
    await prisma.user.delete({
      where: {
        email: config_default.tester_admin_email
      }
    });
  }
};
var seedTesterTechnician = async () => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingTechnician = await tx.user.findUnique({
        where: {
          email: config_default.tester_technician_email
        }
      });
      if (existingTechnician) {
        console.log("Tester technician already exists with this email");
        return null;
      }
      const hashedPassword = await bcrypt2.hash(
        config_default.tester_technician_password,
        Number(config_default.bcrypt_salt_rounds)
      );
      const technician = await tx.user.create({
        data: {
          name: config_default.tester_technician_name,
          email: config_default.tester_technician_email,
          password: hashedPassword,
          role: Role.TECHNICIAN,
          emailVerified: true
        }
      });
      const technicianProfile = await tx.technicianProfile.create({
        data: {
          userId: technician.id,
          expertise: ["Electrical Maintenance", "Power Distribution"],
          experience: 1,
          availability: TechnicianStatus.AVAILABLE,
          bio: "Tester technician profile",
          technicianvProfileVerificationStatus: TechnicianProfileStatus.APPROVED
        }
      });
      return {
        technician,
        technicianProfile
      };
    });
    if (!result) return;
    console.log("Tester technician account created:", result.technician);
    console.log("Tester technician profile created:", result.technicianProfile);
  } catch (error) {
    console.log(error, "Error while tester technician seeding");
  }
};
var seedTesterCustomer = async () => {
  try {
    const isTesterCustomer = await prisma.user.findUnique({
      where: {
        email: config_default.tester_customer_email
      }
    });
    if (isTesterCustomer) {
      console.log("Tester customer already exists with this email");
      return;
    }
    const name = config_default.tester_customer_name;
    const email = config_default.tester_customer_email;
    const password = config_default.tester_customer_password;
    const hashedPassword = await bcrypt2.hash(
      password,
      Number(config_default.bcrypt_salt_rounds)
    );
    const testerCustomer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.CUSTOMER,
        emailVerified: true
      }
    });
    console.log(testerCustomer, "Tester customer is created");
  } catch (error) {
    console.log(error, "Error while tester customer seeding");
    await prisma.user.delete({
      where: {
        email: config_default.tester_customer_email
      }
    });
  }
};

// src/server.ts
var port = config_default.port;
var main = async () => {
  try {
    console.log("Hello db server ts");
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    await redisClient.connect();
    console.log("redis cnnected sucesfull");
    await seedTesterAdmin();
    await seedTesterTechnician();
    await seedTesterCustomer();
    await transporter.verify();
    console.log("NOdema iler connected");
    app_default.listen(port, () => {
      console.log(`Next Level Assignment 6 server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error, "error while server running");
    process.exit(1);
  }
};
main();
//# sourceMappingURL=server.js.map