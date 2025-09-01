/**
 * Remove todos os caracteres não numéricos de uma string.
 * @param {string | number} valor - A string ou número para limpar.
 * @returns {string} Apenas os dígitos da string.
 */
const apenasNumeros = (valor) => String(valor || '').replace(/\D/g, '');

/**
 * Desformata um valor monetário ou numérico para um número puro em centavos.
 * Ex: "R$ 1.234,56" => 123456
 * @param {string} valorFormatado - O valor com formatação.
 * @returns {number} O número puro em centavos.
 */
export const desformatarParaCentavos = (valorFormatado) => {
  const numeros = apenasNumeros(valorFormatado);
  if (!numeros) return 0;
  return parseInt(numeros, 10);
};


/**
 * Formata um valor (string de dígitos ou número) para o padrão monetário BRL.
 * @param {string | number} valor - O valor a ser formatado.
 * @returns {string} O valor formatado como "R$ 1.234,56".
 */
export const formatarMoeda = (valor) => {
  const numeros = apenasNumeros(valor);
  if (numeros === '') return '0,00';

  const valorEmReais = parseInt(numeros, 10) / 100;

  return valorEmReais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Formata um valor numérico com separadores de milhar e 2 casas decimais.
 * @param {string | number} valor - O valor a ser formatado.
 * @returns {string} O valor formatado como "1.234,56".
 */
export const formatarNumero = (valor) => {
    const numeros = apenasNumeros(valor);
    if (numeros === '') return '';
  
    const valorNumerico = parseInt(numeros, 10) / 100;
  
    return valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
};

/**
 * Formata uma string de dígitos para o padrão de CPF.
 * @param {string} cpf - Os dígitos do CPF.
 * @returns {string} O CPF formatado.
 */
export const formatarCPF = (cpf) => {
  const numeros = apenasNumeros(cpf);
  return numeros
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

/**
 * Formata uma string de dígitos para o padrão de CNPJ.
 * @param {string} cnpj - Os dígitos do CNPJ.
 * @returns {string} O CNPJ formatado.
 */
export const formatarCNPJ = (cnpj) => {
  const numeros = apenasNumeros(cnpj);
  return numeros
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

/**
 * Formata uma string de dígitos para o padrão de Telefone Celular.
 * @param {string} telefone - Os dígitos do telefone.
 * @returns {string} O telefone formatado.
 */
export const formatarTelefone = (telefone) => {
  const numeros = apenasNumeros(telefone);
  return numeros
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};


/**
 * Formata um timestamp numérico para uma string de data legível (dd/mm/aaaa).
 * @param {number} timestamp - O timestamp a ser formatado.
 * @returns {string} A data formatada.
 */
export const formatarData = (timestamp) => {
  if (!timestamp) return 'Data indisponível';
  return new Date(timestamp).toLocaleDateString('pt-BR');
};