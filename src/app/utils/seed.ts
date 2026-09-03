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