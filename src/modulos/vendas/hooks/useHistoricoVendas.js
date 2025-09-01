import { useState, useMemo, useCallback, useEffect } from 'react';
import { buscarTodasVendas } from '../../../api/vendas.api';
import { buscarTodosClientes } from '../../../api/clientes.api';
import { buscarTodosProdutos } from '../../../api/produtos.api';
import { buscarTodosFornecedores } from '../../../api/fornecedores.api';

const ORDENACAO_PADRAO = { campo: 'dataEmissao', direcao: 'desc' };

export const useHistoricoVendas = () => {
  const [vendasOriginais, setVendasOriginais] = useState([]);
  const [listasParaFiltro, setListasParaFiltro] = useState({
    clientes: [],
    produtos: [],
    fornecedores: [],
  });
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtrosAtivos, setFiltrosAtivos] = useState({});
  const [ordenacao, setOrdenacao] = useState(ORDENACAO_PADRAO);
  const [modoVisualizacao, setModoVisualizacao] = useState('card');

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const [dadosVendas, dadosClientes, dadosProdutos, dadosFornecedores] = await Promise.all([
        buscarTodasVendas(),
        buscarTodosClientes(),
        buscarTodosProdutos(),
        buscarTodosFornecedores(),
      ]);
      setVendasOriginais(dadosVendas);
      setListasParaFiltro({ 
        clientes: dadosClientes, 
        produtos: dadosProdutos, 
        fornecedores: dadosFornecedores 
      });
    } catch (error) {
      console.error("Erro ao carregar histórico de vendas:", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const vendasProcessadas = useMemo(() => {
    let vendasTemp = [...vendasOriginais];

    // Lógica de Filtro
    if (filtrosAtivos.cliente) {
      vendasTemp = vendasTemp.filter(v => v.clienteId === filtrosAtivos.cliente.id);
    }
    if (filtrosAtivos.produto) {
      vendasTemp = vendasTemp.filter(v => v.itens.some(item => item.produtoId === filtrosAtivos.produto.id));
    }
    if (filtrosAtivos.fornecedor) {
      const produtosDoFornecedor = listasParaFiltro.produtos
        .filter(p => p.fornecedor?.id === filtrosAtivos.fornecedor.id)
        .map(p => p.id);
      vendasTemp = vendasTemp.filter(v => v.itens.some(item => produtosDoFornecedor.includes(item.produtoId)));
    }
    // CORREÇÃO: Filtro de pagamento agora verifica o array 'pagamentos'
    if (filtrosAtivos.tipoPagamento) {
      vendasTemp = vendasTemp.filter(v => v.pagamentos.some(p => p.forma === filtrosAtivos.tipoPagamento.id));
    }
    if (filtrosAtivos.dataInicial) {
      const inicioDia = new Date(filtrosAtivos.dataInicial).setHours(0, 0, 0, 0);
      vendasTemp = vendasTemp.filter(v => v.dataEmissao >= inicioDia);
    }
    if (filtrosAtivos.dataFinal) {
      const fimDia = new Date(filtrosAtivos.dataFinal).setHours(23, 59, 59, 999);
      vendasTemp = vendasTemp.filter(v => v.dataEmissao <= fimDia);
    }

    const termo = termoBusca.toLowerCase();
    if (termo) {
      vendasTemp = vendasTemp.filter(venda => 
        venda.codigoVenda.toLowerCase().includes(termo) ||
        venda.clienteSnapshot.nome.toLowerCase().includes(termo)
      );
    }
    
    vendasTemp.sort((a, b) => {
      const campoA = a[ordenacao.campo];
      const campoB = b[ordenacao.campo];
      let comparacao = 0;
      if (campoA > campoB) comparacao = 1;
      else if (campoA < campoB) comparacao = -1;
      return ordenacao.direcao === 'desc' ? comparacao * -1 : comparacao;
    });

    return vendasTemp;
  }, [vendasOriginais, termoBusca, filtrosAtivos, ordenacao, listasParaFiltro.produtos]);

  const isFiltroAtivo = Object.keys(filtrosAtivos).length > 0;

  return {
    carregando,
    vendas: vendasProcessadas,
    listasParaFiltro,
    termoBusca,
    setTermoBusca,
    filtrosAtivos,
    setFiltrosAtivos,
    ordenacao,
    setOrdenacao,
    recarregar: carregarDados,
    isFiltroAtivo,
    modoVisualizacao,
    setModoVisualizacao,
  };
};