import mongoose from "mongoose";

/**
 * Liga a aplicação ao MongoDB Atlas usando a variável MONGODB_URI.
 *
 * Esta função deve ser chamada antes de o servidor começar a aceitar pedidos.
 * Se a ligação falhar, a API não deve arrancar, porque as rotas dependem da base de dados.
 *
 * @returns {Promise<void>} Promise resolvida quando a ligação ao MongoDB estiver ativa.
 * @throws {Error} Lança erro se MONGODB_URI estiver em falta ou se a ligação falhar.
 */
export async function connectDb() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI em falta no ficheiro .env");
    }

    if (
        uri.includes("UTILIZADOR") ||
        uri.includes("PASSWORD") ||
        uri.includes("xxxxx")
    ) {
        throw new Error("Substitui o MONGODB_URI pelo valor real do Atlas");
    }

    await mongoose.connect(uri);
    console.log("MongoDB ligado com sucesso");
}
