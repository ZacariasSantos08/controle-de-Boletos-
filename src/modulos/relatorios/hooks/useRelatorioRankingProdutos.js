import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { buscarTodasVendas } from '../../../api/vendas.api';

export const useRelatorioRankingProdutos = () => {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const hoje = new Date();
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const [dataInicial, setDataInicial] = useState(primeiroDiaDoMes);
  const [dataFinal, setDataFinal] = useState(hoje);
  const [rankingPor, setRankingPor] = useState('VALOR'); // 'VALOR' ou 'QUANTIDADE'

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

    // Agrega os dados dos produtos a partir dos itens das vendas filtradas
    const produtosAgregados = {};

    vendasFiltradas.forEach(venda => {
      venda.itens.forEach(item => {
        const id = item.produtoId;
        if (!produtosAgregados[id]) {
          produtosAgregados[id] = {
            id: id,
            nome: item.descricaoSnapshot,
            quantidadeVendida: 0,
            valorTotalVendido: 0,
          };
        }
        produtosAgregados[id].quantidadeVendida += item.quantidade;
        produtosAgregados[id].valorTotalVendido += item.quantidade * item.valorUnitarioSnapshot;
      });
    });

    // Converte o objeto de volta para um array
    const rankingArray = Object.values(produtosAgregados);

    // Ordena o array com base no critério selecionado
    if (rankingPor === 'VALOR') {
      rankingArray.sort((a, b) => b.valorTotalVendido - a.valorTotalVendido);
    } else { // QUANTIDADE
      rankingArray.sort((a, b) => b.quantidadeVendida - a.quantidadeVendida);
    }

    return rankingArray;

  }, [vendas, dataInicial, dataFinal, rankingPor]);

  return {
    carregando,
    ranking: dadosProcessados,
    dataInicial,
    setDataInicial,
    dataFinal,
    setDataFinal,
    rankingPor,
    setRankingPor,
  };
};