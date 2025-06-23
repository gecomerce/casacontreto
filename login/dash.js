window.addEventListener('load', () => {
    let qtd_mov = document.getElementById('qtd_mov');
    let valor_entrada = document.getElementById('valor_entrada');
    let valor_saida = document.getElementById('valor_saida');
    let saldoElemento = document.getElementById('saldo');

    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQk8VyuKMNrC-bcMS1ydlgIf-rPCqjOGjLv_vLJxP6kORj91hnLhc-nKjr4IZ9TpYamKI3FW8Sus9l4/pub?gid=0&single=true&output=csv";

    const myChart = echarts.init(document.getElementById('pie'));
    const myLineChart = echarts.init(document.getElementById('line'));
    const myBarChartCategoria = echarts.init(document.getElementById('bar_saida'));

    let movimentacoesBrutas = [];

    function getCorRotulo() {
        '#FFF';
    }

    function inicializarGraficoPizza() {
        myChart.setOption({
            color: ['#06d6a0', '#ef233c'],
            tooltip: { trigger: 'item' },
            legend: { show: false },
            series: [{
                type: 'pie',
                radius: ['40%', '60%'],
                label: {
                    show: true,
                    position: 'outside',
                    color: "#fff"
                },
                labelLine: { show: true, length: 5, length2: 2 },
                data: []
            }]
        });
    }

    function atualizarGraficoPizza(dados) {
        const totais = dados.reduce((acc, mov) => {
            const status = mov.status?.trim().toUpperCase();
            if (!status) return acc;
            acc[status] = (acc[status] || 0) + mov.valor;
            return acc;
        }, {});

        const data = Object.keys(totais).map(status => ({
            name: status,
            value: totais[status]
        }));

        myChart.setOption({
            series: [{
                data,
                axisLabel: { color: '#fff', fontSize: 13 }
            }]
        });
    }

    // -----------------------------------------------------------------------------

    function atualizarGraficoLinhas(dados) {
        const agrupado = {};

        function parseDataBR(dataBR) {
            const [dia, mes, ano] = dataBR.split('/');
            return new Date(`${ano}-${mes}-${dia}`);
        }

        dados.forEach(({ data_vencimento, situacao, valor }) => {
            if (!data_vencimento) return;
            const dataObj = parseDataBR(data_vencimento);
            if (isNaN(dataObj)) return;

            // Agrupar por mês/ano
            const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
            const ano = dataObj.getFullYear();
            const chaveMesAno = `${mes}/${ano}`;

            if (!agrupado[chaveMesAno]) agrupado[chaveMesAno] = 0;

            const situacaoFormatada = situacao.trim().toUpperCase();
            if (situacaoFormatada === 'ENTREGUE/REALIZADO') {
                agrupado[chaveMesAno] += valor;
            }
        });

        const meses = Object.keys(agrupado).sort((a, b) => {
            const [ma, aa] = a.split('/').map(Number);
            const [mb, ab] = b.split('/').map(Number);
            return aa !== ab ? aa - ab : ma - mb;
        });

        if (meses.length === 0) {
            myLineChart.setOption({ xAxis: { data: [] }, series: [{ data: [] }] });
            return;
        }

        let acumulado = 0;
        const valoresAcumulados = [];

        meses.forEach(mes => {
            acumulado += agrupado[mes];
            valoresAcumulados.push(acumulado);
        });

        myLineChart.setOption({
            grid: { left: '1%', right: '2%', bottom: '15%', top: '1%' },
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    return `<strong>Mês: ${params[0].axisValue}</strong><br>` +
                        params.map(p => `${p.seriesName}: R$ ${p.data.toFixed(2).replace('.', ',')}`).join('<br>');
                }
            },
            xAxis: {
                type: 'category',
                data: meses,
                axisLabel: { color: '#fff', fontSize: 13 }
            },
            yAxis: { type: 'value', show: false },
            series: [
                {
                    name: 'Gastos',
                    type: 'line',
                    data: valoresAcumulados,
                    symbol: 'none',
                    areaStyle: { color: '#588C9D' },
                    lineStyle: { color: '#588C9D' },
                },
            ]
        });
    }


    // function atualizarGraficoLinhas(dados) {
    //     const agrupado = {};

    //     function parseDataBR(dataBR) {
    //         const [dia, mes, ano] = dataBR.split('/');
    //         return new Date(`${ano}-${mes}-${dia}`);
    //     }

    //     dados.forEach(({ data_vencimento, situacao, valor }) => {
    //         if (!data_vencimento) return;
    //         const dataObj = parseDataBR(data_vencimento);
    //         if (isNaN(dataObj)) return;

    //         const dia = dataObj.getUTCDate().toString().padStart(2, '0');
    //         if (!agrupado[dia]) agrupado[dia] = { entrada: 0, saida: 0 };

    //         const situacaoFormatada = situacao.trim().toUpperCase();
    //         if (situacaoFormatada === 'ENTREGUE/REALIZADO') {
    //             agrupado[dia].entrada += valor;
    //         } else if (situacaoFormatada === 'ENTREGUE/REALIZADO' || situacaoFormatada === 'ENTREGUE/REALIZADO') {
    //             agrupado[dia].saida += valor;
    //         }
    //     });

    //     const dias = Object.keys(agrupado).sort((a, b) => parseInt(a) - parseInt(b));
    //     if (dias.length === 0) {
    //         myLineChart.setOption({ xAxis: { data: [] }, series: [{ data: [] }] });
    //         return;
    //     }

    //     let acumuladoSaidas = 0;
    //     const saidas = [];

    //     dias.forEach(dia => {
    //         acumuladoSaidas += agrupado[dia].entrada;
    //         saidas.push(acumuladoSaidas);
    //     });

    //     myLineChart.setOption({
    //         grid: { left: '1%', right: '2%', bottom: '15%', top: '1%' },
    //         tooltip: {
    //             trigger: 'axis',
    //             formatter: params => {
    //                 return `<strong>Dia: ${params[0].axisValue}</strong><br>` +
    //                     params.map(p => `${p.seriesName}: R$ ${p.data.toFixed(2).replace('.', ',')}`).join('<br>');
    //             }
    //         },
    //         xAxis: {
    //             type: 'category',
    //             data: dias,
    //             axisLabel: { color: '#fff', fontSize: 13 }
    //         },
    //         yAxis: { type: 'value', show: false },
    //         series: [
    //             {
    //                 name: 'Gastos',
    //                 type: 'line',
    //                 data: saidas,
    //                 symbol: 'none',
    //                 areaStyle: { color: 'orange' },
    //                 lineStyle: { color: 'orange' },
    //             },
    //         ]
    //     });
    // }

    // ---------------------------------------------------------------------

    function atualizarGraficoBarrasCategoria(dados) {
        const agrupado = dados.reduce((acc, mov) => {
            const tipo = mov.tipo?.trim() || "Sem Categoria";
            acc[tipo] = (acc[tipo] || 0) + mov.valor;
            return acc;
        }, {});

        const entradasOrdenadas = Object.entries(agrupado)
            .sort(([, valB], [, valA]) => valB - valA);

        const categorias = entradasOrdenadas.map(([cat]) => cat);
        const valores = entradasOrdenadas.map(([, val]) => val);

        myBarChartCategoria.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: params => {
                    const p = params[0];
                    return `${p.name}: ${p.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                }
            },
            grid: { left: '30%', right: '20%', bottom: '10%', top: '5%' },
            xAxis: {
                type: 'value',
                splitLine: { show: false },
                axisLabel: { show: false }
            },
            yAxis: {
                type: 'category',
                data: categorias,
                splitLine: { show: false },
                axisLabel: { color: '#fff', fontSize: 13 }
            },
            series: [{
                type: 'bar',
                data: valores,
                itemStyle: { color: '#588C9D' },
                label: {
                    show: true,
                    position: 'right',
                    formatter: p => p.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                    color: '#fff',
                    fontSize: 12,
                }
            }]
        });
    }

    // -------------------------------------------------------------------------

    function contarElementos() {
        qtd_mov.innerHTML = movimentacoesBrutas.length;
    }


    function somarSaidas() {
        return movimentacoesBrutas
            .filter(item => item.tipo.toUpperCase() === "SAÍDA")
            .reduce((acc, item) => acc + item.valor, 0);
    }


    function atualizarValorSaida() {
        valor_saida.innerHTML = somarSaidas().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }


    function atualizarGraficos() {
        atualizarGraficoPizza(movimentacoesBrutas);
        atualizarGraficoLinhas(movimentacoesBrutas);
        atualizarGraficoBarrasCategoria(movimentacoesBrutas);
        contarElementos();
        atualizarValorSaida();
    }

    function observarModoEscuro() {
        const observer = new MutationObserver(() => atualizarGraficos());
        observer.observe(document.body, { attributes: true });
    }

    inicializarGraficoPizza();
    observarModoEscuro();

    fetch(url)
        .then(res => res.text())
        .then(csvText => {
            const resultados = Papa.parse(csvText, {
                header: true,
                dynamicTyping: false,
                skipEmptyLines: true,
                transformHeader: h => h.trim().toLowerCase()
            });

            movimentacoesBrutas = resultados.data.map(row => ({
                tipo: row['tipo'],
                fornecedor: row['fornecedor'],
                descricao: row['descrição'],
                data_vencimento: row['data vencimento'],
                valor: parseFloat(row['valor'].replace(/\./g, '').replace(',', '.')) || 0,
                status: row['status'],
                situacao: row['situação']
            }));

            atualizarGraficos();
        })
        .catch(console.error);
});