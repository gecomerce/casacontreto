document.addEventListener('DOMContentLoaded', () => {


    // Custos Relacionados com a aquisicao do Terreno:

    const valor_aquisicao = document.getElementById('valor_aquisicao');
    const itbiResultado = document.getElementById('itbi_resultado');
    const ibti = 0.02;

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function limparValor(valor) {

        return Number(valor.replace(/\D/g, '')) / 100;
    }



    valor_aquisicao.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        let valorNumerico = Number(valor) / 100;

        e.target.value = formatarMoeda(valorNumerico);

        let valorITBI = valorNumerico * ibti;
        itbiResultado.textContent = `${formatarMoeda(valorITBI)}`;


        const preco_bruto_terreno = document.getElementById('preco_bruto_terreno');
        preco_bruto_terreno.innerHTML = `Valor Bruto do Terreno: ${formatarMoeda(valorNumerico)}`;


        calcularResultadoOperacional();
    });


    // ----------------------------------------------------------------------------

    // Custos Relacionados a Obra:

    const qtdUnidades = document.getElementById('qtd_unidades');
    const metragem = document.getElementById('metragem_da_obra');
    const custoMetro = document.getElementById('custo_por_metro');
    const resultado = document.getElementById('custo_total_obra');

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function limparValorMoeda(valor) {

        return Number(valor.replace(/\D/g, '')) / 100;
    }


    custoMetro.addEventListener('change', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        let valorNumerico = Number(valor) / 100;
        e.target.value = formatarMoeda(valorNumerico);
        calcularCustoObra();
    });


    qtdUnidades.addEventListener('change', calcularCustoObra);
    metragem.addEventListener('change', calcularCustoObra);

    function calcularCustoObra() {
        const unidades = parseFloat(qtdUnidades.value) || 0;
        const area = parseFloat(metragem.value) || 0;
        const custo = limparValorMoeda(custoMetro.value) || 0;

        const total = unidades * area * custo;
        resultado.textContent = `${formatarMoeda(total)}`;
    }


    // ----------------------------------------------------------------------------

    //    Custo Obra e Financiamento

    const condominioInput = document.getElementById('valor_condominio');
    const aguaInput = document.getElementById('valor_agua_energia');
    const habiteseInput = document.getElementById('habitese');
    const resultadoFinanciamento = document.getElementById('resultado_financiamento');



    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function limparValorMoeda(valor) {
        return Number(valor.replace(/\D/g, '')) / 100;
    }

    function aplicarMascaraMoeda(input) {
        input.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            let valorNumerico = Number(valor) / 100;
            e.target.value = formatarMoeda(valorNumerico);
            calcularTotal();
        });
    }

    function calcularTotal() {
        const condominio = limparValorMoeda(condominioInput.value) || 0;
        const agua = limparValorMoeda(aguaInput.value) || 0;
        const habitese = limparValorMoeda(habiteseInput.value) || 0;

        const total = condominio + agua + habitese;
        resultadoFinanciamento.textContent = formatarMoeda(total);

        document.getElementById('custo_obra_financiamento').innerHTML = `Custo Obra e Financiamento: ${resultadoFinanciamento.textContent}`;

        calcularResultadoOperacional();
    }


    aplicarMascaraMoeda(condominioInput);
    aplicarMascaraMoeda(aguaInput);
    aplicarMascaraMoeda(habiteseInput);

    // ----------------------------------------------------------------------------

    // Calculo do Resultado Operacional

    valor_aquisicao.addEventListener('change', calcularResultadoOperacional);
    condominioInput.addEventListener('change', calcularResultadoOperacional);
    aguaInput.addEventListener('change', calcularResultadoOperacional);
    habiteseInput.addEventListener('change', calcularResultadoOperacional);
    document.getElementById('custo_obra_bruto').addEventListener('DOMSubtreeModified', calcularResultadoOperacional);

    let preco_bruto_terreno = document.getElementById('preco_bruto_terreno');
    preco_bruto_terreno.innerHTML = `Valor Bruto do Terreno: ${valor_aquisicao.value}`;

    let custo_obra_financiamento = document.getElementById('custo_obra_financiamento');
    custo_obra_financiamento.innerHTML = `Custo Obra e Financiamento: ${resultadoFinanciamento.textContent}`;



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

    // --------------------------------------------------

});
