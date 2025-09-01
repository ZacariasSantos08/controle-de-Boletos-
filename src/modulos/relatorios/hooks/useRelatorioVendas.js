import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { buscarTodasVendas } from '../../../api/vendas.api';

export const useRelatorioVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Define o período padrão como o mês atual
  const hoje = new Date();
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const [dataInicial, setDataInicial] = useState(primeiroDiaDoMes);
  const [dataFinal, setDataFinal] = useState(ultimoDiaDoMes);

  const carregarVendas = useCallback(async () => {
    setCarregando(true);
    const todasVendas = await buscarTodasVendas();
    setVendas(todasVendas);
    setCarregando(false);
  }, []);

  useFocusEffect(carregarVendas);

  const dadosProcessados = useMemo(() => {
    const inicio = dataInicial ? new Date(dataInicial).setHours(0, 0, 0, 0) : null;
    const fim = dataFinal ? new Date(dataFinal).setHours(23, 59, 59, 999) : null;

    const vendasFiltradas = vendas.filter(venda => {
      const dataVenda = new Date(venda.dataEmissao);
      if (inicio && dataVenda < inicio) return false;
      if (fim && dataVenda > fim) return false;
      return true;
    });

    // Calcula as métricas com base nas vendas filtradas
    const totalVendido = vendasFiltradas.reduce((acc, v) => acc + v.valorTotalVenda, 0);
    const totalDescontos = vendasFiltradas.reduce((acc, v) => acc + v.descontoTotal, 0);
    const numeroDeVendas = vendasFiltradas.length;
    const ticketMedio = numeroDeVendas > 0 ? totalVendido / numeroDeVendas : 0;

    return {
      vendasFiltradas,
      totalVendido,
      totalDescontos,
      numeroDeVendas,
      ticketMedio,
    };
  }, [vendas, dataInicial, dataFinal]);

  return {
    carregando,
    ...dadosProcessados,
    dataInicial,
    setDataInicial,
    dataFinal,
    setDataFinal,
  };
};