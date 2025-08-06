import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';

/**
 * Abre o seletor de arquivos para o usuário escolher um backup JSON.
 * Lê, valida e retorna o conteúdo do arquivo.
 * @returns {Promise<Array|null>} Uma lista de boletos do backup ou null em caso de falha/cancelamento.
 */
export const selecionarElerBackup = async () => {
  try {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
    });

    if (resultado.canceled) {
      return null; // Usuário cancelou a seleção
    }

    if (!resultado.assets || resultado.assets.length === 0) {
        Toast.show({ type: 'error', text1: 'Erro', text2: 'Nenhum arquivo foi selecionado.' });
        return null;
    }

    const uri = resultado.assets[0].uri;
    const conteudoJson = await FileSystem.readAsStringAsync(uri);
    const dados = JSON.parse(conteudoJson);

    // Validação simples para garantir que é um array
    if (!Array.isArray(dados)) {
      Toast.show({ type: 'error', text1: 'Arquivo Inválido', text2: 'O arquivo de backup não é válido.' });
      return null;
    }
    
    // Validação mais detalhada (opcional, mas bom ter)
    if (dados.length > 0 && (!dados[0].id || !dados[0].valor || !dados[0].vencimento)) {
        Toast.show({ type: 'error', text1: 'Arquivo Inválido', text2: 'A estrutura dos dados no backup é inválida.' });
        return null;
    }

    return dados;

  } catch (error) {
    console.error("Erro ao selecionar ou ler o backup:", error);
    Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível processar o arquivo de backup.' });
    return null;
  }
};