import app from "./app";
import config from "./app/config";
import { transporter } from "./app/lib/nodemailer";
import { prisma } from "./app/lib/prisma";
import { redisClient } from "./app/lib/redis";
import { seedTesterAdmin } from "./app/utils/seed";



const port = config.port;

const main = async () => {
	try {

		console.log("Hello db server ts");
		await prisma.$connect();
		console.log("Connected to the database successfully.");
		await redisClient.connect();
		console.log("redis cnnected sucesfull");
		await seedTesterAdmin()
		await transporter.verify();
		console.log("NOdema iler connected");

		app.listen(port, () => {
			console.log(`Next Level Assignment 6 server is running on port ${port}`);
		});


	} catch (error) {
		console.log(error, "error while server running");
		process.exit(1);
	}
};

main();