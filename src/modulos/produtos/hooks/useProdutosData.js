import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';
import { salvarProduto, atualizarProduto } from '../../../api/produtos.api';
import { formatarMoeda, desformatarParaCentavos } from '../../../utilitarios/formatadores';

export const useProdutosData = () => {
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Inicializa os dados do formulário para um novo produto ou edição
  const inicializarFormulario = useCallback((produto = null) => {
    setProdutoEmEdicao({
      id: produto?.id || null,
      nome: produto?.nome || '',
      codigoProduto: produto?.codigoProduto || '',
      categoria: produto?.categoria || '',
      precoCusto: produto?.precoCusto ? formatarMoeda(produto.precoCusto * 100) : '',
      precoVenda: produto?.precoVenda ? formatarMoeda(produto.precoVenda * 100) : '',
      estoqueDisponivel: produto?.estoqueDisponivel?.toString() || '0',
      estoqueMinimo: produto?.estoqueMinimo?.toString() || '0',
      dimensoes: {
        altura: produto?.dimensoes?.altura?.toString() || '',
        largura: produto?.dimensoes?.largura?.toString() || '',
        comprimento: produto?.dimensoes?.comprimento?.toString() || '',
        peso: produto?.dimensoes?.peso?.toString() || '',
      },
      detalhesAdicionais: produto?.detalhesAdicionais || '',
      imagens: produto?.imagens || [],
    });
  }, []);

  // Salva ou atualiza um produto
  const salvarOuAtualizarProduto = useCallback(async (dadosFormulario, navigation) => {
    try {
      setCarregando(true);

      // Validações
      if (!dadosFormulario.nome || dadosFormulario.nome.trim() === '') {
        throw new Error('O nome do produto é obrigatório.');
      }
      if (!dadosFormulario.precoVenda || desformatarParaCentavos(dadosFormulario.precoVenda) <= 0) {
        throw new Error('O preço de venda deve ser maior que zero.');
      }
      if (!dadosFormulario.estoqueDisponivel || parseInt(dadosFormulario.estoqueDisponivel) < 0) {
        throw new Error('O estoque disponível não pode ser negativo.');
      }

      // Formata os dados para salvar
      const dadosParaSalvar = {
        ...dadosFormulario,
        precoCusto: dadosFormulario.precoCusto
          ? desformatarParaCentavos(dadosFormulario.precoCusto) / 100
          : 0,
        precoVenda: desformatarParaCentavos(dadosFormulario.precoVenda) / 100,
        estoqueDisponivel: parseInt(dadosFormulario.estoqueDisponivel) || 0,
        estoqueMinimo: parseInt(dadosFormulario.estoqueMinimo) || 0,
        dimensoes: {
          altura: parseFloat(dadosFormulario.dimensoes.altura) || 0,
          largura: parseFloat(dadosFormulario.dimensoes.largura) || 0,
          comprimento: parseFloat(dadosFormulario.dimensoes.comprimento) || 0,
          peso: parseFloat(dadosFormulario.dimensoes.peso) || 0,
        },
      };

      // Salva ou atualiza
      if (dadosFormulario.id) {
        await atualizarProduto(dadosParaSalvar);
      } else {
        await salvarProduto(dadosParaSalvar);
      }

      // Navega de volta após salvar
      navigation.goBack();
    } catch (e) {
      console.error('Erro ao salvar/atualizar produto:', e);
      throw e; // O erro é tratado na tela
    } finally {
      setCarregando(false);
    }
  }, []);

  // Limpa o formulário
  const limparFormulario = useCallback(() => {
    setProdutoEmEdicao(null);
    Toast.show({
      type: 'info',
      text1: 'Formulário',
      text2: 'Formulário limpo com sucesso.',
    });
  }, []);

  return {
    produtoEmEdicao,
    carregando,
    inicializarFormulario,
    salvarOuAtualizarProduto,
    limparFormulario,
  };
};