import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { buscarTodasVendas } from './vendas.api';

const CHAVE_CLIENTES = '@VendasApp:clientes';
const CHAVE_CONTADOR_CLIENTE = '@VendasApp:contadorCliente';

const gerarProximoCodigoCliente = async () => {
  try {
    let contadorAtual = await AsyncStorage.getItem(CHAVE_CONTADOR_CLIENTE);
    let proximoNumero = 1;
    if (contadorAtual !== null) {
      proximoNumero = parseInt(contadorAtual, 10) + 1;
    }
    await AsyncStorage.setItem(CHAVE_CONTADOR_CLIENTE, String(proximoNumero));
    return `CLI-${String(proximoNumero).padStart(3, '0')}`;
  } catch (e) {
    console.error('Erro ao gerar codigo do cliente:', e);
    return `CLI-ERR-${Date.now()}`;
  }
};

export const buscarTodosClientes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_CLIENTES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao buscar clientes:', e);
    return [];
  }
};

// ALTERADO: A busca agora aceita um filtro de status
export const buscarClientes = async ({ pagina = 1, limite = 20, termoBusca = '', ordenacao, filtros = {} }) => {
  try {
    let todosOsClientes = await buscarTodosClientes();
    
    // FILTRO DE STATUS: Por padrão, mostra apenas ativos se nenhum filtro for passado
    const statusFiltro = filtros.status || 'Ativo';
    if (statusFiltro !== 'Todos') {
      todosOsClientes = todosOsClientes.filter(cliente => cliente.status === statusFiltro);
    }
    
    const termo = termoBusca.toLowerCase();
    if (termo) {
        todosOsClientes = todosOsClientes.filter(cliente => {
            const nome = (cliente.tipoPessoa === 'Fisica' ? cliente.detalhesPessoaFisica?.nomeCompleto : (cliente.detalhesPessoaJuridica?.nomeFantasia || cliente.detalhesPessoaJuridica?.razaoSocial) || '').toLowerCase();
            const doc = (cliente.detalhesPessoaFisica?.cpf || cliente.detalhesPessoaJuridica?.cnpj || '').replace(/\D/g, '');
            return nome.includes(termo) || doc.includes(termo);
        });
    }

    if (ordenacao && ordenacao.campo) {
        todosOsClientes.sort((a, b) => {
            const getCampoValor = (c) => {
                if (ordenacao.campo === 'nomeCompleto') {
                    return c.tipoPessoa === 'Fisica' ? c.detalhesPessoaFisica?.nomeCompleto : (c.detalhesPessoaJuridica?.nomeFantasia || c.detalhesPessoaJuridica?.razaoSocial);
                }
                return c[ordenacao.campo];
            };
            const campoA = getCampoValor(a);
            const campoB = getCampoValor(b);

            if (typeof campoA === 'string' && typeof campoB === 'string') {
                return ordenacao.direcao === 'asc' ? campoA.localeCompare(campoB) : campoB.localeCompare(campoA);
            }
            if (campoA > campoB) return ordenacao.direcao === 'asc' ? 1 : -1;
            if (campoA < campoB) return ordenacao.direcao === 'asc' ? -1 : 1;
            return 0;
        });
    }

    const totalDeClientes = todosOsClientes.length;
    const indiceInicial = (pagina - 1) * limite;
    const clientesDaPagina = todosOsClientes.slice(indiceInicial, indiceInicial + limite);

    return {
      clientes: clientesDaPagina,
      total: totalDeClientes,
    };
  } catch (e) {
    console.error('Erro ao buscar clientes paginados:', e);
    return { clientes: [], total: 0 };
  }
};

export const salvarCliente = async (dadosDoFormulario) => {
  try {
    const clientesAtuais = await buscarTodosClientes();

    const { tipoPessoa, cpf, cnpj, email } = dadosDoFormulario;
    if (tipoPessoa === 'Fisica' && cpf && clientesAtuais.some(c => c.detalhesPessoaFisica?.cpf === cpf)) {
      throw new Error('Ja existe um cliente com este CPF.');
    }
    if (tipoPessoa === 'Juridica' && cnpj && clientesAtuais.some(c => c.detalhesPessoaJuridica?.cnpj === cnpj)) {
      throw new Error('Ja existe um cliente com este CNPJ.');
    }
    if (email && email.trim() && clientesAtuais.some(c => c.email?.toLowerCase() === email.toLowerCase())) {
      throw new Error('Ja existe um cliente com este e-mail.');
    }

    const novoCliente = {
      id: uuidv4(),
      codigoCliente: await gerarProximoCodigoCliente(),
      clienteDesde: Date.now(),
      dataAtualizacao: Date.now(),
      tipoPessoa: dadosDoFormulario.tipoPessoa,
      status: dadosDoFormulario.status || 'Ativo',
      email: dadosDoFormulario.email,
      telefones: dadosDoFormulario.telefones || [],
      endereco: dadosDoFormulario.endereco || null,
      detalhesPessoaFisica: tipoPessoa === 'Fisica' ? {
        nomeCompleto: dadosDoFormulario.nomeCompleto,
        cpf: dadosDoFormulario.cpf,
      } : null,
      detalhesPessoaJuridica: tipoPessoa === 'Juridica' ? {
        razaoSocial: dadosDoFormulario.razaoSocial,
        nomeFantasia: dadosDoFormulario.nomeFantasia,
        cnpj: dadosDoFormulario.cnpj,
      } : null,
    };

    const novaLista = [...clientesAtuais, novoCliente];
    await AsyncStorage.setItem(CHAVE_CLIENTES, JSON.stringify(novaLista));
    return novoCliente;
  } catch (e) {
    console.error('Erro ao salvar cliente:', e);
    throw e;
  }
};

export const atualizarCliente = async (clienteAtualizado) => {
  try {
    const clientesAtuais = await buscarTodosClientes();
    const { id, tipoPessoa, cpf, cnpj, email } = clienteAtualizado;

    if (tipoPessoa === 'Fisica' && cpf && clientesAtuais.some(c => c.id !== id && c.detalhesPessoaFisica?.cpf === cpf)) {
      throw new Error('Ja existe outro cliente com este CPF.');
    }
    if (tipoPessoa === 'Juridica' && cnpj && clientesAtuais.some(c => c.id !== id && c.detalhesPessoaJuridica?.cnpj === cnpj)) {
      throw new Error('Ja existe outro cliente com este CNPJ.');
    }
    if (email && email.trim() && clientesAtuais.some(c => c.id !== id && c.email?.toLowerCase() === email.toLowerCase())) {
      throw new Error('Ja existe outro cliente com este e-mail.');
    }

    const novaLista = clientesAtuais.map(cliente => {
      if (cliente.id === id) {
        return {
          ...cliente,
          ...clienteAtualizado,
          dataAtualizacao: Date.now(),
        };
      }
      return cliente;
    });

    await AsyncStorage.setItem(CHAVE_CLIENTES, JSON.stringify(novaLista));
  } catch (e) {
    console.error('Erro ao atualizar cliente:', e);
    throw e;
  }
};

// ALTERADO: A função agora inativa o cliente, mas mantém a verificação de segurança.
export const inativarCliente = async (id) => {
  try {
    const todasVendas = await buscarTodasVendas();
    const temVendas = todasVendas.some(venda => venda.clienteId === id);

    if (temVendas) {
      throw new Error('Este cliente não pode ser inativado pois possui vendas associadas no histórico.');
    }

    const clientesAtuais = await buscarTodosClientes();
    let clienteEncontrado = false;
    const novaLista = clientesAtuais.map(cliente => {
      if (cliente.id === id) {
        clienteEncontrado = true;
        return { ...cliente, status: 'Inativo', dataAtualizacao: Date.now() };
      }
      return cliente;
    });

    if (!clienteEncontrado) throw new Error("Cliente não encontrado para inativar.");

    await AsyncStorage.setItem(CHAVE_CLIENTES, JSON.stringify(novaLista));
  } catch (e) {
    console.error('Erro ao inativar cliente:', e);
    throw e;
  }
};