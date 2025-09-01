import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { buscarTodasContas } from '../api/contas.api';

// Hook para gerenciar a lógica da lista de contas (a receber ou a pagar)
export const useListaContas = (tipoDeConta) => {
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  // Outros estados para filtros e ordenação podem ser adicionados aqui no futuro

  const carregarContas = useCallback(async () => {
    try {
      setCarregando(true);
      const todasContas = await buscarTodasContas();
      // Filtra as contas pelo tipo desejado ('RECEBER' ou 'PAGAR')
      const contasFiltradas = todasContas.filter(c => c.tipo === tipoDeConta);
      setContas(contasFiltradas);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar as contas.' });
    } finally {
      setCarregando(false);
    }
  }, [tipoDeConta]);

  // Recarrega os dados sempre que a tela recebe foco
  useFocusEffect(carregarContas);

  const contasProcessadas = useMemo(() => {
    let contasTemp = [...contas];

    // Lógica de busca por descrição ou nome do cliente/fornecedor
    const termo = termoBusca.toLowerCase();
    if (termo) {
      contasTemp = contasTemp.filter(conta =>
        conta.descricao.toLowerCase().includes(termo) ||
        conta.associado.nome.toLowerCase().includes(termo)
      );
    }

    // Lógica de ordenação (ex: por data de vencimento)
    contasTemp.sort((a, b) => a.dataVencimento - b.dataVencimento);

    return contasTemp;
  }, [contas, termoBusca]);

  return {
    carregando,
    contas: contasProcessadas,
    termoBusca,
    setTermoBusca,
    recarregar: carregarContas,
  };
};