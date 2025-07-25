import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaskInput, { Masks } from 'react-native-mask-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format, parse, isValid } from 'date-fns';
import { tema } from '../estilos/tema';
import BotaoPersonalizado from './BotaoPersonalizado';

const ModalPagamento = ({ visivel, aoFechar, aoConfirmar, boleto }) => {
  if (!boleto) return null;
  const [dataPagamento, setDataPagamento] = useState(new Date());
  const [valorPago, setValorPago] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [erroValor, setErroValor] = useState('');

  useEffect(() => {
    if (boleto && visivel) {
      setValorPago((boleto.valor * 100).toString());
      setDataPagamento(new Date());
      setErroValor('');
    }
  }, [boleto, visivel]);

  const onConfirmarPagamento = () => {
    if (!valorPago || parseFloat(valorPago) === 0) { setErroValor('O valor pago não pode ser zero.'); return; }
    const valorNumerico = parseFloat(valorPago) / 100;
    const jurosMulta = valorNumerico > boleto.valor ? valorNumerico - boleto.valor : null;
    aoConfirmar(boleto.id, dataPagamento.toISOString(), valorNumerico, jurosMulta);
    aoFechar();
  };
  
  return (
    <Modal animationType="slide" transparent={true} visible={visivel} onRequestClose={aoFechar}>
      <View style={styles.fundoModal}>
        <View style={styles.containerModal}>
          <Text style={styles.titulo}>Confirmar Pagamento</Text>
          <Text style={styles.subtitulo}>{boleto.emissor}</Text>
          <Text style={styles.descricao}>{boleto.descricao}</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data do Pagamento</Text>
            {Platform.OS === 'web' ? (
              <MaskInput style={styles.input} value={format(dataPagamento, 'dd/MM/yyyy')} mask={Masks.DATE_DDMMYYYY} placeholder="DD/MM/AAAA" keyboardType="numeric"
                onChangeText={(masked) => { if (masked.length === 10) { const dataParseada = parse(masked, 'dd/MM/yyyy', new Date()); if (isValid(dataParseada)) setDataPagamento(dataParseada); } }} />
            ) : (
              <>
                <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisibility(true)}>
                    <Text style={styles.dateText}>{format(dataPagamento, 'dd/MM/yyyy')}</Text>
                    <Ionicons name="calendar" size={24} color={tema.cores.cinza} />
                </TouchableOpacity>
                <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" date={dataPagamento} onConfirm={(date) => { setDatePickerVisibility(false); setDataPagamento(date); }} onCancel={() => setDatePickerVisibility(false)} locale="pt_BR" />
              </>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor Pago</Text>
            <MaskInput style={[styles.input, erroValor ? styles.inputErro : null]} value={valorPago}
                onChangeText={(masked, unmasked) => { setValorPago(unmasked); if (unmasked) setErroValor(''); }}
                mask={Masks.BRL_CURRENCY} keyboardType="numeric" placeholder="R$ 0,00" placeholderTextColor={tema.cores.cinza}/>
            {erroValor && <Text style={styles.textoErro}>{erroValor}</Text>}
          </View>
          <View style={styles.botoesContainer}>
            <BotaoPersonalizado titulo="Cancelar" onPress={aoFechar} tipo="contorno" style={{ flex: 1, marginRight: 8 }} />
            <BotaoPersonalizado titulo="Confirmar" onPress={onConfirmarPagamento} tipo="primario" style={{ flex: 1, marginLeft: 8 }}/>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  fundoModal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', },
  containerModal: { width: '90%', backgroundColor: 'white', borderRadius: tema.raioBorda.grande, padding: tema.espacamento.grande, alignItems: 'center', },
  titulo: { ...tema.tipografia.titulo, color: tema.cores.primaria, marginBottom: tema.espacamento.pequeno, },
  subtitulo: { ...tema.tipografia.corpo, fontWeight: 'bold', color: tema.cores.texto, },
  descricao: { ...tema.tipografia.legenda, color: tema.cores.cinza, marginBottom: tema.espacamento.grande, textAlign: 'center', },
  botoesContainer: { flexDirection: 'row', marginTop: tema.espacamento.grande, width: '100%', },
  inputContainer: { width: '100%', marginVertical: tema.espacamento.pequeno, },
  label: { fontSize: 14, color: tema.cores.primaria, marginBottom: 4, fontWeight: '600' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: tema.cores.borda, borderRadius: tema.raioBorda.medio, paddingHorizontal: tema.espacamento.medio, height: 50, fontSize: 16, color: tema.cores.texto, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
  dateText: { fontSize: 16, color: tema.cores.texto, },
  inputErro: { borderColor: tema.cores.erro, },
  textoErro: { color: tema.cores.erro, fontSize: 12, marginTop: 4, },
});
export default ModalPagamento;