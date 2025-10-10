document.addEventListener('DOMContentLoaded', () => {

    // elementos
    const qtdUnidadesInput = document.getElementById('qtd_unidades');
    const qtdMesLocacaoInput = document.getElementById('qtd_mes_locacao');
    const valor_aluguel_mensal = document.getElementById('valor_aluguel_mensal');
    const custoFreteInput = document.getElementById('custo_frete');
    const manutencao_indenizacao = document.getElementById('manutencao_indenizacao');
    const resultado = document.getElementById('resultado');

    const insumos = 1000;

    // ----------------------------------------------------------
    
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function CalcularInsumos() {
        const qtdUnidades = Number(qtdUnidadesInput.value) || 0;
        return qtdUnidades * insumos;
    }

    function calcularTotal() {
        const qtdMesLocacao = Number(qtdMesLocacaoInput.value) || 0;
        const custoFrete = Number(custoFreteInput.value) || 0;
        const custo_aluguel = Number(valor_aluguel_mensal.value) || 0;
        const manutencao = Number(manutencao_indenizacao.value) || 0;

        const totalInsumos = CalcularInsumos();

        const totalGeral = qtdMesLocacao * custo_aluguel + custoFrete + manutencao + totalInsumos;

        resultado.textContent = formatarMoeda(totalGeral);
    }

    // ----------------------------------------------------------

    // Atualiza o cálculo automaticamente ao digitar
    
    qtdUnidadesInput.addEventListener('input', calcularTotal);
    qtdMesLocacaoInput.addEventListener('input', calcularTotal);
    custoFreteInput.addEventListener('input', calcularTotal);

    // cálculo inicial
    calcularTotal();

});
