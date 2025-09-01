import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_CONFIGURACOES = '@VendasApp:configuracoes';

/**
 * Salva as configurações da empresa no AsyncStorage.
 * @param {object} dados - Objeto com os dados da empresa.
 */
export const salvarConfiguracoes = async (dados) => {
  try {
    const jsonValue = JSON.stringify(dados);
    await AsyncStorage.setItem(CHAVE_CONFIGURACOES, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar configurações:", e);
    throw e;
  }
};

/**
 * Carrega as configurações da empresa do AsyncStorage.
 * @returns {Promise<object|null>} Objeto com os dados da empresa ou null.
 */
export const carregarConfiguracoes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_CONFIGURACOES);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Erro ao carregar configurações:", e);
    return null;
  }
};