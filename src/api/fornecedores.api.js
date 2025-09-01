import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CHAVE_FORNECEDORES = '@VendasApp:fornecedores';
const CHAVE_CONTADOR_FORNECEDOR = '@VendasApp:contadorFornecedor';

const gerarProximoCodigoFornecedor = async () => {
  try {
    let contadorAtual = await AsyncStorage.getItem(CHAVE_CONTADOR_FORNECEDOR);
    let proximoNumero = 1;
    if (contadorAtual !== null) {
      proximoNumero = parseInt(contadorAtual, 10) + 1;
    }
    await AsyncStorage.setItem(CHAVE_CONTADOR_FORNECEDOR, String(proximoNumero));
    return `FOR-${String(proximoNumero).padStart(3, '0')}`;
  } catch (e) {
    console.error('Erro ao gerar codigo do fornecedor:', e);
    return `FOR-ERR-${Date.now()}`;
  }
};

export const buscarTodosFornecedores = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_FORNECEDORES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao buscar fornecedores:', e);
    return [];
  }
};

export const buscarFornecedores = async ({ pagina = 1, limite = 20, termoBusca = '', ordenacao, filtros = {} }) => {
  try {
    let todosOsFornecedores = await buscarTodosFornecedores();

    const statusFiltro = filtros.status || 'Ativo';
    if (statusFiltro !== 'Todos') {
      todosOsFornecedores = todosOsFornecedores.filter(f => f.status === statusFiltro);
    }

    const termo = termoBusca.toLowerCase();
    if (termo) {
        todosOsFornecedores = todosOsFornecedores.filter(f => {
            const razaoSocial = f.razaoSocial?.toLowerCase() || '';
            const nomeFantasia = f.nomeFantasia?.toLowerCase() || '';
            const cnpj = (f.cnpj || '').replace(/\D/g, '');
            const nomeCompleto = f.nomeCompleto?.toLowerCase() || '';
            const cpf = (f.cpf || '').replace(/\D/g, '');
            return razaoSocial.includes(termo) || nomeFantasia.includes(termo) || cnpj.includes(termo) || nomeCompleto.includes(termo) || cpf.includes(termo);
        });
    }

    if (ordenacao && ordenacao.campo) {
        todosOsFornecedores.sort((a, b) => {
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

    const totalDeFornecedores = todosOsFornecedores.length;
    const indiceInicial = (pagina - 1) * limite;
    const fornecedoresDaPagina = todosOsFornecedores.slice(indiceInicial, indiceInicial + limite);

    return {
      fornecedores: fornecedoresDaPagina,
      total: totalDeFornecedores,
    };

  } catch (e) {
    console.error('Erro ao buscar fornecedores paginados:', e);
    return { fornecedores: [], total: 0 };
  }
};

export const salvarFornecedor = async (dadosDoFormulario) => {
  try {
    const fornecedoresAtuais = await buscarTodosFornecedores();

    const { cnpj, cpf, email } = dadosDoFormulario;
    if (cnpj && fornecedoresAtuais.some(f => f.cnpj === cnpj)) {
      throw new Error('Ja existe um fornecedor com este CNPJ.');
    }
    if (cpf && fornecedoresAtuais.some(f => f.cpf === cpf)) {
      throw new Error('Ja existe um fornecedor com este CPF.');
    }
    if (email && email.trim() && fornecedoresAtuais.some(f => f.email?.toLowerCase() === email.toLowerCase())) {
      throw new Error('Ja existe um fornecedor com este e-mail.');
    }

    const novoFornecedor = {
      ...dadosDoFormulario,
      id: uuidv4(),
      codigoFornecedor: await gerarProximoCodigoFornecedor(),
      dataCriacao: Date.now(),
      dataAtualizacao: Date.now(),
      status: 'Ativo',
    };
    const novaLista = [...fornecedoresAtuais, novoFornecedor];
    await AsyncStorage.setItem(CHAVE_FORNECEDORES, JSON.stringify(novaLista));
    return novoFornecedor;
  } catch (e) {
    console.error('Erro ao salvar fornecedor:', e);
    throw e;
  }
};

export const atualizarFornecedor = async (fornecedorAtualizado) => {
  try {
    const fornecedoresAtuais = await buscarTodosFornecedores();

    const { id, cnpj, cpf, email } = fornecedorAtualizado;
    if (cnpj && fornecedoresAtuais.some(f => f.id !== id && f.cnpj === cnpj)) {
      throw new Error('Ja existe outro fornecedor com este CNPJ.');
    }
    if (cpf && fornecedoresAtuais.some(f => f.id !== id && f.cpf === cpf)) {
      throw new Error('Ja existe outro fornecedor com este CPF.');
    }
    if (email && email.trim() && fornecedoresAtuais.some(f => f.id !== id && f.email?.toLowerCase() === email.toLowerCase())) {
      throw new Error('Ja existe outro fornecedor com este e-mail.');
    }

    const novaLista = fornecedoresAtuais.map(fornecedor => {
      if (fornecedor.id === fornecedorAtualizado.id) {
        return { ...fornecedor, ...fornecedorAtualizado, dataAtualizacao: Date.now() };
      }
      return fornecedor;
    });
    await AsyncStorage.setItem(CHAVE_FORNECEDORES, JSON.stringify(novaLista));
  } catch (e) {
    console.error('Erro ao atualizar fornecedor:', e);
    throw e;
  }
};

export const inativarFornecedor = async (id) => {
  try {
    const fornecedoresAtuais = await buscarTodosFornecedores();
    const novaLista = fornecedoresAtuais.map(f => {
        if(f.id === id) {
            return { ...f, status: 'Inativo', dataAtualizacao: Date.now() };
        }
        return f;
    });
    await AsyncStorage.setItem(CHAVE_FORNECEDORES, JSON.stringify(novaLista));
  } catch (e) {
    console.error('Erro ao inativar fornecedor:', e);
    throw e;
  }
};