import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CHAVE_BASE = '@VendasApp:atributos_';

export const buscarAtributos = async (tipo) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${CHAVE_BASE}${tipo}`);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error(`Erro ao buscar atributos do tipo ${tipo}:`, e);
    return [];
  }
};

export const salvarAtributo = async (tipo, novoAtributo) => {
  try {
    const atributosAtuais = await buscarAtributos(tipo);
    const nomeNormalizado = novoAtributo.nome.toLowerCase();

    if (atributosAtuais.some(attr => attr.nome.toLowerCase() === nomeNormalizado)) {
      throw new Error(`Ja existe um(a) ${tipo.slice(0, -1)} com este nome.`);
    }

    const itemComId = { ...novoAtributo, id: uuidv4() };
    const novaLista = [...atributosAtuais, itemComId];
    const jsonValue = JSON.stringify(novaLista);
    await AsyncStorage.setItem(`${CHAVE_BASE}${tipo}`, jsonValue);
    return itemComId;
  } catch (e) {
    console.error(`Erro ao salvar atributo do tipo ${tipo}:`, e);
    throw e;
  }
};

// NOVO: Função para atualizar um atributo existente.
export const atualizarAtributo = async (tipo, atributoAtualizado) => {
  try {
    const atributosAtuais = await buscarAtributos(tipo);
    const nomeNormalizado = atributoAtualizado.nome.toLowerCase();

    if (atributosAtuais.some(attr => attr.id !== atributoAtualizado.id && attr.nome.toLowerCase() === nomeNormalizado)) {
       throw new Error(`Ja existe outro(a) ${tipo.slice(0, -1)} com este nome.`);
    }

    const novaLista = atributosAtuais.map(attr => 
      attr.id === atributoAtualizado.id ? atributoAtualizado : attr
    );

    const jsonValue = JSON.stringify(novaLista);
    await AsyncStorage.setItem(`${CHAVE_BASE}${tipo}`, jsonValue);
    return atributoAtualizado;
  } catch(e) {
    console.error(`Erro ao atualizar atributo do tipo ${tipo}:`, e);
    throw e;
  }
};

export const excluirAtributo = async (tipo, id) => {
  try {
    const atributosAtuais = await buscarAtributos(tipo);
    const novaLista = atributosAtuais.filter(attr => attr.id !== id);
    const jsonValue = JSON.stringify(novaLista);
    await AsyncStorage.setItem(`${CHAVE_BASE}${tipo}`, jsonValue);
  } catch (e) {
    console.error(`Erro ao excluir atributo do tipo ${tipo}:`, e);
    throw e;
  }
};