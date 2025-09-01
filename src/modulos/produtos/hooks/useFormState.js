import { useState, useEffect } from 'react';

const estadoInicial = {
  nome: '', categoria: null, tipoUnidade: null, marca: null, colecao: null,
  fornecedor: null,
  codigoDeBarras: '', observacao: '', valorCusto: '', valorVenda: '', markup: '',
  pesoLiquido: '', pesoBruto: '', altura: '', largura: '', profundidade: '',
  estoqueDisponivel: '', estoqueMinimo: '', imagens: [],
  mostrarDetalhes: false,
  detalhes: [],
  // NOVO: Adiciona o status ao estado inicial do formulário
  status: 'Ativo',
};

export const useFormState = (produtoParaEditar) => {
  const [form, setForm] = useState(estadoInicial);
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (produtoParaEditar) {
      setForm({
        // ... (resto dos campos)
        nome: produtoParaEditar.nome || '',
        categoria: produtoParaEditar.categoria || null,
        tipoUnidade: produtoParaEditar.tipoUnidade || null,
        marca: produtoParaEditar.marca || null,
        fornecedor: produtoParaEditar.fornecedor || null,
        codigoDeBarras: produtoParaEditar.codigoDeBarras || '',
        observacao: produtoParaEditar.observacao || '',
        valorCusto: produtoParaEditar.valorCusto,
        valorVenda: produtoParaEditar.valorVenda,
        markup: produtoParaEditar.markup,
        pesoLiquido: produtoParaEditar.dimensoes?.pesoLiquido,
        pesoBruto: produtoParaEditar.dimensoes?.pesoBruto,
        altura: produtoParaEditar.dimensoes?.altura,
        largura: produtoParaEditar.dimensoes?.largura,
        profundidade: produtoParaEditar.dimensoes?.profundidade,
        estoqueDisponivel: produtoParaEditar.estoqueDisponivel,
        estoqueMinimo: produtoParaEditar.estoqueMinimo,
        imagens: produtoParaEditar.imagens || [],
        mostrarDetalhes: (produtoParaEditar.detalhes || []).length > 0,
        detalhes: produtoParaEditar.detalhes || [],
        // NOVO: Carrega o status do produto que está sendo editado
        status: produtoParaEditar.status || 'Ativo',
      });
    } else {
      setForm(estadoInicial); // Garante que o formulário é resetado ao sair do modo de edição
    }
  }, [produtoParaEditar]);

  const setFormField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (erros[field]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[field];
        return novosErros;
      });
    }
  };
  
  // A função de validação com Yup pode ser adicionada aqui no futuro
  const validarFormulario = () => ({ isValid: true });

  return { form, setForm, erros, setFormField, validarFormulario };
};