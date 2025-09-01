import AsyncStorage from '@react-native-async-storage/async-storage';
// NOVO: Importando as APIs de todos os módulos
import { buscarTodosProdutos } from './produtos.api';
import { buscarTodosClientes } from './clientes.api';
import { buscarTodosFornecedores } from './fornecedores.api';
import { buscarTodasVendas } from './vendas.api';
import { buscarTodasContas } from '../modulos/contas/api/contas.api';

const CHAVE_CONFIGURACOES = '@VendasApp:configuracoes';
// NOVO: Lista de todas as chaves do AsyncStorage que usamos no app
const TODAS_AS_CHAVES = [
  '@VendasApp:produtos',
  '@VendasApp:clientes',
  '@VendasApp:fornecedores',
  '@VendasApp:vendas',
  '@VendasApp:contas',
  '@VendasApp:configuracoes',
  // Adicione aqui outras chaves principais se forem criadas
];


export const salvarConfiguracoes = async (dados) => {
  try {
    const jsonValue = JSON.stringify(dados);
    await AsyncStorage.setItem(CHAVE_CONFIGURACOES, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar configurações:", e);
    throw e;
  }
};

export const carregarConfiguracoes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_CONFIGURACOES);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Erro ao carregar configurações:", e);
    return null;
  }
};

// NOVO: Função para exportar todos os dados do aplicativo
export const exportarTodosOsDados = async () => {
  try {
    const dadosParaBackup = {};
    
    // Usando MultiGet para ler todas as chaves de uma vez
    const paresChaveValor = await AsyncStorage.multiGet(TODAS_AS_CHAVES);
    
    paresChaveValor.forEach(([chave, valor]) => {
      if (valor) {
        // Remove o prefixo '@VendasApp:' para um arquivo mais limpo
        const chaveLimpa = chave.replace('@VendasApp:', '');
        dadosParaBackup[chaveLimpa] = JSON.parse(valor);
      }
    });

    return JSON.stringify(dadosParaBackup, null, 2); // O '2' formata o JSON para ser legível
  } catch (e) {
    console.error("Erro ao exportar dados:", e);
    throw e;
  }
};

// NOVO: Função para importar dados de um backup
export const importarDadosDoBackup = async (jsonString) => {
  try {
    const dadosImportados = JSON.parse(jsonString);
    const paresChaveValor = [];

    for (const chaveLimpa in dadosImportados) {
      if (Object.hasOwnProperty.call(dadosImportados, chaveLimpa)) {
        const chaveCompleta = `@VendasApp:${chaveLimpa}`;
        const valor = JSON.stringify(dadosImportados[chaveLimpa]);
        paresChaveValor.push([chaveCompleta, valor]);
      }
    }
    
    // Limpa todos os dados antigos antes de importar
    await AsyncStorage.multiRemove(TODAS_AS_CHAVES);
    // Salva todos os novos dados de uma vez
    await AsyncStorage.multiSet(paresChaveValor);

  } catch (e) {
    console.error("Erro ao importar dados:", e);
    throw e;
  }
};