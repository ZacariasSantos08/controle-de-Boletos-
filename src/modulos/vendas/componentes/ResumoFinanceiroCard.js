import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardFormulario from '../../../componentes/CardFormulario';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const LinhaResumo = ({ label, valor, corValor = tema.cores.preto, negrito = false, tamanhoFonte = 16 }) => (
  <View style={styles.linha}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.valor, { color: corValor, fontWeight: negrito ? 'bold' : 'normal', fontSize: tamanhoFonte }]}>{valor}</Text>
  </View>
);

// ALTERADO: O componente agora recebe os descontos de forma separada
const ResumoFinanceiroCard = ({ subtotal, frete, descontosItens, descontoGeral, totalFinal }) => {
  return (
    <CardFormulario titulo="Resumo Financeiro" icone="file-text">
      <LinhaResumo 
        label="Subtotal dos Produtos" 
        valor={formatarMoeda(subtotal * 100)} 
      />
      {/* NOVO: Linha para descontos aplicados nos itens */}
      <LinhaResumo 
        label="Descontos nos Itens" 
        valor={`- ${formatarMoeda(descontosItens * 100)}`} 
        corValor={tema.cores.vermelho}
      />
      {/* NOVO: Linha para desconto geral */}
       <LinhaResumo 
        label="Desconto Geral" 
        valor={`- ${formatarMoeda(descontoGeral * 100)}`} 
        corValor={tema.cores.vermelho}
      />
       <LinhaResumo 
        label="Frete" 
        valor={`+ ${formatarMoeda(frete * 100)}`} 
      />
      <View style={styles.divisor} />
      <LinhaResumo 
        label="Total a Pagar" 
        valor={formatarMoeda(totalFinal * 100)} 
        corValor={tema.cores.verde}
        negrito={true}
        tamanhoFonte={20}
      />
    </CardFormulario>
  );
};

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: tema.cores.cinza,
  },
  valor: {
    fontSize: 16,
    fontWeight: '500',
  },
  divisor: {
    height: 1,
    backgroundColor: '#F0F1F5',
    marginVertical: 8,
  }
});

export default ResumoFinanceiroCard;