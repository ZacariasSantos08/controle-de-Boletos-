import Toast from 'react-native-toast-message';

const API_URL = 'https://viacep.com.br/ws/';

/**
 * Busca um endereço completo a partir de um CEP.
 * @param {string} cep - O CEP a ser consultado (apenas números).
 * @returns {Promise<object|null>} Um objeto com os dados do endereço ou null se não for encontrado.
 */
export const buscarEnderecoPorCEP = async (cep) => {
  const cepLimpo = String(cep || '').replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    // Não é um erro, o usuário pode não ter terminado de digitar
    return null;
  }

  try {
    const response = await fetch(`${API_URL}${cepLimpo}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro na resposta da API de CEP.');
    }

    const data = await response.json();

    if (data.erro) {
      Toast.show({ type: 'error', text1: 'CEP não encontrado' });
      return null;
    }

    // Retorna um objeto padronizado com os dados que precisamos
    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    };

  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    Toast.show({ type: 'error', text1: 'Erro de Rede', text2: 'Não foi possível buscar o CEP.' });
    return null;
  }
};