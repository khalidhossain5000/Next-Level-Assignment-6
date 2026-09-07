import { type InfrastructureStatus, Role, TechnicianProfileStatus, TechnicianStatus } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";


export const seedTesterAdmin = async () => {
	try {
		
		//1.need to check user exist or not
		const isTesterAdmin = await prisma.user.findUnique({
			where: {
				email: config.tester_admin_email,
			},
		});
		if (isTesterAdmin) {
			console.log("Tester admin already exist this  email");
			return;
		}

		//2.exist not so create new super admin

		const name = config.tester_admin_email;
		const email = config.tester_admin_email;
		const password = config.tester_admin_password;

		const hashedPassword = await bcrypt.hash(
			password as string,
			Number(config.bcrypt_salt_rounds),
		);

		const testerAdmin = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: Role.ADMIN,
				emailVerified: true
			},
		});

		console.log(testerAdmin, "Teseter admin is created");
	} catch (error) {
		console.log(error, "error Tester admin seeding");

		await prisma.user.delete({
			where: {
				email: config.tester_admin_email,
			},
		});
	}
};


//seed default technician account

export const seedTesterTechnician = async () => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // -- Check technician account already exists
      const existingTechnician = await tx.user.findUnique({
        where: {
          email: config.tester_technician_email,
        },
      });

      if (existingTechnician) {
        console.log("Tester technician already exists with this email");
        return null;
      }

      // --Hash password
      const hashedPassword = await bcrypt.hash(
        config.tester_technician_password as string,
        Number(config.bcrypt_salt_rounds),
      );

      // --Create technician account
      const technician = await tx.user.create({
        data: {
          name: config.tester_technician_name,
          email: config.tester_technician_email,
          password: hashedPassword,
          role: Role.TECHNICIAN,
          emailVerified: true,
        },
      });

      // -- Create technician profile
      const technicianProfile = await tx.technicianProfile.create({
        data: {
          userId: technician.id,
          expertise: ["Electrical Maintenance", "Power Distribution"],
          experience: 1,
          availability: TechnicianStatus.AVAILABLE,
          bio: "Tester technician profile",
		  technicianvProfileVerificationStatus:TechnicianProfileStatus.APPROVED,
        },
      });

      return {
        technician,
        technicianProfile,
      };
    });

    if (!result) return;

    console.log("Tester technician account created:", result.technician);
    console.log("Tester technician profile created:", result.technicianProfile);
  } catch (error) {
    console.log(error, "Error while tester technician seeding");
  }
};



//seed default customer account

export const seedTesterCustomer = async () => {
  try {
    // -- Need to check user exist or not
    const isTesterCustomer = await prisma.user.findUnique({
      where: {
        email: config.tester_customer_email,
      },
    });

    if (isTesterCustomer) {
      console.log("Tester customer already exists with this email");
      return;
    }

    // -- User does not exist, so create new tester customer
    const name = config.tester_customer_name;
    const email = config.tester_customer_email;
    const password = config.tester_customer_password;

    const hashedPassword = await bcrypt.hash(
      password as string,
      Number(config.bcrypt_salt_rounds),
    );

    const testerCustomer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.CUSTOMER,
        emailVerified: true,
      },
    });

    console.log(testerCustomer, "Tester customer is created");
  } catch (error) {
    console.log(error, "Error while tester customer seeding");

    await prisma.user.delete({
      where: {
        email: config.tester_customer_email,
      },
    });
  }
};






//NEED TO SEED MORE DEFAULT DATA

// ---- DISTRIBUTION INFRASTRUCUTRE DATA ADDING SEEDING

//--SEEDING ZONE DATA

export const seedZones = async () => {
  try {
    const zones = [
      {
        name: "Dhaka Zone",
        code: "ZONE-DHK",
        description: "Power distribution zone covering Dhaka district.",
        status: "ACTIVE",
      },
      {
        name: "Chattogram Zone",
        code: "ZONE-CTG",
        description: "Power distribution zone covering Chattogram district.",
        status: "ACTIVE",
      },
      {
        name: "Khulna Zone",
        code: "ZONE-KHL",
        description: "Power distribution zone covering Khulna district.",
        status: "ACTIVE",
      },
      {
        name: "Sylhet Zone",
        code: "ZONE-SYL",
        description: "Power distribution zone covering Sylhet district.",
        status: "ACTIVE",
      },
      {
        name: "Rangpur Zone",
        code: "ZONE-RNG",
        description: "Power distribution zone covering Rangpur district.",
        status: "ACTIVE",
      },
    ];

    const zoneImageUrl = "https://i.ibb.co.com/Vcxt5JRx/dogsdg.jpg";

    for (const zone of zones) {
      const existingZone = await prisma.zone.findUnique({
        where: {
          code: zone.code,
        },
      });

      if (existingZone) {
        console.log(
          `Zone already exists with code: ${zone.code}`
        );
        continue;
      }

      const createdZone = await prisma.zone.create({
        data: {
          name: zone.name,
          code: zone.code,
          description: zone.description,
          status:zone.status as InfrastructureStatus,
          zoneImageUrl,
		  zoneImagePublicId: `seed-${zone.code}`,

        },
      });

      console.log(
        `Zone created successfully: ${createdZone}`
      );
    }
  } catch (error) {
    console.log(error, "Error while seeding zones");
  }
};



//seeding SUBSTATION

export const seedSubstations = async () => {
  try {
    const substations = [
      {
        name: "Sylhet Central Substation",
        code: "SS-SYL-001",
        capacity: "50MW",
        location: "Sylhet Sadar",
        zoneId: "8a4732fd-cbf1-485b-8576-3480e18bf469",
      },
      {
        name: "Khulna Central Substation",
        code: "SS-KHL-001",
        capacity: "60MW",
        location: "Khulna Sadar",
        zoneId: "b1269f33-e147-4d85-ba02-1790a5b69051",
      },
      {
        name: "Dhaka Central Substation",
        code: "SS-DHK-001",
        capacity: "100MW",
        location: "Dhaka",
        zoneId: "b79489a4-0dd0-41d9-8314-5d834d72e514",
      },
      {
        name: "Rangpur Central Substation",
        code: "SS-RNG-001",
        capacity: "45MW",
        location: "Rangpur Sadar",
        zoneId: "dbe40722-775a-4361-9c75-901a42b35ad3",
      },
      {
        name: "Chattogram Central Substation",
        code: "SS-CTG-001",
        capacity: "90MW",
        location: "Chattogram",
        zoneId: "efacb5d8-e26e-4bd3-8895-b9f8e9f14756",
      },
    ];

    for (const substation of substations) {
      const existingSubstation = await prisma.substation.findUnique({
        where: {
          code: substation.code,
        },
      });

      if (existingSubstation) {
        console.log(
          `Substation already exists with code: ${substation.code}`,
        );
        continue;
      }

      const createdSubstation = await prisma.substation.create({
        data: {
          name: substation.name,
          code: substation.code,
          capacity: substation.capacity,
          location: substation.location,
          zoneId: substation.zoneId,
        },
      });

      console.log(
        `Substation created successfully: ${createdSubstation.name}`,
      );
    }
  } catch (error) {
    console.log(error, "Error while seeding substations");
  }
};


//seeding feeder

export const seedFeeders = async () => {
  try {
    const feeders = [
      {
        name: "Chattogram Central Feeder",
        code: "FD-CTG-001",
        voltageLevel: "933KV",
        substationId: "1df68ca6-a189-475e-b10e-ef9e6dbd03b0",
      },
      {
        name: "Dhaka Central Feeder",
        code: "FD-DHK-001",
        voltageLevel: "303KV",
        substationId: "426a4463-05ff-469d-8af9-433a9f61e24c",
      },
      {
        name: "Khulna Central Feeder",
        code: "FD-KHL-001",
        voltageLevel: "363KV",
        substationId: "702604ca-c79d-48a1-954c-a588d5e18d3e",
      },
      {
        name: "Rangpur Central Feeder",
        code: "FD-RNG-001",
        voltageLevel: "1233KV",
        substationId: "8960e3eb-728b-4a64-bdae-3ec45b4657ee",
      },
      {
        name: "Sylhet Central Feeder",
        code: "FD-SYL-001",
        voltageLevel: "3903KV",
        substationId: "f1ef8192-c792-40be-90c3-c4292521ccf4",
      },
    ];

    for (const feeder of feeders) {
      const existingFeeder = await prisma.feeder.findUnique({
        where: {
          code: feeder.code,
        },
      });

      if (existingFeeder) {
        console.log(
          `Feeder already exists with code: ${feeder.code}`,
        );
        continue;
      }

      const createdFeeder = await prisma.feeder.create({
        data: {
          name: feeder.name,
          code: feeder.code,
          voltageLevel: feeder.voltageLevel,
          substationId: feeder.substationId,
        },
      });

      console.log(
        `Feeder created successfully: ${createdFeeder.name}`,
      );
    }
  } catch (error) {
    console.log(error, "Error while seeding feeders");
  }
};




//seeding area

export const seedAreas = async () => {
  try {
    const areas = [
      {
        name: "Dhaka Central Area",
        code: "AR-DHK-001",
        address: "Dhaka Sadar, Dhaka",
        feederId: "291b7734-90a6-40f6-b4e1-4862596eb8b2",
      },
      {
        name: "Chattogram Central Area",
        code: "AR-CTG-001",
        address: "Chattogram Sadar, Chattogram",
        feederId: "2d12ff14-8954-479c-90e1-36587274f625",
      },
      {
        name: "Sylhet Central Area",
        code: "AR-SYL-001",
        address: "Sylhet Sadar, Sylhet",
        feederId: "3ecdfcf6-b20a-4a55-a9dc-dc48d29e681b",
      },
      {
        name: "Rangpur Central Area",
        code: "AR-RNG-001",
        address: "Rangpur Sadar, Rangpur",
        feederId: "9a10e0be-faf4-4813-9cfa-f08e7c8004b2",
      },
      {
        name: "Khulna Central Area",
        code: "AR-KHL-001",
        address: "Khulna Sadar, Khulna",
        feederId: "fe4a4fd9-02e2-46bd-96f8-0efcf9bba4ba",
      },
    ];

    for (const area of areas) {
      const existingArea = await prisma.area.findUnique({
        where: {
          code: area.code,
        },
      });

      if (existingArea) {
        console.log(`Area already exists with code: ${area.code}`);
        continue;
      }

      const createdArea = await prisma.area.create({
        data: {
          name: area.name,
          code: area.code,
          address: area.address,
          feederId: area.feederId,
        },
      });

      console.log(`Area created successfully: ${createdArea.name}`);
    }
  } catch (error) {
    console.log(error, "Error while seeding areas");
  }
};



//for admin load shedding schedule and planned outage default seeding

//seeding load shedding schedule

