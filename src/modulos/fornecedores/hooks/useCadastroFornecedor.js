import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { salvarFornecedor, atualizarFornecedor } from '../../../api/fornecedores.api';
import { fornecedorSchema } from '../../../validations/fornecedor.schema';
import { buscarEnderecoPorCEP } from '../../../api/cep.api';

export const useCadastroFornecedor = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    const fornecedorParaEditar = route.params?.fornecedorParaEditar;
    const onGoBackCallback = route.params?.onGoBack;
    const modoEdicao = !!fornecedorParaEditar;

    const [form, setForm] = useState({ tipoPessoa: 'Juridica', status: 'Ativo' });
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);

    const refs = {
        razaoSocial: useRef(null),
        nomeFantasia: useRef(null),
        cnpj: useRef(null),
        nomeCompleto: useRef(null),
        cpf: useRef(null),
        email: useRef(null),
        telefone: useRef(null),
        cep: useRef(null),
        logradouro: useRef(null),
        numero: useRef(null),
        complemento: useRef(null),
        bairro: useRef(null),
        cidade: useRef(null),
        estado: useRef(null),
        observacoes: useRef(null),
    };

    useEffect(() => {
        if (modoEdicao && fornecedorParaEditar) {
            setForm({
                tipoPessoa: fornecedorParaEditar.tipoPessoa || 'Juridica',
                status: fornecedorParaEditar.status || 'Ativo',
                razaoSocial: fornecedorParaEditar.razaoSocial || '',
                nomeFantasia: fornecedorParaEditar.nomeFantasia || '',
                cnpj: fornecedorParaEditar.cnpj || '',
                nomeCompleto: fornecedorParaEditar.nomeCompleto || '',
                cpf: fornecedorParaEditar.cpf || '',
                email: fornecedorParaEditar.email || '',
                telefone: fornecedorParaEditar.telefone || '',
                observacoes: fornecedorParaEditar.observacoes || '',
                cep: fornecedorParaEditar.endereco?.cep || '',
                logradouro: fornecedorParaEditar.endereco?.logradouro || '',
                numero: fornecedorParaEditar.endereco?.numero || '',
                complemento: fornecedorParaEditar.endereco?.complemento || '',
                bairro: fornecedorParaEditar.endereco?.bairro || '',
                cidade: fornecedorParaEditar.endereco?.cidade || '',
                estado: fornecedorParaEditar.endereco?.estado || '',
            });
        }
    }, [modoEdicao, fornecedorParaEditar]);
    
    const handleChange = (campo, valor) => {
        setForm(prev => ({ ...prev, [campo]: valor }));
        if (erros[campo]) {
            setErros(prev => ({ ...prev, [campo]: undefined }));
        }
    };
    
    const handleCepBlur = async () => {
        if (form.cep?.replace(/\D/g, '').length !== 8) return;
        
        setBuscandoCep(true);
        const endereco = await buscarEnderecoPorCEP(form.cep);
        if (endereco) {
        setForm(prev => ({
            ...prev,
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
        }));
        refs.numero.current?.focus();
        }
        setBuscandoCep(false);
    };
    
    const lidarComSalvar = async () => {
        setSalvando(true);
        try {
            await fornecedorSchema.validate(form, { abortEarly: false });
            setErros({});

            // CORREÇÃO: Tratamento seguro de campos opcionais antes de usar .trim()
            const dadosDoFormulario = {
                tipoPessoa: form.tipoPessoa,
                razaoSocial: form.tipoPessoa === 'Juridica' ? (form.razaoSocial || '').trim() : '',
                nomeFantasia: form.tipoPessoa === 'Juridica' ? (form.nomeFantasia || '').trim() : '',
                cnpj: form.tipoPessoa === 'Juridica' ? String(form.cnpj || '').replace(/\D/g, '') : '',
                nomeCompleto: form.tipoPessoa === 'Fisica' ? (form.nomeCompleto || '').trim() : '',
                cpf: form.tipoPessoa === 'Fisica' ? String(form.cpf || '').replace(/\D/g, '') : '',
                email: (form.email || '').trim(),
                telefone: String(form.telefone || '').replace(/\D/g, ''),
                observacoes: (form.observacoes || '').trim(),
                status: form.status,
                endereco: {
                    cep: String(form.cep || '').replace(/\D/g, ''),
                    logradouro: (form.logradouro || '').trim(),
                    numero: (form.numero || '').trim(),
                    complemento: (form.complemento || '').trim(),
                    bairro: (form.bairro || '').trim(),
                    cidade: (form.cidade || '').trim(),
                    estado: (form.estado || '').trim(),
                },
            };

            if (modoEdicao) {
                await atualizarFornecedor({ ...fornecedorParaEditar, ...dadosDoFormulario });
                Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Fornecedor atualizado.' });
                navigation.goBack();
            } else {
                const fornecedorSalvo = await salvarFornecedor(dadosDoFormulario);
                Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Fornecedor salvo.' });

                if (route.params?.origin === 'CadastroProduto') {
                  navigation.navigate('Produtos', {
                    screen: 'CadastroProduto',
                    params: { fornecedorSelecionado: fornecedorSalvo },
                  });
                  return;
                }
                
                if (onGoBackCallback) {
                  onGoBackCallback(fornecedorSalvo);
                  navigation.goBack();
                } else {
                  navigation.replace('CadastroFornecedor', { fornecedorParaEditar: fornecedorSalvo });
                }
            }

        } catch (err) {
            if (err.inner) {
                const errosDeValidacao = err.inner.reduce((acc, error) => {
                  acc[error.path] = error.message;
                  return acc;
                }, {});
                setErros(errosDeValidacao);
                Toast.show({ type: 'error', text1: 'Atenção', text2: 'Por favor, corrija os campos indicados.' });
            } else {
                Alert.alert('Erro ao Salvar', err.message);
            }
        } finally {
            setSalvando(false);
        }
    };
    
    return {
        form,
        erros,
        salvando,
        buscandoCep,
        modoEdicao,
        refs,
        handleChange,
        handleCepBlur,
        lidarComSalvar,
    };
};