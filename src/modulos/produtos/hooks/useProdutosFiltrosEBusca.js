import { useState } from 'react';
import Toast from 'react-native-toast-message';

export const useProdutosFiltrosEBusca = () => {
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState({
    nome: '',
    categoria: '',
    estoqueMinimo: '',
  });

  // Atualiza o texto de busca
  const atualizarBusca = (texto) => {
    setBusca(texto);
    setFiltros((prev) => ({ ...prev, nome: texto }));
  };

  // Atualiza os filtros
  const atualizarFiltros = (novosFiltros) => {
    const filtrosAtualizados = {
      nome: novosFiltros.nome || busca,
      categoria: novosFiltros.categoria || '',
      estoqueMinimo: novosFiltros.estoqueMinimo || '',
    };

    // Valida estoque mínimo
    if (filtrosAtualizados.estoqueMinimo && isNaN(parseInt(filtrosAtualizados.estoqueMinimo))) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'O estoque mínimo deve ser um número válido.',
      });
      return;
    }

    setFiltros(filtrosAtualizados);
    Toast.show({
      type: 'success',
      text1: 'Filtros',
      text2: 'Filtros atualizados com sucesso!',
    });
  };

  // Limpa os filtros e a busca
  const limparFiltros = () => {
    setBusca('');
    setFiltros({
      nome: '',
      categoria: '',
      estoqueMinimo: '',
    });
    Toast.show({
      type: 'info',
      text1: 'Filtros',
      text2: 'Filtros e busca limpos com sucesso.',
    });
  };

  // Retorna os filtros formatados para a API
  const obterFiltrosParaApi = () => {
    const filtrosParaApi = { ...filtros };
    if (filtrosParaApi.estoqueMinimo) {
      filtrosParaApi.estoqueMinimo = parseInt(filtrosParaApi.estoqueMinimo);
    }
    return filtrosParaApi;
  };

  return {
    busca,
    filtros,
    atualizarBusca,
    atualizarFiltros,
    limparFiltros,
    obterFiltrosParaApi,
  };
};