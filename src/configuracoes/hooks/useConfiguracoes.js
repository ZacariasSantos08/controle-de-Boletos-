import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { carregarConfiguracoes, salvarConfiguracoes as salvarApi, exportarTodosOsDados, importarDadosDoBackup } from '../../api/configuracoes.api';

const ESTADO_INICIAL = {
  nomeEmpresa: '',
  proprietario: '',
  endereco: '',
  logoUri: null,
};

export const useConfiguracoes = () => {
  const [config, setConfig] = useState(ESTADO_INICIAL);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    const dadosSalvos = await carregarConfiguracoes();
    if (dadosSalvos) {
      setConfig(dadosSalvos);
    }
    setCarregando(false);
  }, []);

  useFocusEffect(carregarDados);

  const setValorCampo = (campo, valor) => {
    setConfig(prev => ({ ...prev, [campo]: valor }));
  };

  const salvarAlteracoes = async () => {
    setSalvando(true);
    try {
      await salvarApi(config);
      Toast.show({type: 'success', text1: 'Sucesso', text2: 'Configurações salvas!'});
    } catch (error) {
      Toast.show({type: 'error', text1: 'Erro', text2: 'Não foi possível salvar as configurações.'});
    } finally {
      setSalvando(false);
    }
  };

  // NOVO: Função para o fluxo de exportação
  const exportarDados = async () => {
    try {
      Toast.show({ type: 'info', text1: 'Preparando backup...' });
      const dadosJson = await exportarTodosOsDados();
      const uri = FileSystem.documentDirectory + 'vendasapp_backup.json';
      await FileSystem.writeAsStringAsync(uri, dadosJson);
      
      await Sharing.shareAsync(uri, { dialogTitle: 'Salvar backup do VendasApp' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível gerar o backup.' });
    }
  };

  // NOVO: Função para o fluxo de importação
  const importarDados = async () => {
    Alert.alert(
      "Atenção: Restauração de Backup",
      "Este processo irá substituir TODOS os dados atuais do aplicativo. Esta ação não pode ser desfeita. Deseja continuar?",
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Continuar', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const resultado = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
              
              if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
                Toast.show({ type: 'info', text1: 'Restaurando dados...', text2: 'Aguarde um momento.' });
                const uri = resultado.assets[0].uri;
                const jsonString = await FileSystem.readAsStringAsync(uri);
                await importarDadosDoBackup(jsonString);
                Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Dados restaurados. Recarregue o app.' });
                // Idealmente, o app seria reiniciado aqui. Por enquanto, recarregamos os dados da tela.
                carregarDados();
              }
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Erro', text2: 'O arquivo de backup é inválido ou está corrompido.' });
            }
          }
        },
      ]
    );
  };

  return { config, carregando, salvando, setValorCampo, salvarAlteracoes, exportarDados, importarDados };
};