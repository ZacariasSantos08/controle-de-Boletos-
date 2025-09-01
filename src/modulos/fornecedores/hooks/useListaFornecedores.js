import { useState, useEffect, useMemo, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { buscarFornecedores, inativarFornecedor } from '../../../api/fornecedores.api';

const ORDENACAO_PADRAO = { campo: 'razaoSocial', direcao: 'asc' };
const FILTROS_PADRAO = { status: 'Ativo' };
const LIMITE_POR_PAGINA = 20;

export const useListaFornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalFornecedores, setTotalFornecedores] = useState(0);
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

      const { fornecedores: novosFornecedores, total } = await buscarFornecedores({
        pagina: pageToFetch,
        limite: LIMITE_POR_PAGINA,
        termoBusca,
        filtros: filtrosAtivos,
        ordenacao,
      });

      if (recarregar) {
        setFornecedores(novosFornecedores);
      } else {
        setFornecedores(anteriores => [...anteriores, ...novosFornecedores]);
      }
      setTotalFornecedores(total);
      setPagina(pageToFetch);
    } catch (error) {
      console.error("Erro ao buscar e filtrar fornecedores:", error);
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar os fornecedores.' });
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

  useEffect(() => {
    buscarEFiltrar(1, true);
  }, [filtrosAtivos, ordenacao]);

  const carregarMaisFornecedores = useCallback(() => {
    if (carregandoMais || fornecedores.length >= totalFornecedores) return;
    buscarEFiltrar(pagina + 1);
  }, [carregandoMais, fornecedores.length, totalFornecedores, pagina, buscarEFiltrar]);

  const isFiltroAtivo = useMemo(() => {
    return (filtrosAtivos.status !== 'Ativo' || filtrosAtivos.tipoPessoa);
  }, [filtrosAtivos]);

  const iniciarModoSelecao = (id) => setItensSelecionados([id]);
  const toggleSelecao = (id) => setItensSelecionados(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const limparSelecao = () => setItensSelecionados([]);
  const selecionarTodos = () => setItensSelecionados(fornecedores.map(f => f.id));
  
  const lidarInativarSelecionados = async () => {
    try {
      await Promise.all(itensSelecionados.map(id => inativarFornecedor(id)));
      Toast.show({ type: 'success', text1: 'Sucesso', text2: `${itensSelecionados.length} fornecedor(es) inativado(s).` });
      limparSelecao();
      await buscarEFiltrar(1, true);
    } catch (error) {
      console.error("Erro ao inativar fornecedores:", error);
      Toast.show({ type: 'error', text1: 'Erro', text2: error.message });
    }
  };

  return {
    carregando, atualizando, fornecedores, totalFornecedores, termoBusca, setTermoBusca, onAtualizar, recarregar: onAtualizar, buscarEFiltrar,
    filtrosAtivos, setFiltrosAtivos, ordenacao, setOrdenacao, isFiltroAtivo,
    filtrosModalVisivel, setFiltrosModalVisivel, ordenacaoModalVisivel, setOrdenacaoModalVisivel,
    selectionModeAtivo, itensSelecionados, iniciarModoSelecao, toggleSelecao, limparSelecao, selecionarTodos, lidarInativarSelecionados,
    carregarMaisFornecedores, carregandoMais,
    modoVisualizacao, setModoVisualizacao,
  };
};