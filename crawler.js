const { cachefy, verify } = require('./redis_client')
const { remote } = require('webdriverio');
const injectByIndex = require('./elastic_search')

module.exports = async function crawler(cpf) {
    const browser = await remote({
        capabilities: {
            browserName: 'chrome', // Use 'firefox' para Firefox ou 'safari' para Safari
        }
    });

    try {
        //verifica se CPF ja esta em cache e evita o crawler completo
        const reply = verify(cpf)
        if (reply) {
            console.log('reply', reply)
        }

        await browser.url(process.env.LOGIN_PAGE);

        // Localiza os campos de login e senha e preenche com as informações de login
        const campoLogin = await browser.$('#user');
        const campoSenha = await browser.$('#pass');

        await campoLogin.setValue(process.env.USER_LOGIN);
        await campoSenha.setValue(process.env.USER_PASS);

        // Localiza o botão de login e clica nele
        const botaoLogin = await browser.$('#botao');
        await botaoLogin.click();

        await browser.waitUntil(
            async () => {
                return (await browser.getUrl()) !== process.env.LOGIN_PAGE
            },
            {
                timeout: 10000,
                timeoutMsg: 'Expected navigation did not happen within 10 seconds',
            }
        );
        const localStorageItemName = 'id_token';
        const localStorageValue = await browser.execute((localStorageItemName) => {
            return localStorage.getItem(localStorageItemName);
        }, localStorageItemName);

        const response = await fetch(`${process.env.OFFLINE_LIST}${cpf}`, {
            headers: {
                Authorization: `Bearer ${localStorageValue}`
            }
        });
        console.log('http_status', response.status)
        const data = await response.json();
        console.log('Data retrieved:', data);
        cachefy(cpf,data)
        injectByIndex(cpf,data)

    } catch (error) {
        console.error('Ocorreu um erro:', error);
    } finally {
        // Fecha o navegador
        //await browser.deleteSession();
    }
}