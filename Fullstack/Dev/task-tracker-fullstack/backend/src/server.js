import "dotenv/config";
import app from "./app.js";
import { connectDb } from "./db/mongoose.js";

const PORT = Number(process.env.PORT || 3000);

/**
 * Arranca a API apenas depois de confirmar ligação ao MongoDB.
 *
 * @returns {Promise<void>} Promise resolvida quando o servidor fica a escutar.
 */
async function startServer() {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`API a correr em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Falha ao arrancar a API:", error.message);
        process.exit(1);
    }
}

startServer();
