import * as yup from 'yup';

const stripNonNumeric = (value) => (value || '').replace(/\D/g, '');

export const fornecedorSchema = yup.object().shape({
  tipoPessoa: yup.string().required(),
  
  nomeCompleto: yup.string().when('tipoPessoa', {
    is: 'Fisica',
    then: schema => schema.required('O nome completo é obrigatório.'),
    otherwise: schema => schema.notRequired(), // Correção para não validar quando não é o tipo certo
  }),
  cpf: yup.string().when('tipoPessoa', {
    is: 'Fisica',
    then: schema => schema.transform(stripNonNumeric).test('len', 'O CPF deve ter 11 dígitos.', val => !val || val.length === 0 || val.length === 11),
    otherwise: schema => schema.notRequired(),
  }),

  razaoSocial: yup.string().when('tipoPessoa', {
    is: 'Juridica',
    then: schema => schema.required('A razão social é obrigatória.'),
    otherwise: schema => schema.notRequired(),
  }),
  nomeFantasia: yup.string().notRequired(),
  cnpj: yup.string().when('tipoPessoa', {
    is: 'Juridica',
    then: schema => schema.transform(stripNonNumeric).test('len', 'O CNPJ deve ter 14 dígitos.', val => !val || val.length === 0 || val.length === 14),
    otherwise: schema => schema.notRequired(),
  }),

  email: yup.string().email('Digite um e-mail válido.').notRequired(),
  telefone: yup.string().transform(stripNonNumeric).test('len', 'O telefone deve ter 10 ou 11 dígitos.', val => !val || val.length === 0 || val.length === 10 || val.length === 11),
  
  cep: yup.string().transform(stripNonNumeric).test('len', 'O CEP deve ter 8 dígitos.', val => !val || val.length === 0 || val.length === 8),
  logradouro: yup.string().notRequired(),
  numero: yup.string().notRequired(),
  bairro: yup.string().notRequired(),
  cidade: yup.string().notRequired(),
  estado: yup.string().notRequired().max(2, 'Use a sigla do estado (Ex: SP).'),
  
  observacoes: yup.string().notRequired(),
  status: yup.string().required(),
});