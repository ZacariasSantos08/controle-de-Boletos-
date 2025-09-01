import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CardFormulario from '../../../componentes/CardFormulario';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const LinhaPagamento = ({ pagamento, aoRemover }) => (
  <View style={styles.linha}>
    <View style={styles.infoPagamento}>
      <Feather name="dollar-sign" size={16} color={tema.cores.cinza}/>
      <Text style={styles.textoForma}>{pagamento.forma}</Text>
    </View>
    <View style={styles.infoPagamento}>
      <Text style={styles.textoValor}>{formatarMoeda(pagamento.valor * 100)}</Text>
      <TouchableOpacity onPress={aoRemover} style={styles.botaoRemover}>
        <Feather name="trash-2" size={20} color={tema.cores.vermelho}/>
      </TouchableOpacity>
    </View>
  </View>
);

const PagamentosMultiplosCard = ({ pagamentos, aoRemover, aoAdicionar, totalAPagar }) => {
  const valorPago = pagamentos.reduce((acc, p) => acc + p.valor, 0);
  const valorRestante = totalAPagar - valorPago;

  return (
    <CardFormulario titulo="Pagamentos" icone="credit-card">
      {pagamentos.map(p => (
        <LinhaPagamento key={p.id} pagamento={p} aoRemover={() => aoRemover(p.id)} />
      ))}
      
      {pagamentos.length === 0 && (
        <Text style={styles.textoVazio}>Nenhuma forma de pagamento adicionada.</Text>
      )}

      <View style={styles.divisor} />

      <View style={styles.linhaResumo}>
        <Text style={styles.labelResumo}>Valor Pago:</Text>
        <Text style={styles.valorResumo}>{formatarMoeda(valorPago * 100)}</Text>
      </View>
      <View style={styles.linhaResumo}>
        <Text style={styles.labelResumo}>Valor Restante:</Text>
        <Text style={[styles.valorResumo, {color: valorRestante > 0.001 ? tema.cores.vermelho : tema.cores.verde}]}>
          {formatarMoeda(valorRestante * 100)}
        </Text>
      </View>

      {valorRestante > 0.001 && ( // Condição com margem de erro para float
        <View style={{marginTop: tema.espacamento.medio}}>
          <Botao titulo="Adicionar Pagamento" tipo="secundario" icone="plus" onPress={aoAdicionar} />
        </View>
      )}
    </CardFormulario>
  );
};

const styles = StyleSheet.create({
    linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    infoPagamento: { flexDirection: 'row', alignItems: 'center' },
    textoForma: { marginLeft: 8, fontSize: 16 },
    textoValor: { fontSize: 16, fontWeight: 'bold' },
    botaoRemover: { padding: 4, marginLeft: 12 },
    textoVazio: { textAlign: 'center', color: tema.cores.cinza, marginVertical: 20 },
    divisor: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
    linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    labelResumo: { fontSize: 16, color: tema.cores.cinza },
    valorResumo: { fontSize: 16, fontWeight: 'bold' },
});

export default PagamentosMultiplosCard;