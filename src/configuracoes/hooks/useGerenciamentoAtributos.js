import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { 
  buscarAtributos, 
  salvarAtributo as salvarApi,
  atualizarAtributo as atualizarApi,
  excluirAtributo as excluirApi
} from '../../api/atributos.api';

export const useGerenciamentoAtributos = () => {
  const [atributos, setAtributos] = useState({ categorias: [], marcas: [] });
  const [carregando, setCarregando] = useState(true);
  const [modalState, setModalState] = useState({ visivel: false, tipo: null, item: null });

  const carregarTodosAtributos = useCallback(async () => {
    setCarregando(true);
    const [categorias, marcas] = await Promise.all([
      buscarAtributos('categorias'),
      buscarAtributos('marcas'),
    ]);
    setAtributos({ categorias, marcas });
    setCarregando(false);
  }, []);

  useFocusEffect(carregarTodosAtributos);

  const abrirModal = (tipo, item = null) => {
    setModalState({ visivel: true, tipo, item });
  };

  const fecharModal = () => {
    setModalState({ visivel: false, tipo: null, item: null });
  };

  const salvarAtributo = async (tipo, item) => {
    try {
      if (item.id) { // Editando
        await atualizarApi(tipo, item);
        Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Atributo atualizado.' });
      } else { // Criando
        await salvarApi(tipo, item);
        Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Atributo criado.' });
      }
      fecharModal();
      await carregarTodosAtributos(); // Recarrega a lista
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const excluirAtributo = (tipo, item) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${item.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            await excluirApi(tipo, item.id);
            Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Atributo excluído.' });
            await carregarTodosAtributos();
          }
        },
      ]
    );
  };

  return { 
    atributos, 
    carregando, 
    modalState, 
    abrirModal, 
    fecharModal, 
    salvarAtributo, 
    excluirAtributo 
  };
};