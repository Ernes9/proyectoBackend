import { Router } from "express";
import config from "../config/loggers/config.dev.js";

const router = Router()
router.get('/', async (req, res) => {
    config.HTTP('Esto es un mensaje de http');
    config.INFO('Esto es un mensaje de info');
    config.WARN('Esto es un mensaje de warning');
    config.FATAL('Esto es un mensaje de fatal');

    res.send('Los logs se han registrado correctamente.');
})

export default router;