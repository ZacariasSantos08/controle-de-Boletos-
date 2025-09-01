import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { buscarTodasContas } from '../api/contas.api';

export const useFluxoDeCaixa = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // NOVO: Estados para controlar os filtros
  const [filtroDataInicial, setFiltroDataInicial] = useState(null);
  const [filtroDataFinal, setFiltroDataFinal] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('TODOS'); // 'TODOS', 'ENTRADA', 'SAIDA'

  const carregarMovimentacoes = useCallback(async () => {
    setCarregando(true);
    const todasContas = await buscarTodasContas();
    
    const todasAsMovimentacoes = todasContas.flatMap(conta => 
      conta.movimentacoes.map(mov => ({
        ...mov,
        idConta: conta.id,
        tipoConta: conta.tipo,
        descricaoConta: conta.descricao,
      }))
    );
    
    todasAsMovimentacoes.sort((a, b) => b.data - a.data);

    setMovimentacoes(todasAsMovimentacoes);
    setCarregando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarMovimentacoes();
    }, [carregarMovimentacoes])
  );
  // ALTERADO: 'useMemo' agora aplica os filtros e calcula os totais do período
  const dadosProcessados = useMemo(() => {
    let movimentacoesFiltradas = [...movimentacoes];
    
    // Filtro por tipo
    if (filtroTipo === 'ENTRADA') {
      movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.tipoConta === 'RECEBER');
    } else if (filtroTipo === 'SAIDA') {
      movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.tipoConta === 'PAGAR');
    }

    // Filtro por data inicial
    if (filtroDataInicial) {
      const inicioDoDia = new Date(filtroDataInicial).setHours(0, 0, 0, 0);
      movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.data >= inicioDoDia);
    }
    
    // Filtro por data final
    if (filtroDataFinal) {
      const fimDoDia = new Date(filtroDataFinal).setHours(23, 59, 59, 999);
      movimentacoesFiltradas = movimentacoesFiltradas.filter(m => m.data <= fimDoDia);
    }

    // Calcula os totais com base nos dados JÁ filtrados
    const totalEntradas = movimentacoesFiltradas
      .filter(m => m.tipoConta === 'RECEBER')
      .reduce((acc, mov) => acc + mov.valor, 0);
      
    const totalSaidas = movimentacoesFiltradas
      .filter(m => m.tipoConta === 'PAGAR')
      .reduce((acc, mov) => acc + mov.valor, 0);

    return {
      movimentacoes: movimentacoesFiltradas,
      totalEntradas,
      totalSaidas,
      saldoPeriodo: totalEntradas - totalSaidas,
    };
  }, [movimentacoes, filtroDataInicial, filtroDataFinal, filtroTipo]);

  return { 
    carregando,
    ...dadosProcessados, // Retorna as movimentações filtradas e os totais
    // Retorna os estados e setters para a UI controlar os filtros
    filtroDataInicial, 
    setFiltroDataInicial,
    filtroDataFinal,
    setFiltroDataFinal,
    filtroTipo,
    setFiltroTipo
  };
};