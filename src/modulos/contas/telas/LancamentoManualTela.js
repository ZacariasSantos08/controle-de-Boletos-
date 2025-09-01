import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { criarLancamentoManual } from '../api/contas.api';
import CardFormulario from '../../../componentes/CardFormulario';
import InputFormulario from '../../../componentes/InputFormulario';
import SeletorDeData from '../../../componentes/SeletorDeData';
import GrupoDeBotoes from '../../../componentes/GrupoDeBotoes';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';
import { formatarMoeda, desformatarParaCentavos } from '../../../utilitarios/formatadores';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const OPCOES_TIPO = [
    { id: 'PAGAR', nome: 'Despesa (-)', icone: 'arrow-up-right' },
    { id: 'RECEBER', nome: 'Receita (+)', icone: 'arrow-down-left' },
];

const LancamentoManualTela = ({ navigation }) => {
  const [tipo, setTipo] = useState('PAGAR');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState(new Date());
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!descricao.trim() || desformatarParaCentavos(valor) <= 0 || !dataVencimento) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha a descrição, o valor e a data de vencimento.");
      return;
    }
    setSalvando(true);
    try {
      await criarLancamentoManual({
        tipo,
        descricao,
        valor: desformatarParaCentavos(valor) / 100,
        dataVencimento: dataVencimento.getTime(),
      });
      Toast.show({type: 'success', text1: 'Sucesso!', text2: 'Lançamento salvo.'});
      navigation.goBack();
    } catch (error) {
      Toast.show({type: 'error', text1: 'Erro', text2: 'Não foi possível salvar o lançamento.'});
      console.error("Erro ao salvar lançamento manual:", error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0} // Ajuste fino opcional
      enableOnAndroid={true}
    >
        <CardFormulario titulo="Detalhes do Lançamento">
          <GrupoDeBotoes
            label="Tipo de Lançamento"
            opcoes={OPCOES_TIPO}
            selecionado={tipo}
            aoSelecionar={setTipo}
          />
          <InputFormulario
            label="Descrição"
            valor={descricao}
            aoMudarTexto={setDescricao}
            placeholder="Ex: Aluguel do escritório, Serviço de design"
          />
          <InputFormulario
            label="Valor"
            valor={valor}
            aoMudarTexto={setValor}
            tipoTeclado="numeric"
            formatador={formatarMoeda}
          />
          <SeletorDeData
            label="Data de Vencimento"
            data={dataVencimento}
            aoMudarData={setDataVencimento}
          />
        </CardFormulario>
        <View style={styles.botaoContainer}>
          <Botao 
            titulo="Salvar Lançamento" 
            onPress={handleSalvar} 
            disabled={salvando}
            rightComponent={salvando ? <ActivityIndicator color={tema.cores.branco}/> : null}
          />
        </View>
</KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: tema.espacamento.medio,
    backgroundColor: tema.cores.secundaria,
  },
  botaoContainer: {
    marginTop: tema.espacamento.grande,
  }
});

export default LancamentoManualTela;