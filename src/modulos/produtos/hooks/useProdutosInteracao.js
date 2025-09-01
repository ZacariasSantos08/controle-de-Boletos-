import { useCallback } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { excluirProduto } from '../../../api/produtos.api';

export const useProdutosInteracao = (navigation, hookLista) => {
  // Seleciona ou desseleciona um produto
  const selecionarProduto = useCallback((id) => {
    hookLista.lidarSelecaoItem(id);
    Toast.show({
      type: 'info',
      text1: 'Seleção',
      text2: hookLista.itensSelecionados.includes(id)
        ? 'Produto desselecionado.'
        : 'Produto selecionado.',
    });
  }, [hookLista]);

  // Navega para a tela de edição do produto
  const editarProduto = useCallback((produto) => {
    if (!produto || !produto.id) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Produto inválido para edição.',
      });
      return;
    }
    navigation.navigate('CadastroProduto', { produto });
  }, [navigation]);

  // Navega para a tela de detalhes do produto
  const verDetalhesProduto = useCallback((produto) => {
    if (!produto || !produto.id) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Produto inválido para visualização.',
      });
      return;
    }
    navigation.navigate('DetalhesProduto', { produto });
  }, [navigation]);

  // Exclui um único produto com confirmação
  const excluirProdutoUnico = useCallback((id) => {
    Alert.alert(
      'Excluir Produto',
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirProduto(id);
              hookLista.lidarExcluirSelecionados([id]); // Atualiza a lista
            } catch (e) {
              // O erro é tratado em produtos.api.js, mas podemos reforçar o feedback aqui
              Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível excluir o produto.',
              });
            }
          },
        },
      ]
    );
  }, [hookLista]);

  // Exclui múltiplos produtos com confirmação
  const excluirProdutosSelecionados = useCallback(() => {
    if (hookLista.itensSelecionados.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Seleção',
        text2: 'Nenhum produto selecionado para exclusão.',
      });
      return;
    }
    Alert.alert(
      `Excluir ${hookLista.itensSelecionados.length} produto(s)`,
      'Esta ação não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await hookLista.lidarExcluirSelecionados();
            } catch (e) {
              // O erro é tratado em useListaProdutos.js, mas reforçamos o feedback
              Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível excluir os produtos selecionados.',
              });
            }
          },
        },
      ]
    );
  }, [hookLista]);

  return {
    selecionarProduto,
    editarProduto,
    verDetalhesProduto,
    excluirProdutoUnico,
    excluirProdutosSelecionados,
  };
};