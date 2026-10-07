const express = require("express");
const router = express.Router();
const applicationController = require(
    "../controllers/applicationController"
);

router.post(
    "/aplicacoes",
    applicationController.cadastrarAplicacao
);

router.get(
    "/aplicacoes/:id",
    applicationController.buscarAplicacao
);


module.exports = router;