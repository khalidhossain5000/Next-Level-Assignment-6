import app from "./app";
import config from "./config";



const port = config.port;

const main = async () => {
  try {
    
    app.listen(port, () => {
      console.log(
        `Next Level Assignment 6 and Load Shedding & Power Management server is running on port ${port}`,
      );
    });
  } catch (error) {
    console.log(error, "error while server running");
    process.exit(1);
  }
};

main();