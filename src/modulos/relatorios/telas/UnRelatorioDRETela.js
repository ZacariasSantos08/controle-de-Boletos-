import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRelatorioDRE } from '../hooks/useRelatorioDRE';
import SeletorDeData from '../../../componentes/SeletorDeData';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const LinhaDRE = ({ label, valor, isTotal = false, isSub = false, isNegativo = false }) => {
  const corValor = isNegativo ? tema.cores.vermelho : (isTotal ? tema.cores.primaria : tema.cores.preto);
  const sinal = valor < 0 ? "" : (isSub ? "- " : "+ ");
  
  return (
    <View style={[styles.linha, isTotal && styles.linhaTotal]}>
      <Text style={[styles.label, isTotal && styles.labelTotal, isSub && styles.labelSub]}>{label}</Text>
      <Text style={[styles.valor, {color: corValor}, isTotal && styles.valorTotal]}>
        {sinal}{formatarMoeda(Math.abs(valor) * 100)}
      </Text>
    </View>
  );
};


const RelatorioDRETela = () => {
  const hook = useRelatorioDRE();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cabecalhoContainer}>
        <View style={styles.filtrosContainer}>
          <View style={styles.seletorData}>
            <SeletorDeData label="De" data={hook.dataInicial} aoMudarData={hook.setDataInicial}/>
          </View>
          <View style={styles.seletorData}>
            <SeletorDeData label="Até" data={hook.dataFinal} aoMudarData={hook.setDataFinal}/>
          </View>
        </View>
      </View>

      {hook.carregando ? (
        <ActivityIndicator size="large" color={tema.cores.primaria} style={{marginTop: 50}}/>
      ) : (
        <View style={styles.dreContainer}>
          <LinhaDRE label="Receita Operacional Bruta" valor={hook.receitaBruta} />
          <LinhaDRE label="Custos dos Produtos Vendidos (CMV)" valor={hook.custoProdutosVendidos} isSub />
          <LinhaDRE label="= Lucro Bruto" valor={hook.lucroBruto} isTotal />

          <Text style={styles.tituloSecao}>Despesas</Text>
          <LinhaDRE label="Despesas Operacionais" valor={hook.despesasOperacionais} isSub />
          
          <LinhaDRE 
            label={hook.resultadoLiquido >= 0 ? "= Resultado Líquido (Lucro)" : "= Resultado Líquido (Prejuízo)"} 
            valor={hook.resultadoLiquido} 
            isTotal 
            isNegativo={hook.resultadoLiquido < 0}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  cabecalhoContainer: {
    backgroundColor: tema.cores.branco,
    padding: tema.espacamento.medio,
    margin: tema.espacamento.medio,
    borderRadius: 8,
  },
  filtrosContainer: { flexDirection: 'row', gap: tema.espacamento.medio },
  seletorData: { flex: 1 },
  dreContainer: {
    backgroundColor: tema.cores.branco,
    padding: tema.espacamento.medio,
    marginHorizontal: tema.espacamento.medio,
    borderRadius: 8,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: { fontSize: 16, color: tema.cores.cinza },
  valor: { fontSize: 16, fontWeight: '500' },
  labelSub: { paddingLeft: 16 },
  linhaTotal: { borderTopWidth: 2, borderTopColor: '#E0E0E0', marginTop: 8 },
  labelTotal: { color: tema.cores.preto, fontWeight: 'bold' },
  valorTotal: { fontWeight: 'bold', fontSize: 18 },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: tema.espacamento.grande,
    marginBottom: tema.espacamento.pequeno,
    color: tema.cores.preto,
  }
});

export default RelatorioDRETela;