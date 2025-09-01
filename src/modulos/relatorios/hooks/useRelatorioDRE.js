import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { buscarTodasVendas } from '../../../api/vendas.api';
import { buscarTodasContas } from '../../contas/api/contas.api';

export const useRelatorioDRE = () => {
  const [vendas, setVendas] = useState([]);
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const hoje = new Date();
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const [dataInicial, setDataInicial] = useState(primeiroDiaDoMes);
  const [dataFinal, setDataFinal] = useState(hoje);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    const [dadosVendas, dadosContas] = await Promise.all([
      buscarTodasVendas(),
      buscarTodasContas(),
    ]);
    setVendas(dadosVendas);
    setContas(dadosContas);
    setCarregando(false);
  }, []);

  useFocusEffect(carregarDados);

  const dadosDRE = useMemo(() => {
    const inicio = dataInicial ? new Date(dataInicial).setHours(0, 0, 0, 0) : null;
    const fim = dataFinal ? new Date(dataFinal).setHours(23, 59, 59, 999) : null;

    const vendasFiltradas = vendas.filter(venda => {
      const dataVenda = new Date(venda.dataEmissao);
      if (inicio && dataVenda < inicio) return false;
      if (fim && dataVenda > fim) return false;
      return true;
    });

    const receitaBruta = vendasFiltradas.reduce((acc, v) => acc + v.subtotalProdutos, 0);
    
    const custoProdutosVendidos = vendasFiltradas
      .flatMap(v => v.itens)
      .reduce((acc, item) => acc + (item.custoUnitarioSnapshot || 0) * item.quantidade, 0);

    const lucroBruto = receitaBruta - custoProdutosVendidos;

    const despesasOperacionais = contas
      .filter(c => c.tipo === 'PAGAR' && c.origem.tipo === 'DESPESA_MANUAL')
      .filter(c => {
        const dataConta = new Date(c.dataCriacao);
        if (inicio && dataConta < inicio) return false;
        if (fim && dataConta > fim) return false;
        return true;
      })
      .reduce((acc, c) => acc + c.valorTotal, 0);

    const resultadoLiquido = lucroBruto - despesasOperacionais;

    return {
      receitaBruta,
      custoProdutosVendidos,
      lucroBruto,
      despesasOperacionais,
      resultadoLiquido,
    };
  }, [vendas, contas, dataInicial, dataFinal]);

  return {
    carregando,
    ...dadosDRE,
    dataInicial,
    setDataInicial,
    dataFinal,
    setDataFinal,
  };
};