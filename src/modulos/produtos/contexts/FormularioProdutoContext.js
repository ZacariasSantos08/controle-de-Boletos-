import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { salvarProduto, atualizarProduto } from '../../../api/produtos.api';
import { buscarTodosFornecedores } from '../../../api/fornecedores.api';
import { useFormState } from '../hooks/useFormState';
import { useAtributos } from '../hooks/useAtributos';
import { useModais } from '../hooks/useModais';
import { desformatarParaCentavos } from '../../../utilitarios/formatadores';

const FormularioProdutoContext = createContext({});

export const FormularioProdutoProvider = ({ children, produtoParaEditar, navigation, route }) => {
  const modoEdicao = !!produtoParaEditar;
  const [salvando, setSalvando] = useState(false);
  
  const scrollViewRef = useRef(null);
  const cardRefs = useRef({});

  const { form, erros, setFormField, validarFormulario } = useFormState(produtoParaEditar);
  const { listas, lidarSalvarNovoAtributo, lidarExcluirAtributo } = useAtributos();
  const { modalSelecao, setModalSelecao, modalCriacao, setModalCriacao, abrirModalCriacao } = useModais();

  const [listaFornecedores, setListaFornecedores] = useState([]);

  const carregarFornecedores = useCallback(async () => {
    const dados = await buscarTodosFornecedores();
    setListaFornecedores(dados.filter(f => f.status === 'Ativo'));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.fornecedorSelecionado) {
        setFormField('fornecedor', route.params.fornecedorSelecionado);
        navigation.setParams({ fornecedorSelecionado: null });
      }
    }, [route?.params?.fornecedorSelecionado])
  );

  useFocusEffect(
    useCallback(() => {
      carregarFornecedores();
    }, [carregarFornecedores])
  );

  const adicionarDetalhe = () => {
    setFormField('detalhes', [...form.detalhes, { nome: '', valor: '' }]);
  };

  const removerDetalhe = (index) => {
    setFormField('detalhes', form.detalhes.filter((_, i) => i !== index));
  };

  const atualizarDetalhe = (index, campo, valor) => {
    const novosDetalhes = [...form.detalhes];
    novosDetalhes[index][campo] = valor;
    setFormField('detalhes', novosDetalhes);
  };
  
  const lidarSelecionarAtributo = (item) => {
    const { tipo } = modalSelecao;
    let nomeDoCampo;

    switch (tipo) {
      case 'categorias': nomeDoCampo = 'categoria'; break;
      case 'tiposUnidade': nomeDoCampo = 'tipoUnidade'; break;
      case 'marcas': nomeDoCampo = 'marca'; break;
      case 'colecoes': nomeDoCampo = 'colecao'; break;
      case 'fornecedores': nomeDoCampo = 'fornecedor'; break;
      default: return;
    }
    
    setFormField(nomeDoCampo, item);
    setModalSelecao({ visivel: false, tipo: null, busca: '' });
  };
  
  const lidarAbrirCriacao = () => {
    if (modalSelecao.tipo === 'fornecedores') {
      setModalSelecao({ visivel: false, tipo: null });
      navigation.navigate('Fornecedores', { 
        screen: 'CadastroFornecedor',
        params: { origin: 'CadastroProduto' }
      });
    } else {
      abrirModalCriacao();
    }
  };

  const executarSalvarNovoAtributo = async (novoAtributo) => {
    const itemSalvo = await lidarSalvarNovoAtributo(modalCriacao.tipo, novoAtributo);
    setModalCriacao({ visivel: false, tipo: null });
    lidarSelecionarAtributo(itemSalvo);
  };
  
  const executarExcluirAtributo = (item) => {
    lidarExcluirAtributo(modalSelecao.tipo, item);
  };

  const lidarComSalvarProduto = async () => {
    const { isValid, firstErrorField } = {isValid: true};
    if (!isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const erroMsg = erros[firstErrorField] || 'Por favor, corrija os campos destacados.';
      Toast.show({ type: 'error', text1: 'Ops!', text2: erroMsg });
      
      const ref = cardRefs.current[firstErrorField];
      if (ref && scrollViewRef.current) {
        ref.measureLayout(
          scrollViewRef.current.getInnerViewNode().getNativeHandle(),
          (x, y) => {
            scrollViewRef.current.scrollTo({ y: y - 10, animated: true });
          }
        );
      }
      return;
    }

    setSalvando(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const detalhesValidos = form.detalhes.filter(d => d.nome.trim() && d.valor.trim());
    
    const dadosDoFormulario = {
      nome: form.nome,
      status: form.status,
      categoria: form.categoria,
      tipoUnidade: form.tipoUnidade,
      marca: form.marca,
      fornecedor: form.fornecedor || null,
      codigoDeBarras: form.codigoDeBarras,
      observacao: form.observacao,
      imagens: form.imagens,
      valorCusto: desformatarParaCentavos(form.valorCusto) / 100,
      valorVenda: desformatarParaCentavos(form.valorVenda) / 100,
      markup: desformatarParaCentavos(form.markup) / 100,
      estoqueDisponivel: parseInt(desformatarParaCentavos(form.estoqueDisponivel) / 100) || 0,
      estoqueMinimo: parseInt(desformatarParaCentavos(form.estoqueMinimo) / 100) || 0,
      dimensoes: {
        pesoLiquido: desformatarParaCentavos(form.pesoLiquido) / 100,
        pesoBruto: desformatarParaCentavos(form.pesoBruto) / 100,
        altura: desformatarParaCentavos(form.altura) / 100,
        largura: desformatarParaCentavos(form.largura) / 100,
        profundidade: desformatarParaCentavos(form.profundidade) / 100,
      },
      detalhes: detalhesValidos,
    };

    try {
      if (modoEdicao) {
        await atualizarProduto({ ...produtoParaEditar, ...dadosDoFormulario });
        Toast.show({ type: 'success', text1: 'Sucesso!', text2: `Produto atualizado com sucesso.` });
        navigation.goBack();
      } else {
        const produtoSalvo = await salvarProduto(dadosDoFormulario);
        Toast.show({ type: 'success', text1: 'Sucesso!', text2: `Produto salvo com sucesso.` });
        navigation.replace('CadastroProduto', { produtoParaEditar: produtoSalvo });
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: 'error', text1: 'Erro ao Salvar', text2: 'Não foi possível salvar o produto.' });
    } finally {
      setSalvando(false);
    }
  };

  const value = {
    form, erros, setFormField, salvando, modoEdicao, navigation, scrollViewRef, cardRefs,
    listas: { ...listas, fornecedores: listaFornecedores },
    modalSelecao, setModalSelecao, modalCriacao, setModalCriacao,
    lidarSelecionarAtributo,
    lidarExcluirAtributo: executarExcluirAtributo,
    lidarAbrirCriacao,
    lidarSalvarNovoAtributo: executarSalvarNovoAtributo,
    lidarComSalvarProduto,
    adicionarDetalhe,
    removerDetalhe,
    atualizarDetalhe,
  };

  return (
    <FormularioProdutoContext.Provider value={value}>
      {children}
    </FormularioProdutoContext.Provider>
  );
};

export const useFormularioProduto = () => useContext(FormularioProdutoContext);