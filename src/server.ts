import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);

        console.log(envVars.NODE_ENV);
        console.log("Connected to DB");

        server = app.listen(envVars.PORT, () => {
            console.log("Server is listening port 5000");
        });
    } catch (error) {
        console.log(error);
    }
};

(async() => {
    await startServer();
    await seedSuperAdmin();
})();

// ! unhandle rejaction

process.on("unhandledRejection", () => {
    console.log("Sigterm signal received... server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

// ! uncaught exception

process.on("SIGTERM", () => {
    console.log("Uncaught exception detected... server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

// ! SIGTERM

process.on("uncaughtException", () => {
    console.log("Uncaught exception detected... server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
