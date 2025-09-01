import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { buscarTodasVendas } from '../../../api/vendas.api';

export const useRelatorioVendasPorCliente = () => {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const hoje = new Date();
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const [dataInicial, setDataInicial] = useState(primeiroDiaDoMes);
  const [dataFinal, setDataFinal] = useState(hoje);

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

    // Agrega os dados por cliente
    const clientesAgregados = {};

    vendasFiltradas.forEach(venda => {
      const id = venda.clienteId;
      if (!id) return; // Ignora vendas sem cliente associado

      if (!clientesAgregados[id]) {
        clientesAgregados[id] = {
          id: id,
          nome: venda.clienteSnapshot.nome,
          totalComprado: 0,
          quantidadeVendas: 0,
        };
      }
      clientesAgregados[id].totalComprado += venda.valorTotalVenda;
      clientesAgregados[id].quantidadeVendas += 1;
    });

    // Converte o objeto de volta para um array e ordena
    const rankingArray = Object.values(clientesAgregados);
    rankingArray.sort((a, b) => b.totalComprado - a.totalComprado);

    return rankingArray;

  }, [vendas, dataInicial, dataFinal]);

  return {
    carregando,
    ranking: dadosProcessados,
    dataInicial,
    setDataInicial,
    dataFinal,
    setDataFinal,
  };
};