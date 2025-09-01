import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { buscarTodasContas } from '../api/contas.api';

// Objeto inicial para os dados do gráfico, para evitar erros de renderização
const DADOS_GRAFICO_INICIAL = {
  labels: [],
  datasets: [
    { data: [], color: () => '#00C853' }, // Receitas
    { data: [], color: () => '#D50000' }, // Despesas
  ],
  legend: ["Receitas", "Despesas"]
};

export const useHomeContas = () => {
  const [metricas, setMetricas] = useState({
    totalAReceber: 0,
    totalAPagar: 0,
    recebidoNoMes: 0,
    pagoNoMes: 0,
    saldoDoMes: 0,
  });
  // NOVO: Estado para os dados do gráfico
  const [dadosGrafico, setDadosGrafico] = useState(DADOS_GRAFICO_INICIAL);
  const [carregando, setCarregando] = useState(true);

  const calcularMetricas = useCallback(async () => {
    setCarregando(true);
    const todasContas = await buscarTodasContas();

    const hoje = new Date();
    const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    let totalAReceber = 0;
    let totalAPagar = 0;
    let recebidoNoMes = 0;
    let pagoNoMes = 0;

    // --- NOVO: Lógica para preparar dados do gráfico (últimos 6 meses) ---
    const meses = [];
    const receitasMensais = [0, 0, 0, 0, 0, 0];
    const despesasMensais = [0, 0, 0, 0, 0, 0];
    const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({ ano: d.getFullYear(), mes: d.getMonth(), label: nomesMeses[d.getMonth()] });
    }

    for (const conta of todasContas) {
      if (conta.status !== 'PAGA' && conta.status !== 'CANCELADA') {
        const valorRestante = conta.valorTotal - conta.valorPago;
        if (conta.tipo === 'RECEBER') totalAReceber += valorRestante;
        else totalAPagar += valorRestante;
      }

      for (const mov of conta.movimentacoes) {
        const dataMov = new Date(mov.data);
        // Calcula totais do mês corrente para os widgets
        if (dataMov >= primeiroDiaDoMes && dataMov <= ultimoDiaDoMes) {
          if (conta.tipo === 'RECEBER') recebidoNoMes += mov.valor;
          else pagoNoMes += mov.valor;
        }
        
        // Agrupa as movimentações por mês para o gráfico
        for (let i = 0; i < meses.length; i++) {
          if (dataMov.getFullYear() === meses[i].ano && dataMov.getMonth() === meses[i].mes) {
            if (conta.tipo === 'RECEBER') receitasMensais[i] += mov.valor;
            else despesasMensais[i] += mov.valor;
            break;
          }
        }
      }
    }
    
    setMetricas({
      totalAReceber,
      totalAPagar,
      recebidoNoMes,
      pagoNoMes,
      saldoDoMes: recebidoNoMes - pagoNoMes,
    });
    
    // Atualiza o estado com os dados formatados para o gráfico
    setDadosGrafico({
      labels: meses.map(m => m.label),
      datasets: [
        { data: receitasMensais, color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})` },
        { data: despesasMensais, color: (opacity = 1) => `rgba(213, 0, 0, ${opacity})` },
      ],
      legend: ["Receitas", "Despesas"]
    });

    setCarregando(false);
  }, []);

useFocusEffect(
    useCallback(() => {
      calcularMetricas();
    }, [calcularMetricas])
  );

 return { metricas, dadosGrafico, carregando, recalcular: calcularMetricas };
};