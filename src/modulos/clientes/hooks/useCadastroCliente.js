import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { salvarCliente, atualizarCliente } from '../../../api/clientes.api';
import { clienteSchema } from '../../../validations/cliente.schema';
import { buscarEnderecoPorCEP } from '../../../api/cep.api';

export const useCadastroCliente = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const clienteParaEditar = route.params?.clienteParaEditar;
  const onGoBackCallback = route.params?.onGoBack; // Captura a função de callback
  const modoEdicao = !!clienteParaEditar;

  const [form, setForm] = useState({ tipoPessoa: 'Fisica', status: 'Ativo' });
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const refs = {
    nomeCompleto: useRef(null),
    cpf: useRef(null),
    razaoSocial: useRef(null),
    nomeFantasia: useRef(null),
    cnpj: useRef(null),
    email: useRef(null),
    telefone: useRef(null),
    cep: useRef(null),
    logradouro: useRef(null),
    numero: useRef(null),
    complemento: useRef(null),
    bairro: useRef(null),
    cidade: useRef(null),
    estado: useRef(null),
  };

  useEffect(() => {
    if (modoEdicao && clienteParaEditar) {
      setForm({
        tipoPessoa: clienteParaEditar.tipoPessoa || 'Fisica',
        status: clienteParaEditar.status || 'Ativo',
        nomeCompleto: clienteParaEditar.detalhesPessoaFisica?.nomeCompleto || '',
        cpf: clienteParaEditar.detalhesPessoaFisica?.cpf || '',
        razaoSocial: clienteParaEditar.detalhesPessoaJuridica?.razaoSocial || '',
        nomeFantasia: clienteParaEditar.detalhesPessoaJuridica?.nomeFantasia || '',
        cnpj: clienteParaEditar.detalhesPessoaJuridica?.cnpj || '',
        email: clienteParaEditar.email || '',
        telefone: clienteParaEditar.telefones?.[0]?.numero || '',
        cep: clienteParaEditar.endereco?.cep || '',
        logradouro: clienteParaEditar.endereco?.logradouro || '',
        numero: clienteParaEditar.endereco?.numero || '',
        complemento: clienteParaEditar.endereco?.complemento || '',
        bairro: clienteParaEditar.endereco?.bairro || '',
        cidade: clienteParaEditar.endereco?.cidade || '',
        estado: clienteParaEditar.endereco?.estado || '',
      });
    }
  }, [modoEdicao, clienteParaEditar]);

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
      await clienteSchema.validate(form, { abortEarly: false });
      setErros({});
      
      const dadosDoFormulario = {
        tipoPessoa: form.tipoPessoa,
        status: form.status,
        nomeCompleto: form.nomeCompleto?.trim(),
        cpf: String(form.cpf || '').replace(/\D/g, ''),
        razaoSocial: form.razaoSocial?.trim(),
        nomeFantasia: form.nomeFantasia?.trim(),
        cnpj: String(form.cnpj || '').replace(/\D/g, ''),
        email: form.email?.trim(),
        telefones: [{ numero: String(form.telefone || '').replace(/\D/g, ''), tipo: 'Celular' }],
        endereco: {
          cep: String(form.cep || '').replace(/\D/g, ''),
          logradouro: form.logradouro?.trim(),
          numero: form.numero?.trim(),
          complemento: form.complemento?.trim(),
          bairro: form.bairro?.trim(),
          cidade: form.cidade?.trim(),
          estado: form.estado?.trim(),
        },
      };

      if (modoEdicao) {
        await atualizarCliente({ ...clienteParaEditar, ...dadosDoFormulario });
        Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Cliente atualizado.' });
        navigation.goBack();
      } else {
        const clienteSalvo = await salvarCliente(dadosDoFormulario);
        Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Cliente salvo.' });

        if (route.params?.origin === 'PdvTela') {
          navigation.navigate('Vendas', {
            screen: 'Pdv',
            params: { clienteSelecionado: clienteSalvo },
          });
          return;
        }

        if (onGoBackCallback) {
          onGoBackCallback(clienteSalvo);
          navigation.goBack();
        } else {
          navigation.replace('CadastroCliente', { clienteParaEditar: clienteSalvo });
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