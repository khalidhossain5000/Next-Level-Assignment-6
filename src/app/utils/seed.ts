import { InfrastructureStatus, Role, TechnicianProfileStatus, TechnicianStatus } from "../../generated/prisma/enums";
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
          technicianProfileStatus: TechnicianProfileStatus.APPROVED,
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
        `Zone created successfully: ${createdZone.name}`
      );
    }
  } catch (error) {
    console.log(error, "Error while seeding zones");
  }
};



//seeding SUBSTATION