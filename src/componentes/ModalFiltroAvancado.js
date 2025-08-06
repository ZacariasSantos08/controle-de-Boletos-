import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { tema } from '../estilos/tema';
import BotaoPersonalizado from './BotaoPersonalizado';

const ModalFiltroAvancado = ({ visivel, aoFechar, aplicarFiltros, filtrosAtuais, emissores, pagadores }) => {
  const [dataInicial, setDataInicial] = useState(filtrosAtuais.dataInicial);
  const [dataFinal, setDataFinal] = useState(filtrosAtuais.dataFinal);
  const [emissor, setEmissor] = useState(filtrosAtuais.emissor);
  const [pagador, setPagador] = useState(filtrosAtuais.pagador);
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState('inicial');

  useEffect(() => {
    setDataInicial(filtrosAtuais.dataInicial);
    setDataFinal(filtrosAtuais.dataFinal);
    setEmissor(filtrosAtuais.emissor);
    setPagador(filtrosAtuais.pagador);
  }, [filtrosAtuais]);

  const handleShowDatePicker = (target) => {
    setDatePickerTarget(target);
    setDatePickerVisibility(true);
  };

  const handleConfirmDate = (date) => {
    if (datePickerTarget === 'inicial') {
      setDataInicial(date);
    } else {
      setDataFinal(date);
    }
    setDatePickerVisibility(false);
  };

  const limparFiltros = () => {
    setDataInicial(null);
    setDataFinal(null);
    setEmissor(null);
    setPagador(null);
    aplicarFiltros({ dataInicial: null, dataFinal: null, emissor: null, pagador: null });
    aoFechar();
  };

  const submeterFiltros = () => {
    aplicarFiltros({ dataInicial, dataFinal, emissor, pagador });
    aoFechar();
  };
  
  const dataPickerDate = datePickerTarget === 'inicial' ? (dataInicial || new Date()) : (dataFinal || new Date());

  return (
    <Modal animationType="slide" transparent={false} visible={visivel} onRequestClose={aoFechar}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Filtro Avançado</Text>
          <TouchableOpacity onPress={aoFechar}>
            <Ionicons name="close-circle" size={30} color={tema.cores.primaria} />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Vencimento por Período</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateInput} onPress={() => handleShowDatePicker('inicial')}>
              <Text>{dataInicial ? format(dataInicial, 'dd/MM/yyyy') : 'Data Inicial'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateInput} onPress={() => handleShowDatePicker('final')}>
              <Text>{dataFinal ? format(dataFinal, 'dd/MM/yyyy') : 'Data Final'}</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Emissor</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={emissor} onValueChange={(itemValue) => setEmissor(itemValue)}>
              <Picker.Item label="Todos os Emissores" value={null} />
              {emissores.map(e => <Picker.Item key={e} label={e} value={e} />)}
            </Picker>
          </View>

          <Text style={styles.label}>Pagador</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={pagador} onValueChange={(itemValue) => setPagador(itemValue)}>
              <Picker.Item label="Todos os Pagadores" value={null} />
              {pagadores.map(p => <Picker.Item key={p} label={p} value={p} />)}
            </Picker>
          </View>
        </View>

        <View style={styles.footer}>
          <BotaoPersonalizado titulo="Limpar Filtros" tipo="contorno" onPress={limparFiltros} style={{flex: 1, marginRight: 8}} />
          <BotaoPersonalizado titulo="Aplicar" tipo="primario" onPress={submeterFiltros} style={{flex: 1, marginLeft: 8}} />
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          date={dataPickerDate}
          locale="pt_BR"
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
    container: { flex: 1, padding: tema.espacamento.medio },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: tema.espacamento.medio, borderBottomWidth: 1, borderBottomColor: tema.cores.borda },
    titulo: { ...tema.tipografia.titulo, color: tema.cores.primaria },
    label: { ...tema.tipografia.subtitulo, fontSize: 16, color: tema.cores.texto, marginTop: tema.espacamento.medio, marginBottom: tema.espacamento.pequeno },
    dateContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    dateInput: { flex: 1, height: 50, justifyContent: 'center', paddingHorizontal: tema.espacamento.medio, backgroundColor: tema.cores.superficie, borderWidth: 1, borderColor: tema.cores.borda, borderRadius: tema.raioBorda.medio, marginHorizontal: 4 },
    pickerContainer: { backgroundColor: tema.cores.superficie, borderWidth: 1, borderColor: tema.cores.borda, borderRadius: tema.raioBorda.medio },
    footer: { flexDirection: 'row', padding: tema.espacamento.medio, borderTopWidth: 1, borderTopColor: tema.cores.borda }
});

export default ModalFiltroAvancado;