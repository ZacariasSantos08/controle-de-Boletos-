import { useState, useEffect, useMemo, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { buscarClientes, inativarCliente } from '../../../api/clientes.api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ORDENACAO_PADRAO = { campo: 'nomeCompleto', direcao: 'asc' };
const FILTROS_PADRAO = { status: 'Ativo' }; // Padrão agora é buscar apenas ativos
const LIMITE_POR_PAGINA = 20;

export const useListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalClientes, setTotalClientes] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtrosAtivos, setFiltrosAtivos] = useState(FILTROS_PADRAO);
  const [ordenacao, setOrdenacao] = useState(ORDENACAO_PADRAO);
  const [filtrosModalVisivel, setFiltrosModalVisivel] = useState(false);
  const [ordenacaoModalVisivel, setOrdenacaoModalVisivel] = useState(false);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [modoVisualizacao, setModoVisualizacao] = useState('card');
  const selectionModeAtivo = itensSelecionados.length > 0;

  const buscarEFiltrar = useCallback(async (novaPagina, recarregar = false) => {
    try {
      const pageToFetch = recarregar ? 1 : novaPagina;
      recarregar ? setCarregando(true) : setCarregandoMais(true);

      const { clientes: novosClientes, total } = await buscarClientes({
        pagina: pageToFetch,
        limite: LIMITE_POR_PAGINA,
        termoBusca,
        filtros: filtrosAtivos,
        ordenacao,
      });

      if (recarregar) {
        setClientes(novosClientes);
      } else {
        setClientes(anteriores => [...anteriores, ...novosClientes]);
      }
      setTotalClientes(total);
      setPagina(pageToFetch);
    } catch (error) {
      console.error("Erro ao buscar e filtrar clientes:", error);
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar os clientes.' });
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
      setAtualizando(false);
    }
  }, [termoBusca, filtrosAtivos, ordenacao]);

  const onAtualizar = useCallback(async () => {
    setAtualizando(true);
    await buscarEFiltrar(1, true);
  }, [buscarEFiltrar]);

 useFocusEffect(
    useCallback(() => {
      buscarEFiltrar(1, true);
    }, [buscarEFiltrar])
  );

  const carregarMaisClientes = useCallback(() => {
    if (carregandoMais || clientes.length >= totalClientes) return;
    buscarEFiltrar(pagina + 1);
  }, [carregandoMais, clientes.length, totalClientes, pagina, buscarEFiltrar]);

  const isFiltroAtivo = useMemo(() => {
    return (filtrosAtivos.status !== 'Ativo' || filtrosAtivos.tipoPessoa);
  }, [filtrosAtivos]);

  const iniciarModoSelecao = (clienteId) => setItensSelecionados([clienteId]);
  const toggleSelecao = (clienteId) => setItensSelecionados(prev => prev.includes(clienteId) ? prev.filter(id => id !== clienteId) : [...prev, clienteId]);
  const limparSelecao = () => setItensSelecionados([]);
  const selecionarTodos = () => setItensSelecionados(clientes.map(p => p.id));
  
  const lidarInativarSelecionados = async () => {
    try {
      await Promise.all(itensSelecionados.map(id => inativarCliente(id)));
      Toast.show({ type: 'success', text1: 'Sucesso', text2: `${itensSelecionados.length} cliente(s) inativado(s).` });
      limparSelecao();
      await buscarEFiltrar(1, true);
    } catch (error) {
      console.error("Erro ao inativar clientes:", error);
      Toast.show({ type: 'error', text1: 'Ação Bloqueada', text2: error.message });
    }
  };

  return {
    carregando, atualizando, clientes, totalClientes, termoBusca, setTermoBusca, onAtualizar, recarregar: onAtualizar,
    filtrosAtivos, setFiltrosAtivos, ordenacao, setOrdenacao, isFiltroAtivo,
    filtrosModalVisivel, setFiltrosModalVisivel, ordenacaoModalVisivel, setOrdenacaoModalVisivel,
    selectionModeAtivo, itensSelecionados, iniciarModoSelecao, toggleSelecao, limparSelecao, selecionarTodos, lidarInativarSelecionados,
    carregarMaisClientes, carregandoMais,
    modoVisualizacao, setModoVisualizacao,
  };
};