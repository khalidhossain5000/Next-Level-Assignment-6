import { Role } from "../../generated/prisma/enums";
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