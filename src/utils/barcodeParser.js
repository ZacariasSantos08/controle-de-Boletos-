import { addDays } from 'date-fns';

/**
 * Decodifica o código de barras de um boleto bancário (título).
 * @param {string} codigo A linha digitável ou código de barras.
 * @returns {object|null} Um objeto com { valor, vencimento, linhaDigitavel } ou null se o código for inválido.
 */
export function parseBoletoBarcode(codigo) {
  try {
    const digitos = codigo.replace(/[^0-9]/g, '');

    if (digitos.length < 44) {
      console.error("Código de barras muito curto.");
      return null;
    }
    
    const isLinhaDigitavel = digitos.length > 44;
    const codigoParaCalculo = isLinhaDigitavel 
      ? digitos.slice(0, 4) + digitos.slice(32) + digitos.slice(4, 9) + digitos.slice(10, 20) + digitos.slice(21, 31)
      : digitos;

    const valorString = codigoParaCalculo.substring(9, 19);
    const valor = parseFloat(valorString) / 100;

    const fatorVencimento = parseInt(codigoParaCalculo.substring(5, 9), 10);
    const dataBase = new Date('1997-10-07T03:00:00Z');
    
    const vencimento = fatorVencimento > 0 ? addDays(dataBase, fatorVencimento) : null;

    return {
      valor: valor,
      vencimento: vencimento,
      linhaDigitavel: digitos,
    };
  } catch (error) {
    console.error("Erro ao decodificar o código de barras:", error);
    return null;
  }
}