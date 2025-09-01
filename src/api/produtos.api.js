import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { buscarTodasVendas } from './vendas.api';


const CHAVE_PRODUTOS = '@VendasApp:produtos';
const CHAVE_CONTADOR_PRODUTO = '@VendasApp:contadorProduto';

const gerarProximoCodigoProduto = async () => {
  try {
    let contadorAtual = await AsyncStorage.getItem(CHAVE_CONTADOR_PRODUTO);
    let proximoNumero = 1;
    if (contadorAtual !== null) {
      proximoNumero = parseInt(contadorAtual, 10) + 1;
    }
    await AsyncStorage.setItem(CHAVE_CONTADOR_PRODUTO, String(proximoNumero));
    return `PROD-${String(proximoNumero).padStart(3, '0')}`;
  } catch (e) {
    console.error('Erro ao gerar codigo do produto:', e);
    return `PROD-ERR-${Date.now()}`;
  }
};

export const buscarTodosProdutos = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_PRODUTOS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao buscar produtos:', e);
    return [];
  }
};

export const buscarProdutos = async ({ pagina = 1, limite = 20, termoBusca = '', filtros = {}, ordenacao }) => {
  try {
    let todosOsProdutos = await buscarTodosProdutos();
    
    const statusFiltro = filtros.status || 'Ativo';
    if (statusFiltro !== 'Todos') {
      todosOsProdutos = todosOsProdutos.filter(produto => produto.status === statusFiltro);
    }
    
    const termo = termoBusca.toLowerCase();
    if (termo) {
      todosOsProdutos = todosOsProdutos.filter(produto => 
        (produto.nome || '').toLowerCase().includes(termo) ||
        (produto.codigoProduto || '').toLowerCase().includes(termo)
      );
    }

    if (ordenacao && ordenacao.campo) {
        todosOsProdutos.sort((a, b) => {
            const campoA = a[ordenacao.campo];
            const campoB = b[ordenacao.campo];
            
            if (typeof campoA === 'string' && typeof campoB === 'string') {
                return ordenacao.direcao === 'asc' ? campoA.localeCompare(campoB) : campoB.localeCompare(campoA);
            }
            if (campoA > campoB) return ordenacao.direcao === 'asc' ? 1 : -1;
            if (campoA < campoB) return ordenacao.direcao === 'asc' ? -1 : 1;
            return 0;
        });
    }

    if (filtros.statusEstoque && filtros.statusEstoque !== 'todos') {
        switch(filtros.statusEstoque) {
            case 'positivo':
              todosOsProdutos = todosOsProdutos.filter(p => p.estoqueDisponivel > 0);
              break;
            case 'baixo':
              todosOsProdutos = todosOsProdutos.filter(p => p.estoqueDisponivel > 0 && p.estoqueMinimo > 0 && p.estoqueDisponivel <= p.estoqueMinimo);
              break;
            case 'zerado':
              todosOsProdutos = todosOsProdutos.filter(p => !p.estoqueDisponivel || p.estoqueDisponivel <= 0);
              break;
            default:
              break;
          }
    }

    const totalDeProdutos = todosOsProdutos.length;
    const indiceInicial = (pagina - 1) * limite;
    const produtosDaPagina = todosOsProdutos.slice(indiceInicial, indiceInicial + limite);

    return {
      produtos: produtosDaPagina,
      total: totalDeProdutos,
    };
  } catch (e) {
    console.error('Erro ao buscar produtos paginados:', e);
    return { produtos: [], total: 0 };
  }
};

export const salvarProduto = async (dadosDoFormulario) => {
  try {
    const produtosAtuais = await buscarTodosProdutos();
    const novoProduto = {
      ...dadosDoFormulario,
      id: uuidv4(),
      codigoProduto: await gerarProximoCodigoProduto(),
      dataCriacao: Date.now(),
      dataAtualizacao: Date.now(),
      status: 'Ativo',
    };
    const novaLista = [...produtosAtuais, novoProduto];
    await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(novaLista));
    // ALTERADO: Adiciona o retorno do novo produto
    return novoProduto;
  } catch (e) {
    console.error('Erro ao salvar produto:', e);
    throw e;
  }
};

export const atualizarProduto = async (produtoAtualizado) => {
  try {
    const produtosAtuais = await buscarTodosProdutos();
    const novaLista = produtosAtuais.map(produto => {
      if (produto.id === produtoAtualizado.id) {
        return { ...produto, ...produtoAtualizado, dataAtualizacao: Date.now() };
      }
      return produto;
    });
    await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(novaLista));
  } catch (e) {
    console.error('Erro ao atualizar produto:', e);
    throw e;
  }
};

export const inativarProduto = async (id) => {
  try {
    // 2. Lógica de verificação movida para a API
    const todasVendas = await buscarTodasVendas();
    const produtoTemVendas = todasVendas.some(venda => 
      venda.itens.some(item => item.produtoId === id)
    );

    if (produtoTemVendas) {
      throw new Error("Este produto não pode ser inativado pois possui vendas associadas.");
    }
    // Fim da verificação

    const produtosAtuais = await buscarTodosProdutos();
    let produtoEncontrado = false;
    const novaLista = produtosAtuais.map(produto => {
        if (produto.id === id) {
            produtoEncontrado = true;
            return { ...produto, status: 'Inativo', dataAtualizacao: Date.now() };
        }
        return produto;
    });

    if (!produtoEncontrado) throw new Error("Produto não encontrado para inativar.");

    await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(novaLista));
  } catch (e) {
    console.error('Erro ao inativar produto:', e);
    throw e; // Re-lança o erro para o hook/tela tratar
  }
};

export const ajustarEstoqueMultiplosProdutos = async (itensAjuste) => {
  try {
    const produtosAtuais = await buscarTodosProdutos();
    const mapaDeProdutos = new Map(produtosAtuais.map(p => [p.id, { ...p }]));

    itensAjuste.forEach(item => {
      if (mapaDeProdutos.has(item.produtoId)) {
        const produtoParaAtualizar = mapaDeProdutos.get(item.produtoId);
        const estoqueAtual = Number(produtoParaAtualizar.estoqueDisponivel || 0);
        produtoParaAtualizar.estoqueDisponivel = estoqueAtual + item.quantidade;
        produtoParaAtualizar.dataAtualizacao = Date.now();
        mapaDeProdutos.set(item.produtoId, produtoParaAtualizar);
      }
    });

    const listaProdutosAtualizada = Array.from(mapaDeProdutos.values());
    await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(listaProdutosAtualizada));
  } catch (e) {
    console.error('Erro ao ajustar estoque de múltiplos produtos:', e);
    throw e;
  }
};