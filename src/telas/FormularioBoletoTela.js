import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity, Alert, Switch, Image } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { isValid, format, parse } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import MaskInput, { Masks } from 'react-native-mask-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ContextoBoletos } from '../contexto/ContextoBoletos';
import { tema } from '../estilos/tema';
import BotaoPersonalizado from '../componentes/BotaoPersonalizado';
import EntradaPersonalizada from '../componentes/EntradaPersonalizada';
import { parseBoletoBarcode } from '../utils/barcodeParser';

const FormularioBoletoTela = () => {
  const { boletos, adicionarBoleto, atualizarBoleto, todosEmissoresUnicos, todasDescricoesUnicas, todosPagadoresUnicos } = useContext(ContextoBoletos);
  
  const route = useRoute();
  const navigation = useNavigation();
  
  const boletoExistente = route.params?.boletoId ? (boletos || []).find(b => b.id === route.params.boletoId) : null;

  const [valor, setValor] = useState(boletoExistente ? (boletoExistente.valor * 100).toString() : '');
  const [emissor, setEmissor] = useState(boletoExistente?.emissor || '');
  const [descricao, setDescricao] = useState(boletoExistente?.descricao || '');
  const [pagador, setPagador] = useState(boletoExistente?.pagador || '');
  const [dataVencimento, setDataVencimento] = useState(boletoExistente ? new Date(boletoExistente.vencimento) : null);
  const [linhaDigitavel, setLinhaDigitavel] = useState(boletoExistente?.linhaDigitavel || '');
  const [numeroDocumento, setNumeroDocumento] = useState(boletoExistente?.numeroDocumento || '');
  const [observacoes, setObservacoes] = useState(boletoExistente?.observacoes || '');
  const [anexoUri, setAnexoUri] = useState(boletoExistente?.anexoUri || null);

  const [erros, setErros] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState('vencimento');
  const [sugestoesEmissor, setSugestoesEmissor] = useState([]);
  const [sugestoesDescricao, setSugestoesDescricao] = useState([]);
  const [sugestoesPagador, setSugestoesPagador] = useState([]);

  const [ehRecorrente, setEhRecorrente] = useState(false);
  const [parcelas, setParcelas] = useState('12');

  const [isPago, setIsPago] = useState(boletoExistente?.status === 'pago');
  const [valorPago, setValorPago] = useState(boletoExistente?.valorPago ? (boletoExistente.valorPago * 100).toString() : '');
  const [dataPagamento, setDataPagamento] = useState(boletoExistente?.dataPagamento ? new Date(boletoExistente.dataPagamento) : new Date());

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.scannedData) {
        const dadosLidos = parseBoletoBarcode(route.params.scannedData);
        if (dadosLidos) {
          setLinhaDigitavel(dadosLidos.linhaDigitavel);
          setValor(dadosLidos.valor ? (dadosLidos.valor * 100).toString() : '');
          setDataVencimento(dadosLidos.vencimento);
          Toast.show({ type: 'success', text1: 'Boleto Lido!', text2: 'Dados preenchidos.' });
        } else {
          Toast.show({ type: 'error', text1: 'Erro', text2: 'Código de barras inválido.' });
        }
        navigation.setParams({ scannedData: undefined });
      }
    }, [route.params?.scannedData])
  );

  useEffect(() => {
    if (boletoExistente) {
      setEhRecorrente(false);
    }
    navigation.setOptions({ title: boletoExistente ? 'Editar Boleto' : 'Adicionar Boleto' });
  }, [navigation, boletoExistente]);

  const limparFormulario = () => {
    setEmissor(''); setDescricao(''); setPagador(''); setValor('');
    setDataVencimento(null); setLinhaDigitavel(''); setNumeroDocumento(''); setObservacoes('');
    setAnexoUri(null); setErros({}); setEhRecorrente(false); setParcelas('12');
    setIsPago(false); setValorPago(''); setDataPagamento(new Date());
  };

  const handleShowDatePicker = (target) => {
    setDatePickerTarget(target);
    setDatePickerVisibility(true);
  };

  const handleConfirmDate = (date) => {
    if (datePickerTarget === 'vencimento') {
      setDataVencimento(date);
    } else {
      setDataPagamento(date);
    }
    setDatePickerVisibility(false);
  };

  const handleAnexarImagem = () => {
    Alert.alert("Anexar Comprovante", "Escolha uma opção:",
      [{ text: "Tirar Foto", onPress: () => pickImage('camera') },
      { text: "Escolher da Galeria", onPress: () => pickImage('gallery') },
      { text: "Cancelar", style: "cancel" }]
    );
  };

  const pickImage = async (mode) => {
    let result;
    try {
      if (mode === 'camera') {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 5], quality: 0.7 });
      } else {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 5], quality: 0.7 });
      }
  
      if (!result.canceled) {
        const tempUri = result.assets[0].uri;
        const fileName = tempUri.split('/').pop();
        const permanentDir = FileSystem.documentDirectory + 'anexos/';
        const dirInfo = await FileSystem.getInfoAsync(permanentDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(permanentDir, { intermediates: true });
        }
        const permanentUri = permanentDir + fileName;
        await FileSystem.copyAsync({ from: tempUri, to: permanentUri });
        setAnexoUri(permanentUri);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a imagem.");
    }
  };

  const validarCampos = () => {
    const novosErros = {};
    if (!emissor.trim()) novosErros.emissor = 'Emissor é obrigatório.';
    if (!descricao.trim()) novosErros.descricao = 'Descrição é obrigatória.';
    if (!valor || parseFloat(valor) === 0) novosErros.valor = 'Valor é obrigatório.';
    if (!dataVencimento || !isValid(dataVencimento)) novosErros.vencimento = 'Data inválida.';
    if (isPago && (!valorPago || parseFloat(valorPago) === 0)) novosErros.valorPago = 'Valor pago é obrigatório.';
    if (isPago && !dataPagamento) novosErros.dataPagamento = 'Data de pagamento é obrigatória.';
    if (ehRecorrente && (!parcelas || parseInt(parcelas, 10) <= 1 || parseInt(parcelas, 10) > 60)) {
      novosErros.parcelas = 'Deve ser entre 2 e 60.';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  const processarSalvamento = () => {
    if (!validarCampos()) {
        Toast.show({ type: 'error', text1: 'Atenção', text2: 'Por favor, corrija os campos marcados.' });
        return;
    }

    let dadosBoleto = {
      emissor: emissor.trim(),
      descricao: descricao.trim(),
      pagador: pagador.trim(),
      valor: parseFloat(valor) / 100,
      vencimento: dataVencimento.toISOString(),
      linhaDigitavel: linhaDigitavel.trim(),
      numeroDocumento: numeroDocumento.trim(),
      observacoes: observacoes.trim(),
      anexoUri: null,
      idNotificacao: boletoExistente?.idNotificacao || null,
      jurosMulta: boletoExistente?.jurosMulta || null,
    };

    if (isPago) {
      const valorPagoNum = parseFloat(valorPago) / 100;
      dadosBoleto = {
        ...dadosBoleto,
        status: 'pago',
        valorPago: valorPagoNum,
        dataPagamento: dataPagamento.toISOString(),
        anexoUri: anexoUri,
        jurosMulta: valorPagoNum > dadosBoleto.valor ? valorPagoNum - dadosBoleto.valor : null,
      };
    } else {
      dadosBoleto = {
        ...dadosBoleto,
        status: 'aPagar',
        valorPago: null,
        dataPagamento: null,
      };
    }

    if (boletoExistente) {
      atualizarBoleto({ ...boletoExistente, ...dadosBoleto });
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Boleto atualizado.' });
      navigation.goBack();
    } else {
      const recorrencia = { ehRecorrente, parcelas: parseInt(parcelas, 10) };
      adicionarBoleto(dadosBoleto, recorrencia);
      const msg = ehRecorrente ? `${parcelas} boletos adicionados.` : 'Boleto adicionado.';
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: msg });
      limparFormulario();
    }
  };
  
  const handleSalvar = () => {
    processarSalvamento();
  };

  const handleEmissorChange = (texto) => {
    setEmissor(texto);
    if (texto.length > 1) {
      const sugestoesFiltradas = todosEmissoresUnicos.filter(e =>
        e.toLowerCase().includes(texto.toLowerCase()) && e.toLowerCase() !== texto.toLowerCase()
      );
      setSugestoesEmissor(sugestoesFiltradas.slice(0, 4));
    } else {
      setSugestoesEmissor([]);
    }
  };

  const handlePagadorChange = (texto) => {
    setPagador(texto);
    if (texto.length > 1) {
      const sugestoesFiltradas = todosPagadoresUnicos.filter(p =>
        p.toLowerCase().includes(texto.toLowerCase()) && p.toLowerCase() !== texto.toLowerCase()
      );
      setSugestoesPagador(sugestoesFiltradas.slice(0, 4));
    } else {
      setSugestoesPagador([]);
    }
  };

  const handleDescricaoChange = (texto) => {
    setDescricao(texto);
    if (texto.length > 2) {
      const sugestoesFiltradas = todasDescricoesUnicas.filter(d =>
        d.toLowerCase().includes(texto.toLowerCase()) && d.toLowerCase() !== texto.toLowerCase()
      );
      setSugestoesDescricao(sugestoesFiltradas.slice(0, 4));
    } else {
      setSugestoesDescricao([]);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={90}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <EntradaPersonalizada label="Emissor" valor={emissor} onChangeText={handleEmissorChange} placeholder="Ex: Nome da Empresa" erro={erros.emissor}/>
        {sugestoesEmissor.length > 0 && ( <View style={styles.listaSugestoes}>{sugestoesEmissor.map(item => ( <TouchableOpacity key={item} style={styles.sugestaoItem} onPress={() => { setEmissor(item); setSugestoesEmissor([]); }}><Text style={styles.sugestaoTexto}>{item}</Text></TouchableOpacity> ))}</View> )}
        <EntradaPersonalizada label="Pagador (Opcional)" valor={pagador} onChangeText={handlePagadorChange} placeholder="Ex: Nome da sua empresa ou pessoal"/>
        {sugestoesPagador.length > 0 && ( <View style={styles.listaSugestoes}>{sugestoesPagador.map(item => ( <TouchableOpacity key={item} style={styles.sugestaoItem} onPress={() => { setPagador(item); setSugestoesPagador([]); }}><Text style={styles.sugestaoTexto}>{item}</Text></TouchableOpacity> ))}</View> )}
        <EntradaPersonalizada label="Descrição" valor={descricao} onChangeText={handleDescricaoChange} placeholder="Ex: Assinatura, Parcela" erro={erros.descricao}/>
        {sugestoesDescricao.length > 0 && ( <View style={styles.listaSugestoes}>{sugestoesDescricao.map(item => ( <TouchableOpacity key={item} style={styles.sugestaoItem} onPress={() => { setDescricao(item); setSugestoesDescricao([]); }}><Text style={styles.sugestaoTexto}>{item}</Text></TouchableOpacity> ))}</View> )}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor</Text>
          <MaskInput 
            style={[styles.input, erros.valor ? styles.inputErro : null]} 
            value={valor} 
            onChangeText={(masked, unmasked) => setValor(unmasked)} 
            mask={Masks.BRL_CURRENCY} 
            keyboardType="numeric" 
            placeholder="R$ 0,00" 
            placeholderTextColor={tema.cores.cinza}
          />
          {erros.valor && <Text style={styles.textoErro}>{erros.valor}</Text>}
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>Vencimento</Text>
            <TouchableOpacity 
                style={[styles.input, erros.vencimento ? styles.inputErro : null]} 
                onPress={() => handleShowDatePicker('vencimento')}>
                <Text style={dataVencimento ? styles.dateText : styles.datePlaceholder}>
                    {dataVencimento && isValid(dataVencimento) ? format(dataVencimento, 'dd/MM/yyyy') : 'Selecione a data'}
                </Text>
                <Ionicons name="calendar" size={24} color={tema.cores.cinza} />
            </TouchableOpacity>
            {erros.vencimento && <Text style={styles.textoErro}>{erros.vencimento}</Text>}
        </View>

        {!boletoExistente && ( <View style={styles.recorrenciaContainer}><Text style={styles.label}>Já está pago?</Text><Switch trackColor={{ false: '#767577', true: tema.cores.secundaria }} thumbColor={isPago ? tema.cores.primaria : '#f4f3f4'} onValueChange={(value) => { setIsPago(value); if(value && !valorPago) setValorPago(valor); }} value={isPago}/></View> )}
        
        {isPago && (
            <>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Data do Pagamento</Text>
                    <TouchableOpacity style={[styles.input, erros.dataPagamento ? styles.inputErro : null]} onPress={() => handleShowDatePicker('pagamento')}>
                        <Text style={styles.dateText}>{format(dataPagamento, 'dd/MM/yyyy')}</Text>
                        <Ionicons name="calendar" size={24} color={tema.cores.cinza} />
                    </TouchableOpacity>
                    {erros.dataPagamento && <Text style={styles.textoErro}>{erros.dataPagamento}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Valor Pago</Text>
                    <MaskInput style={[styles.input, erros.valorPago ? styles.inputErro : null]} value={valorPago} onChangeText={(masked, unmasked) => setValorPago(unmasked)} mask={Masks.BRL_CURRENCY} keyboardType="numeric"/>
                    {erros.valorPago && <Text style={styles.textoErro}>{erros.valorPago}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Anexo (Opcional)</Text>
                    {!anexoUri ? ( <BotaoPersonalizado titulo="Adicionar Comprovante" onPress={handleAnexarImagem} tipo="contorno" /> ) : ( <View style={styles.anexoContainer}><Image source={{ uri: anexoUri }} style={styles.anexoThumbnail} /><Text style={styles.anexoTexto} numberOfLines={1}>Comprovante anexado.</Text><TouchableOpacity onPress={() => setAnexoUri(null)}><Ionicons name="trash-outline" size={24} color={tema.cores.erro} /></TouchableOpacity></View> )}
                </View>
            </>
        )}
        
        {!isPago && !boletoExistente && ( <View style={styles.recorrenciaContainer}><Text style={styles.label}>Boleto Recorrente?</Text><Switch trackColor={{ false: '#767577', true: tema.cores.secundaria }} thumbColor={ehRecorrente ? tema.cores.primaria : '#f4f3f4'} onValueChange={setEhRecorrente} value={ehRecorrente}/></View> )}
        
        {ehRecorrente && !isPago && !boletoExistente && ( <View style={styles.recorrenciaCamposContainer}><View style={{ flex: 1 }}><EntradaPersonalizada label="Frequência" valor="Mensal" editable={false}/></View><View style={{ width: 16 }} /><View style={{ flex: 1 }}><EntradaPersonalizada label="Qtde. de Parcelas" valor={parcelas} onChangeText={setParcelas} keyboardType="numeric" placeholder="Ex: 12" erro={erros.parcelas}/></View></View> )}
        
        <EntradaPersonalizada label="Número do Boleto (Opcional)" valor={numeroDocumento} onChangeText={setNumeroDocumento} placeholder="Ex: 12345678-9"/>

        <View style={styles.campoComIconeContainer}>
            <View style={{flex: 1}}>
                <EntradaPersonalizada label="Linha Digitável (Código de Barras)" valor={linhaDigitavel} onChangeText={setLinhaDigitavel} placeholder="Use a câmera ou digite aqui" multiline={true} style={{height: 100, textAlignVertical: 'top'}}/>
            </View>
            {!boletoExistente && ( <TouchableOpacity style={styles.iconeBotao} onPress={() => navigation.navigate('ScannerTela')}><Ionicons name="camera-outline" size={30} color={tema.cores.primaria} /></TouchableOpacity> )}
        </View>

        <EntradaPersonalizada label="Observações (Opcional)" valor={observacoes} onChangeText={setObservacoes} multiline numberOfLines={3} style={styles.textArea}/>

        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirmDate} onCancel={() => setDatePickerVisibility(false)} date={datePickerTarget === 'vencimento' ? (dataVencimento || new Date()) : dataPagamento} locale="pt_BR"/>

        <BotaoPersonalizado titulo={boletoExistente ? "Atualizar Boleto" : "Salvar Boleto"} onPress={handleSalvar} style={styles.botaoSalvar}/>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.fundo },
    scrollContainer: { padding: tema.espacamento.grande, paddingBottom: 50 },
    inputContainer: { width: '100%', marginVertical: tema.espacamento.pequeno },
    label: { fontSize: 14, color: tema.cores.primaria, marginBottom: 4, fontWeight: '600' },
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: tema.cores.borda, borderRadius: tema.raioBorda.medio, paddingHorizontal: tema.espacamento.medio, height: 50, fontSize: 16, color: tema.cores.texto, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    dateText: { fontSize: 16, color: tema.cores.texto },
    datePlaceholder: { fontSize: 16, color: tema.cores.cinza },
    inputErro: { borderColor: tema.cores.erro },
    textoErro: { color: tema.cores.erro, fontSize: 12, marginTop: 4 },
    textArea: { height: 100, textAlignVertical: 'top', paddingTop: tema.espacamento.medio },
    botaoSalvar: { marginTop: tema.espacamento.grande },
    listaSugestoes: { maxHeight: 150, backgroundColor: '#FAFAFA', borderRadius: tema.raioBorda.medio, marginTop: -8, marginBottom: 8, elevation: 3, borderColor: tema.cores.borda, borderWidth: 1, },
    sugestaoItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: tema.cores.borda, },
    sugestaoTexto: { fontSize: 16, color: tema.cores.texto },
    recorrenciaContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: tema.espacamento.medio, paddingVertical: tema.espacamento.pequeno, borderRadius: tema.raioBorda.medio, marginVertical: tema.espacamento.pequeno, borderWidth: 1, borderColor: tema.cores.borda, height: 60, },
    recorrenciaCamposContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', },
    campoComIconeContainer: { flexDirection: 'row', alignItems: 'flex-end', },
    iconeBotao: { height: 100, paddingLeft: 12, justifyContent: 'center', alignItems: 'center', marginBottom: tema.espacamento.pequeno, },
    anexoContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: tema.cores.borda, borderRadius: tema.raioBorda.medio, padding: tema.espacamento.pequeno, height: 60, },
    anexoThumbnail: { width: 44, height: 44, borderRadius: tema.raioBorda.pequeno, backgroundColor: tema.cores.borda, },
    anexoTexto: { flex: 1, marginLeft: tema.espacamento.medio, fontSize: 16, color: tema.cores.texto, },
});

export default FormularioBoletoTela;