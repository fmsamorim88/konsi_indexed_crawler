require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.NODE_PORT ?? 3000;

app.get('/:cpf', async (req, res) => {

    const cpf = req.params.cpf

    const response = await fetch(`${process.env.ELASTICSEARCH_HOST}/cpf-index/_doc/${cpf}`);
    if (response.status == 200) {
        const data = await response.json();
        res.send(data._source)
    } else {
        res.status(404).send({
            message: `${cpf} não encontrado`
        })
    }
});

app.get('/', async (req, res) => {


    const response = await fetch(`${process.env.ELASTICSEARCH_HOST}/cpf-index/_search`);
    if (response.status == 200) {
        const data = await response.json();
        const body = data.hits.hits.map(e => e._source)
        res.send(body)
    } else {
        res.status(404).send({
            message: `${cpf} não encontrado`
        })
    }
});

app.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`);
});
