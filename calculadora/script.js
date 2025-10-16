document.addEventListener('DOMContentLoaded', () => {

    // === ELEMENTOS ===
    const qtdUnidadesInput = document.getElementById('qtd_unidades');
    const qtdMesLocacaoInput = document.getElementById('qtd_mes_locacao');
    const valorAluguelMensalInput = document.getElementById('valor_aluguel_mensal');
    const custoFreteInput = document.getElementById('custo_frete');
    const manutencaoIndenizacaoInput = document.getElementById('manutencao_indenizacao');
    const insumosInput = document.getElementById('insumos');
    const resultado = document.getElementById('resultado');
    const resultadoPorUH = document.getElementById('resultado_por_uh');


    const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    const obterNumero = (el) => Number(el?.value?.replace(',', '.') || 0);


    function calcularTotal() {
        const qtdUnidades = obterNumero(qtdUnidadesInput);
        const qtdMesLocacao = obterNumero(qtdMesLocacaoInput);
        const custoFrete = obterNumero(custoFreteInput);
        const custoAluguelMensal = obterNumero(valorAluguelMensalInput);
        const manutencao = obterNumero(manutencaoIndenizacaoInput);
        const insumos = obterNumero(insumosInput);


        const totalInsumos = qtdUnidades * insumos;


        const totalGeral = (qtdMesLocacao * custoAluguelMensal)
                         + custoFrete
                         + (manutencao * qtdUnidades)
                         + totalInsumos;

   
        const totalPorUH = qtdUnidades > 0 ? totalGeral / qtdUnidades : 0;


        resultado.textContent = formatarMoeda(totalGeral);
        resultadoPorUH.textContent = formatarMoeda(totalPorUH);
    }


    [
        qtdUnidadesInput,
        qtdMesLocacaoInput,
        valorAluguelMensalInput,
        custoFreteInput,
        manutencaoIndenizacaoInput,
        insumosInput
    ].forEach(el => el.addEventListener('input', calcularTotal));

    // cálculo inicial
    calcularTotal();
});
