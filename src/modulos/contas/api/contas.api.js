import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CHAVE_CONTAS = '@VendasApp:contas';

export const buscarTodasContas = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_CONTAS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao buscar contas:', e);
    return [];
  }
};

export const buscarContaPorId = async (contaId) => {
  try {
    const todasContas = await buscarTodasContas();
    const contaEncontrada = todasContas.find(c => c.id === contaId);
    return contaEncontrada || null;
  } catch (e) {
    console.error(`Erro ao buscar conta com ID ${contaId}:`, e);
    return null;
  }
};

export const salvarNovaConta = async (dadosConta) => {
  try {
    const contasAtuais = await buscarTodasContas();
    const novaConta = {
      ...dadosConta,
      id: uuidv4(),
      dataCriacao: Date.now(),
    };

    const novaLista = [...contasAtuais, novaConta];
    await AsyncStorage.setItem(CHAVE_CONTAS, JSON.stringify(novaLista));
    return novaConta;
  } catch (e) {
    console.error('Erro ao salvar nova conta:', e);
    throw e;
  }
};

export const criarContaReceberDaVenda = async (venda, valorAPrazo, numeroDeParcelas = 1) => {
  if (!venda || !venda.clienteSnapshot) {
    throw new Error("Dados da venda inválidos para gerar contas a receber.");
  }

  const parcelas = parseInt(numeroDeParcelas) || 1;
  const valorTotalEmCentavos = Math.round(valorAPrazo * 100);
  const valorBaseParcelaEmCentavos = Math.floor(valorTotalEmCentavos / parcelas);
  const resto = valorTotalEmCentavos % parcelas;

  for (let i = 0; i < parcelas; i++) {
    const dataVencimento = new Date();
    dataVencimento.setDate(1); 
    dataVencimento.setMonth(dataVencimento.getMonth() + (i + 1)); 

    let valorDaParcelaEmCentavos = valorBaseParcelaEmCentavos;
    if (i === 0) {
      valorDaParcelaEmCentavos += resto;
    }

    const novaConta = {
      tipo: 'RECEBER',
      descricao: `Parcela ${i + 1}/${parcelas} - Venda ${venda.codigoVenda}`,
      valorTotal: valorDaParcelaEmCentavos / 100,
      valorPago: 0,
      status: 'ABERTA',
      dataVencimento: dataVencimento.getTime(),
      dataPagamento: null,
      associado: {
        tipo: 'CLIENTE',
        id: venda.clienteId,
        nome: venda.clienteSnapshot.nome,
      },
      origem: {
        tipo: 'VENDA',
        id: venda.id,
        codigo: venda.codigoVenda,
      },
      movimentacoes: [],
    };

    await salvarNovaConta(novaConta);
    console.log(`Parcela ${i + 1}/${parcelas} criada para a venda ${venda.codigoVenda}`);
  }
};

export const atualizarConta = async (contaAtualizada) => {
  try {
    const contasAtuais = await buscarTodasContas();
    const novaLista = contasAtuais.map(conta => 
      conta.id === contaAtualizada.id ? contaAtualizada : conta
    );
    await AsyncStorage.setItem(CHAVE_CONTAS, JSON.stringify(novaLista));
  } catch (e) {
    console.error(`Erro ao atualizar conta ${contaAtualizada.id}:`, e);
    throw e;
  }
};

export const registrarPagamentoConta = async (contaId, valorPago, formaPagamento) => {
  try {
    const conta = await buscarContaPorId(contaId);
    if (!conta) {
      throw new Error("Conta não encontrada.");
    }

    const novoMovimento = {
      id: uuidv4(),
      data: Date.now(),
      valor: valorPago,
      forma: formaPagamento,
    };

    conta.movimentacoes.push(novoMovimento);
    conta.valorPago += valorPago;

    if (conta.valorPago >= conta.valorTotal - 0.001) {
      conta.status = 'PAGA';
      conta.dataPagamento = Date.now();
    }

    await atualizarConta(conta);
    return conta;
  } catch (e) {
    console.error(`Erro ao registrar pagamento na conta ${contaId}:`, e);
    throw e;
  }
};

export const criarLancamentoManual = async (dados) => {
  const { tipo, descricao, valor, dataVencimento } = dados;

  if (!tipo || !descricao || !valor || !dataVencimento) {
    throw new Error("Todos os campos são obrigatórios para o lançamento manual.");
  }

  const novaConta = {
    tipo: tipo,
    descricao: descricao,
    valorTotal: valor,
    valorPago: 0,
    status: 'ABERTA',
    dataVencimento: dataVencimento,
    dataPagamento: null,
    associado: null,
    origem: {
      tipo: tipo === 'RECEBER' ? 'RECEITA_MANUAL' : 'DESPESA_MANUAL',
      id: null,
      codigo: 'Manual',
    },
    movimentacoes: [],
  };

  await salvarNovaConta(novaConta);
  console.log(`Lançamento manual '${descricao}' criado com sucesso.`);
};

export const cancelarContasPorOrigemVenda = async (vendaId) => {
  try {
    const contasAtuais = await buscarTodasContas();
    let contasModificadas = false;

    const novaLista = contasAtuais.map(conta => {
      if (conta.origem?.tipo === 'VENDA' && conta.origem?.id === vendaId) {
        contasModificadas = true;
        return { ...conta, status: 'CANCELADA' };
      }
      return conta;
    });

    if (contasModificadas) {
      await AsyncStorage.setItem(CHAVE_CONTAS, JSON.stringify(novaLista));
    }
  } catch (e) {
    console.error(`Erro ao cancelar contas da venda ${vendaId}:`, e);
    throw e;
  }
};