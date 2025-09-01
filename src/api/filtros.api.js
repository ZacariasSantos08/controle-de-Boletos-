import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CHAVE_FILTROS = '@VendasApp:filtros_produtos';

/**
 * Busca todos os filtros de produtos salvos.
 * @returns {Promise<Array>} Um array de filtros salvos.
 */
export const buscarFiltrosSalvos = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_FILTROS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao buscar filtros salvos:', e);
    return [];
  }
};

/**
 * Salva um novo conjunto de filtros.
 * @param {string} nome - O nome do filtro.
 * @param {object} filtros - O objeto de filtros a ser salvo.
 * @throws {Error} Se ja existir um filtro com o mesmo nome.
 */
export const salvarNovoFiltro = async (nome, filtros) => {
  try {
    const filtrosAtuais = await buscarFiltrosSalvos();
    
    if (filtrosAtuais.some(f => f.nome.toLowerCase() === nome.toLowerCase())) {
        throw new Error('Ja existe um filtro salvo com este nome.');
    }

    const novoFiltro = {
      id: uuidv4(),
      nome,
      filtros,
    };
    const novaLista = [...filtrosAtuais, novoFiltro];
    const jsonValue = JSON.stringify(novaLista);
    await AsyncStorage.setItem(CHAVE_FILTROS, jsonValue);
  } catch (e) {
    console.error('Erro ao salvar novo filtro:', e);
    throw e;
  }
};

/**
 * Exclui um filtro salvo pelo seu ID.
 * @param {string} id - O ID do filtro a ser excluido.
 */
export const excluirFiltroSalvo = async (id) => {
  try {
    const filtrosAtuais = await buscarFiltrosSalvos();
    const novaLista = filtrosAtuais.filter(filtro => filtro.id !== id);
    const jsonValue = JSON.stringify(novaLista);
    await AsyncStorage.setItem(CHAVE_FILTROS, jsonValue);
  } catch (e) {
    console.error('Erro ao excluir filtro salvo:', e);
  }
};