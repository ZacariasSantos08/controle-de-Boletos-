import { useState, useEffect, useMemo, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { buscarProdutos, inativarProduto } from '../../../api/produtos.api';
import { buscarAtributos } from '../../../api/atributos.api';
import { buscarFiltrosSalvos, salvarNovoFiltro, excluirFiltroSalvo } from '../../../api/filtros.api';
import { buscarTodasVendas } from '../../../api/vendas.api';


const ORDENACAO_PADRAO = { campo: 'nome', direcao: 'asc' };
const FILTROS_PADRAO = { status: 'Ativo' };
const LIMITE_POR_PAGINA = 20;

export const useListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtrosAtivos, setFiltrosAtivos] = useState(FILTROS_PADRAO);
  const [ordenacao, setOrdenacao] = useState(ORDENACAO_PADRAO);
  const [listasParaFiltro, setListasParaFiltro] = useState({ categorias: [], marcas: [] });
  const [modoVisualizacao, setModoVisualizacao] = useState('card');
  const [filtrosModalVisivel, setFiltrosModalVisivel] = useState(false);
  const [ordenacaoModalVisivel, setOrdenacaoModalVisivel] = useState(false);
  const [modalAtributoVisivel, setModalAtributoVisivel] = useState({ visivel: false, tipo: '' });
  const [filtrosSalvos, setFiltrosSalvos] = useState([]);
  const [atualizacaoEmTempoReal, setAtualizacaoEmTempoReal] = useState(false);
  const [salvarFiltroModalVisivel, setSalvarFiltroModalVisivel] = useState(false);
  const [carregarFiltroModalVisivel, setCarregarFiltroModalVisivel] = useState(false);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const selectionModeAtivo = itensSelecionados.length > 0;

  const buscarEFiltrar = useCallback(async (novaPagina, recarregar = false) => {
    try {
      const pageToFetch = recarregar ? 1 : novaPagina;
      if (recarregar) setCarregando(true);
      else setCarregandoMais(true);

      const { produtos: novosProdutos, total } = await buscarProdutos({
        pagina: pageToFetch,
        limite: LIMITE_POR_PAGINA,
        termoBusca,
        filtros: filtrosAtivos,
        ordenacao,
      });

      if (recarregar) {
        setProdutos(novosProdutos);
      } else {
        setProdutos(anteriores => [...anteriores, ...novosProdutos]);
      }
      setTotalProdutos(total);
      setPagina(pageToFetch);
    } catch (error) {
      console.error("Erro ao buscar e filtrar produtos:", error);
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Nao foi possivel carregar os produtos.' });
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

  // ALTERADO: A busca agora não depende mais do termoBusca para ser disparada,
  // ela será chamada manualmente ou quando os filtros mudarem.
  useEffect(() => {
    buscarEFiltrar(1, true);
  }, [filtrosAtivos, ordenacao]);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      const [dadosCategorias, dadosMarcas, dadosFiltros] = await Promise.all([
        buscarAtributos('categorias'),
        buscarAtributos('marcas'),
        buscarFiltrosSalvos(),
      ]);
      setListasParaFiltro({ categorias: dadosCategorias, marcas: dadosMarcas });
      setFiltrosSalvos(dadosFiltros);
    };
    carregarDadosIniciais();
  }, []);

  const carregarMaisProdutos = useCallback(() => {
    if (carregandoMais || produtos.length >= totalProdutos) return;
    buscarEFiltrar(pagina + 1);
  }, [carregandoMais, produtos.length, totalProdutos, pagina, buscarEFiltrar]);

  const isFiltroAtivo = useMemo(() => {
    return Object.keys(filtrosAtivos).length > 1 || (filtrosAtivos.status !== 'Ativo');
  }, [filtrosAtivos]);

  const iniciarModoSelecao = (produtoId) => setItensSelecionados([produtoId]);
  const toggleSelecao = (produtoId) => setItensSelecionados(prev => prev.includes(produtoId) ? prev.filter(id => id !== produtoId) : [...prev, produtoId]);
  const limparSelecao = () => setItensSelecionados([]);
  const selecionarTodos = () => setItensSelecionados(produtos.map(p => p.id));
  
const lidarInativarSelecionados = async () => {
    try {
      // A lógica complexa de verificação foi removida.
      // Agora apenas chamamos a API, que já contém a regra de negócio.
      await Promise.all(itensSelecionados.map(id => inativarProduto(id)));
      
      Toast.show({ type: 'success', text1: 'Sucesso', text2: `${itensSelecionados.length} produto(s) inativado(s).` });
      limparSelecao();
      await buscarEFiltrar(1, true);
    } catch (error) {
      // O erro lançado pela API (se o produto tiver vendas) será capturado aqui.
      console.error("Erro ao inativar produtos:", error);
      Toast.show({ type: 'error', text1: 'Ação Bloqueada', text2: error.message });
    }
  };

 


  const salvarFiltroAtual = async (nome) => {
    try {
        await salvarNovoFiltro(nome, filtrosAtivos);
        const novosFiltrosSalvos = await buscarFiltrosSalvos();
        setFiltrosSalvos(novosFiltrosSalvos);
        setSalvarFiltroModalVisivel(false);
    } catch(e) {
        Toast.show({ type: 'error', text1: 'Erro', text2: e.message });
    }
  };
  const carregarFiltro = (filtro) => {
    setCarregarFiltroModalVisivel(false);
    setTimeout(() => {
        setFiltrosAtivos(filtro.filtros);
    }, 300);
  };
  const excluirFiltro = async (filtroId) => {
    await excluirFiltroSalvo(filtroId);
    const novosFiltrosSalvos = await buscarFiltrosSalvos();
    setFiltrosSalvos(novosFiltrosSalvos);
  };

  return {
    carregando, atualizando, produtos, totalProdutos, termoBusca, setTermoBusca, onAtualizar, recarregar: onAtualizar,
    filtrosAtivos, setFiltrosAtivos, ordenacao, setOrdenacao, listasParaFiltro, isFiltroAtivo, modoVisualizacao, setModoVisualizacao,
    filtrosModalVisivel, setFiltrosModalVisivel, ordenacaoModalVisivel, setOrdenacaoModalVisivel, modalAtributoVisivel, setModalAtributoVisivel,
    filtrosSalvos, atualizacaoEmTempoReal, setAtualizacaoEmTempoReal, salvarFiltroModalVisivel, setSalvarFiltroModalVisivel,
    carregarFiltroModalVisivel, setCarregarFiltroModalVisivel, salvarFiltroAtual, carregarFiltro, excluirFiltro,
    selectionModeAtivo, itensSelecionados, iniciarModoSelecao, toggleSelecao, limparSelecao, selecionarTodos, 
    lidarInativarSelecionados,
    carregarMaisProdutos, carregandoMais,
    buscarEFiltrar
  };
};