import { Router } from "express";
import {
    criarTarefa,
    listarTarefas,
} from "../controllers/tarefas.controller.js";
import { validateTitulo } from "../middlewares/validateTitulo.js";

const router = Router();

router.get("/", listarTarefas);
router.post("/", validateTitulo, criarTarefa);

export default router;
