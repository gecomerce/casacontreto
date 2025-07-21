document.addEventListener('DOMContentLoaded', () => {

    // Custos Relacionados com a aquisicao do Terreno:

    const valor_aquisicao = document.getElementById('valor_aquisicao');
    const itbiResultado = document.getElementById('itbi_resultado');


    const ibti = 0.02;
    const rgi = 0.0075;


    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function limparValor(valor) {

        return Number(valor.replace(/\D/g, '')) / 100;
    }

    // ------------------------------------------------------------

    function obterValorITBI() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        return valorTerreno * ibti;
    }

    // ------------------------------------------------------------

    function calcularRGI() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const custoObra = obterCustoTotalObra();

        const baseCalculo = valorTerreno + custoObra;
        const valorRGI = baseCalculo * rgi;

        const rgiResultado = document.getElementById('rgi');
        rgiResultado.innerHTML = `RGI (0,75%): ${formatarMoeda(valorRGI)}`;
    }

    // ------------------------------------------------------------

    valor_aquisicao.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        let valorNumerico = Number(valor) / 100;

        e.target.value = formatarMoeda(valorNumerico);

        let valorITBI = valorNumerico * ibti;
        itbiResultado.textContent = `Resultado ITBI: ${formatarMoeda(valorITBI)}`;


        const preco_bruto_terreno = document.getElementById('preco_bruto_terreno');
        preco_bruto_terreno.innerHTML = `Valor Bruto do Terreno: ${formatarMoeda(valorNumerico)}`;

        calcularResultadoOperacional();
    });


    // ------------------------------------------------------------

    function calcularCertidao() {

        let valorITBI_ = obterValorITBI();
        let custo_registro = valorITBI_ * 0.13


        const registroResultado = document.getElementById('certidao_etc');
        registroResultado.innerHTML = `RGI (13%): ${formatarMoeda(custo_registro)}`;
    }

    // ------------------------------------------------------------

    function calcularCustoTotalTerreno() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const itbi = valorTerreno * 0.02;
        const rgi = (valorTerreno + obterCustoTotalObra()) * 0.0075;
        const certidoes = itbi * 0.13;

        const totalTerreno = itbi + rgi + certidoes;

        const custoTotalTerrenoEl = document.getElementById('custo_total_terreno');
        custoTotalTerrenoEl.textContent = `Total do Terreno: ${formatarMoeda(totalTerreno)}`;

        return totalTerreno;

    }



    // ----------------------------------------------------------------------------

    // CUSTOS RELAIONADOS A OBRA

    const qtdUnidades = document.getElementById('qtd_unidades');
    const metragem = document.getElementById('metragem_da_obra');
    const custoMetro = document.getElementById('custo_por_metro');
    const resultado = document.getElementById('custo_total_obra');

    // ------------------------------------------------------------

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // ------------------------------------------------------------

    function limparValorMoeda(valor) {

        return Number(valor.replace(/\D/g, '')) / 100;
    }

    // ------------------------------------------------------------

    custoMetro.addEventListener('change', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        let valorNumerico = Number(valor) / 100;
        e.target.value = formatarMoeda(valorNumerico);
        calcularCustoObra();
    });

    // ------------------------------------------------------------

    qtdUnidades.addEventListener('change', calcularCustoObra);
    metragem.addEventListener('change', calcularCustoObra);

    // --------------------------------------------------------------

    function calcularCustoObra() {
        const unidades = parseFloat(qtdUnidades.value) || 0;
        const area = parseFloat(metragem.value) || 0;
        const custo = limparValorMoeda(custoMetro.value) || 0;

        const percentual_construtor = 0.1;
        const lucro_construtor = document.getElementById('lucro_construtor');
        const custo_obra_bruto_element = document.getElementById('custo_obra_bruto');

        const custoConstrucao = unidades * area * custo;
        const resultado_construtor = custoConstrucao * percentual_construtor;

        lucro_construtor.innerHTML = `Lucro do Construtor 10%: ${formatarMoeda(resultado_construtor)} `;

        resultado.textContent = `Total: ${formatarMoeda(custoConstrucao)}`;

        const condominio = limparValorMoeda(condominioInput.value) || 0;
        const agua = limparValorMoeda(aguaInput.value) || 0;
        const custododinheiro = limparValorMoeda(custo_do_dinheiro.value) || 0;

        const custoBrutoObra = custoConstrucao + condominio + agua + custododinheiro;

        custo_obra_bruto_element.textContent = formatarMoeda(custoBrutoObra);

        calcularResultadoOperacional();
    }

    function CustoObraValores() {
        const condominioInput = limparValorMoeda(document.getElementById('valor_condominio').value) || 0;
        const aguaInput = limparValorMoeda(document.getElementById('valor_agua_energia').value) || 0;
        const custo_iptu = limparValorMoeda(document.getElementById('valor_iptu').value) || 0;

        const custoBrutoObra = condominioInput + aguaInput + custo_iptu;

        return custoBrutoObra;
    }


    // ----------------------------------------------------------------------------

    //    Custo Obra e Financiamento

    const condominioInput = document.getElementById('valor_condominio');
    const aguaInput = document.getElementById('valor_agua_energia');
    const custo_do_dinheiro = document.getElementById('custo_dinheiro');
    const custo_iptu = document.getElementById('valor_iptu');


    const resultadoFinanciamento = document.getElementById('resultado_financiamento');


    // ------------------------------------------------------------

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // ------------------------------------------------------------

    function limparValorMoeda(valor) {
        return Number(valor.replace(/\D/g, '')) / 100;
    }

    // ------------------------------------------------------------

    function aplicarMascaraMoeda(input) {
        input.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            let valorNumerico = Number(valor) / 100;
            e.target.value = formatarMoeda(valorNumerico);
            calcularTotal();
        });
    }

    // --------------------------------------------------------------------------

    // CUSTO TOTAL DA OBRA

    function calcularTotal() {
        const condominio = limparValorMoeda(condominioInput.value) || 0;
        const agua = limparValorMoeda(aguaInput.value) || 0;
        const custododinheiro = limparValorMoeda(custo_do_dinheiro.value) || 0;
        const iptu = limparValorMoeda(custo_iptu.value) || 0;

        const total = condominio + agua + custododinheiro + iptu;

        const habite_se_porcentagem = 0.04;
        const habite_se = document.getElementById('habite_se');

        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const custoObra = obterCustoTotalObra();

        const somaTotal = valorTerreno + custoObra;
        const valorHabiteSe = somaTotal * habite_se_porcentagem;

        habite_se.innerHTML = `Habite-se (4%): ${formatarMoeda(valorHabiteSe)}`;

        resultadoFinanciamento.textContent = formatarMoeda(total);

        document.getElementById('custo_obra_financiamento').innerHTML = `Custo Obra e Financiamento: ${resultadoFinanciamento.textContent}`;


        calcularRGI();
        calcularCertidao();
        calcularCustoTotalTerreno();
        calcularResultadoOperacional();
        calcularSomaDosCards();
        CustoObraValores();
    }

    // -------------------------------------------------------------------------------

    function obterCustoTotalObra() {
        const unidades = parseFloat(qtdUnidades.value) || 0;
        const area = parseFloat(metragem.value) || 0;
        const custo = limparValorMoeda(custoMetro.value) || 0;
        return unidades * area * custo;
    }

    // ------------------------------------------------------------

    function obterValorITBI() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        return valorTerreno * ibti;
    }

    // ------------------------------------------------------------

    function calcularRGI() {
        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const custoObra = obterCustoTotalObra();

        const baseCalculo = valorTerreno + custoObra;
        const valorRGI = baseCalculo * rgi;

        const rgiResultado = document.getElementById('rgi');
        rgiResultado.innerHTML = `RGI (0,75%): ${formatarMoeda(valorRGI)}`;
    }

    // ------------------------------------------------------------

    aplicarMascaraMoeda(condominioInput);
    aplicarMascaraMoeda(aguaInput);
    aplicarMascaraMoeda(custo_do_dinheiro);
    aplicarMascaraMoeda(custo_iptu)


    // ----------------------------------------------------------------------------

    // Calculo do Resultado Operacional

    valor_aquisicao.addEventListener('change', calcularResultadoOperacional);
    condominioInput.addEventListener('change', calcularResultadoOperacional);
    aguaInput.addEventListener('change', calcularResultadoOperacional);

    document.getElementById('custo_obra_bruto').addEventListener('DOMSubtreeModified', calcularResultadoOperacional);

    let preco_bruto_terreno = document.getElementById('preco_bruto_terreno');
    preco_bruto_terreno.innerHTML = `Valor Bruto do Terreno: ${valor_aquisicao.value}`;

    let custo_obra_financiamento = document.getElementById('custo_obra_financiamento');
    custo_obra_financiamento.innerHTML = `Custo Obra e Financiamento: ${resultadoFinanciamento.textContent}`;


    // ------------------------------------------------------------


    function limparValorTexto(texto) {
        return Number(texto.replace(/\D/g, '')) / 100;
    }


    function calcularResultadoOperacional() {

        const terreno = limparValorMoeda(valor_aquisicao.value) || 0;


        const financiamento = limparValorTexto(resultadoFinanciamento.textContent) || 0;


        const obraBruta = limparValorTexto(document.getElementById('custo_obra_bruto').textContent) || 0;

        const total = terreno + financiamento + obraBruta;

        document.getElementById('resultado_operacional').textContent = formatarMoeda(total);
    }


    calcularResultadoOperacional();

    // -------------------------------------------------------------


    function calcularSomaDosCards() {
        const custoTerrenoValor = calcularCustoTotalTerreno();

        const obraFinanciamentoTexto = CustoObraValores();

        const habite_se_porcentagem = 0.04;
        const habite_se = document.getElementById('habite_se');

        const valorTerreno = limparValorMoeda(valor_aquisicao.value) || 0;
        const custoObra = obterCustoTotalObra();

        const somaTotal = valorTerreno + custoObra;
        const valorHabiteSe = somaTotal * habite_se_porcentagem;



        const totalFinal = custoTerrenoValor + valorHabiteSe + obraFinanciamentoTexto;

        const resultadoFinalEl = document.getElementById('total_total');
        resultadoFinalEl.textContent = `TOTAL GERAL: ${formatarMoeda(totalFinal)}`;
    }


});
