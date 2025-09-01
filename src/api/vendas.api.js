import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { buscarTodosProdutos, ajustarEstoqueMultiplosProdutos } from './produtos.api';
// CORREÇÃO: O caminho da importação foi ajustado para apontar para a pasta do módulo 'contas'
import { criarContaReceberDaVenda, cancelarContasPorOrigemVenda } from '../modulos/contas/api/contas.api';

const CHAVE_PRODUTOS = '@VendasApp:produtos';
const CHAVE_VENDAS = '@VendasApp:vendas';
const CHAVE_CONTADOR_VENDA = '@VendasApp:contadorVenda';

const gerarProximoCodigoVenda = async () => {
  try {
    let contadorAtual = await AsyncStorage.getItem(CHAVE_CONTADOR_VENDA);
    let proximoNumero = 1;
    if (contadorAtual !== null) {
      proximoNumero = parseInt(contadorAtual, 10) + 1;
    }
    await AsyncStorage.setItem(CHAVE_CONTADOR_VENDA, String(proximoNumero));
    return `VENDA-${String(proximoNumero).padStart(3, '0')}`;
  } catch (e) {
    console.error('Erro ao gerar codigo da venda:', e);
    return `VENDA-ERR-${Date.now()}`;
  }
};

export const buscarTodasVendas = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_VENDAS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao buscar vendas:', e);
    return [];
  }
};

export const buscarVendaPorId = async (vendaId) => {
  try {
    const todasVendas = await buscarTodasVendas();
    return todasVendas.find(v => v.id === vendaId) || null;
  } catch (e) {
    console.error(`Erro ao buscar venda ${vendaId}:`, e);
    return null;
  }
};

export const salvarVenda = async (dadosDaVenda) => {
  try {
    const vendasAtuais = await buscarTodasVendas();
    const todosOsProdutos = await buscarTodosProdutos();
    const mapaDeProdutos = new Map(todosOsProdutos.map(p => [p.id, { ...p }]));

    const itensNormalizados = dadosDaVenda.itens.map(item => {
      const produtoId = item.id;
      if (mapaDeProdutos.has(produtoId)) {
        const produtoParaAtualizar = mapaDeProdutos.get(produtoId);
        const estoqueAtual = Number(produtoParaAtualizar.estoqueDisponivel || 0);
        produtoParaAtualizar.estoqueDisponivel = Math.max(0, estoqueAtual - (item.quantidade || 0));
        produtoParaAtualizar.dataAtualizacao = Date.now();
        mapaDeProdutos.set(produtoId, produtoParaAtualizar);
      }
      return {
        produtoId: item.id,
        descricaoSnapshot: item.nome,
        valorUnitarioSnapshot: item.valorVenda,
        custoUnitarioSnapshot: item.valorCusto || 0,
        quantidade: item.quantidade,
        tipoDesconto: item.tipoDesconto,
        valorDescontoItem: item.valorDesconto,
      };
    });

    const subtotalProdutos = itensNormalizados.reduce((acc, it) => acc + (it.valorUnitarioSnapshot * it.quantidade), 0);
    const valorDesconto = dadosDaVenda.desconto;
    const valorFrete = dadosDaVenda.frete || 0;
    const valorTotalVenda = subtotalProdutos - valorDesconto + valorFrete;

    const clienteSnapshot = dadosDaVenda.cliente ? {
      id: dadosDaVenda.cliente.id,
      nome: dadosDaVenda.cliente.tipoPessoa === 'Fisica' 
        ? dadosDaVenda.cliente.detalhesPessoaFisica?.nomeCompleto 
        : (dadosDaVenda.cliente.detalhesPessoaJuridica?.nomeFantasia || dadosDaVenda.cliente.detalhesPessoaJuridica?.razaoSocial),
      endereco: dadosDaVenda.cliente.endereco || null,
    } : { id: null, nome: 'Cliente nao informado', endereco: null };

    const vendaPersistida = {
      id: uuidv4(),
      codigoVenda: await gerarProximoCodigoVenda(),
      dataEmissao: Date.now(),
      clienteId: clienteSnapshot.id,
      clienteSnapshot,
      itens: itensNormalizados,
      subtotalProdutos,
      valorFrete,
      valorDesconto: valorDesconto,
      valorTotalVenda,
      pagamentos: dadosDaVenda.pagamentos,
      dataEntrega: dadosDaVenda.dataEntrega || null,
      observacoes: dadosDaVenda.observacoes || '',
      status: 'Concluida',
    };

    const novaListaVendas = [...vendasAtuais, vendaPersistida];
    const jsonVendas = JSON.stringify(novaListaVendas);
    await AsyncStorage.setItem(CHAVE_VENDAS, jsonVendas);

    const listaProdutosAtualizada = Array.from(mapaDeProdutos.values());
    const jsonProdutos = JSON.stringify(listaProdutosAtualizada);
    await AsyncStorage.setItem(CHAVE_PRODUTOS, jsonProdutos);

    for (const pagamento of dadosDaVenda.pagamentos) {
      if (pagamento.forma === 'A Prazo (Promissória)') {
        await criarContaReceberDaVenda(vendaPersistida, pagamento.valor, pagamento.parcelas);
      }
    }

    return vendaPersistida;
  } catch (e) {
    console.error('Erro ao salvar venda ou abater estoque:', e);
    throw e;
  }
};

export const cancelarVenda = async (vendaId) => {
  try {
    const todasVendas = await buscarTodasVendas();
    let vendaParaCancelar = null;
    const outrasVendas = [];

    todasVendas.forEach(v => {
      if (v.id === vendaId) {
        vendaParaCancelar = v;
      } else {
        outrasVendas.push(v);
      }
    });

    if (!vendaParaCancelar) {
      throw new Error("Venda não encontrada para cancelar.");
    }
    if (vendaParaCancelar.status === 'Cancelada') {
      throw new Error("Esta venda já foi cancelada.");
    }

    const itensParaEstorno = vendaParaCancelar.itens.map(item => ({
      produtoId: item.produtoId,
      quantidade: item.quantidade,
    }));
    await ajustarEstoqueMultiplosProdutos(itensParaEstorno);

    await cancelarContasPorOrigemVenda(vendaId);

    vendaParaCancelar.status = 'Cancelada';
    const novaListaVendas = [...outrasVendas, vendaParaCancelar];
    await AsyncStorage.setItem(CHAVE_VENDAS, JSON.stringify(novaListaVendas));

    return vendaParaCancelar;
  } catch (e) {
    console.error(`Erro ao cancelar a venda ${vendaId}:`, e);
    throw e;
  }
};

export const calcularTotalVendidoHoje = async () => {
  const todasAsVendas = await buscarTodasVendas();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const total = todasAsVendas
    .filter(venda => venda.status !== 'Cancelada' && new Date(venda.dataEmissao) >= hoje)
    .reduce((acc, venda) => acc + venda.valorTotalVenda, 0);

  return total;
};

export const calcularTicketMedio = async () => {
  const vendasValidas = (await buscarTodasVendas()).filter(venda => venda.status !== 'Cancelada');
  
  if (vendasValidas.length === 0) {
    return 0;
  }
  const totalVendas = vendasValidas.reduce((acc, venda) => acc + venda.valorTotalVenda, 0);
  return totalVendas / vendasValidas.length;
};