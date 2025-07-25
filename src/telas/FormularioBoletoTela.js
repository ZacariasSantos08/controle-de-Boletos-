import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { isValid, format, parse } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import MaskInput, { Masks } from 'react-native-mask-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ContextoBoletos } from '../contexto/ContextoBoletos';
import { tema } from '../estilos/tema';
import BotaoPersonalizado from '../componentes/BotaoPersonalizado';
import EntradaPersonalizada from '../componentes/EntradaPersonalizada';

const FormularioBoletoTela = () => {
  const { boletos, adicionarBoleto, atualizarBoleto, todosEmissoresUnicos, todasDescricoesUnicas } = useContext(ContextoBoletos);
  const route = useRoute();
  const navigation = useNavigation();
  const boletoExistente = route.params?.boletoId ? boletos.find(b => b.id === route.params.boletoId) : null;

  const [valor, setValor] = useState(boletoExistente ? (boletoExistente.valor * 100).toString() : '');
  const [emissor, setEmissor] = useState(boletoExistente?.emissor || '');
  const [descricao, setDescricao] = useState(boletoExistente?.descricao || '');
  const [dataVencimento, setDataVencimento] = useState(boletoExistente ? new Date(boletoExistente.vencimento) : null);
  const [numeroBoleto, setNumeroBoleto] = useState(boletoExistente?.numeroBoleto || '');
  const [observacoes, setObservacoes] = useState(boletoExistente?.observacoes || '');
  const [erros, setErros] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [sugestoesEmissor, setSugestoesEmissor] = useState([]);
  const [sugestoesDescricao, setSugestoesDescricao] = useState([]);

  useEffect(() => { navigation.setOptions({ title: boletoExistente ? 'Editar Boleto' : 'Adicionar Boleto' }); }, [navigation, boletoExistente]);

  const limparFormulario = () => { setEmissor(''); setDescricao(''); setValor(''); setDataVencimento(null); setNumeroBoleto(''); setObservacoes(''); setErros({}); };

  const validarCampos = () => {
    const novosErros = {};
    if (!emissor.trim()) novosErros.emissor = 'Emissor é obrigatório.';
    if (!descricao.trim()) novosErros.descricao = 'Descrição é obrigatória.';
    if (!valor || parseFloat(valor) === 0) novosErros.valor = 'Valor é obrigatório.';
    if (!dataVencimento || !isValid(dataVencimento)) { novosErros.vencimento = 'Data inválida.'; }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const processarSalvamento = () => {
    const dadosBoleto = { emissor: emissor.trim(), descricao: descricao.trim(), valor: parseFloat(valor) / 100, vencimento: dataVencimento.toISOString(), numeroBoleto: numeroBoleto.trim(), observacoes: observacoes.trim(), };
    if (boletoExistente) {
      atualizarBoleto({ ...boletoExistente, ...dadosBoleto });
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Boleto atualizado.' });
      navigation.goBack();
    } else {
      adicionarBoleto(dadosBoleto);
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Boleto adicionado à sua lista.' });
      limparFormulario();
    }
  };

  const handleSalvar = () => {
    if (!validarCampos()) { Toast.show({ type: 'error', text1: 'Atenção', text2: 'Por favor, corrija os campos marcados.' }); return; }
    const numBoletoTrimmed = numeroBoleto.trim();
    if (numBoletoTrimmed) {
      const duplicado = boletos.find(b => b.numeroBoleto === numBoletoTrimmed && b.id !== boletoExistente?.id);
      if (duplicado) {
        Alert.alert("Boleto Duplicado", `Já existe um boleto com este número para "${duplicado.emissor}".\n\nDeseja salvar mesmo assim?`,
          [{ text: "Cancelar", style: "cancel" }, { text: "Salvar Mesmo Assim", onPress: processarSalvamento }]
        );
      } else { processarSalvamento(); }
    } else { processarSalvamento(); }
  };
  
  const handleEmissorChange = (texto) => {
    setEmissor(texto);
    if (texto.length > 1) {
      const sugestoesFiltradas = todosEmissoresUnicos.filter(e => e.toLowerCase().includes(texto.toLowerCase()) && e.toLowerCase() !== texto.toLowerCase());
      setSugestoesEmissor(sugestoesFiltradas.slice(0, 4));
    } else {
      setSugestoesEmissor([]);
    }
  };

  const handleDescricaoChange = (texto) => {
    setDescricao(texto);
    if (texto.length > 2) {
      const sugestoesFiltradas = todasDescricoesUnicas.filter(d => d.toLowerCase().includes(texto.toLowerCase()) && d.toLowerCase() !== texto.toLowerCase());
      setSugestoesDescricao(sugestoesFiltradas.slice(0, 4));
    } else {
      setSugestoesDescricao([]);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}} keyboardVerticalOffset={90}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <EntradaPersonalizada label="Emissor" valor={emissor} onChangeText={handleEmissorChange} placeholder="Ex: Nome da Empresa" erro={erros.emissor} />
        {sugestoesEmissor.length > 0 && (
          <View style={styles.listaSugestoes}>
            {sugestoesEmissor.map(item => (
              <TouchableOpacity key={item} style={styles.sugestaoItem} onPress={() => { setEmissor(item); setSugestoesEmissor([]); }}>
                <Text style={styles.sugestaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* ================================================================== */}
        {/* A CORREÇÃO ESTÁ NA LINHA 'onChangeText' ABAIXO */}
        <EntradaPersonalizada 
          label="Descrição" 
          valor={descricao} 
          onChangeText={handleDescricaoChange} 
          placeholder="Ex: Assinatura, Parcela 3/12" 
          erro={erros.descricao} 
        />
        {/* ================================================================== */}

        {sugestoesDescricao.length > 0 && (
          <View style={styles.listaSugestoes}>
            {sugestoesDescricao.map(item => (
              <TouchableOpacity key={item} style={styles.sugestaoItem} onPress={() => { setDescricao(item); setSugestoesDescricao([]); }}>
                <Text style={styles.sugestaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor</Text>
            <MaskInput style={[styles.input, erros.valor ? styles.inputErro : null]} value={valor} onChangeText={(masked, unmasked) => setValor(unmasked)} mask={Masks.BRL_CURRENCY} keyboardType="numeric" placeholder="R$ 0,00" placeholderTextColor={tema.cores.cinza}/>
            {erros.valor && <Text style={styles.textoErro}>{erros.valor}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vencimento</Text>
          {Platform.OS === 'web' ? (
            <MaskInput style={[styles.input, erros.vencimento ? styles.inputErro : null]} value={dataVencimento && isValid(dataVencimento) ? format(dataVencimento, 'dd/MM/yyyy') : ''} mask={Masks.DATE_DDMMYYYY} placeholder="DD/MM/AAAA" keyboardType="numeric"
              onChangeText={(masked) => { if (masked.length === 10) { const dataParseada = parse(masked, 'dd/MM/yyyy', new Date()); if (isValid(dataParseada)) { setDataVencimento(dataParseada); } } }}/>
          ) : (
            <>
              <TouchableOpacity style={[styles.input, erros.vencimento ? styles.inputErro : null]} onPress={() => setDatePickerVisibility(true)}>
                  <Text style={dataVencimento ? styles.dateText : styles.datePlaceholder}>{dataVencimento && isValid(dataVencimento) ? format(dataVencimento, 'dd/MM/yyyy') : 'Selecione a data'}</Text>
                  <Ionicons name="calendar" size={24} color={tema.cores.cinza} />
              </TouchableOpacity>
              <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={(date) => { setDatePickerVisibility(false); setDataVencimento(date); }} onCancel={() => setDatePickerVisibility(false)} locale="pt_BR"/>
            </>
          )}
          {erros.vencimento && <Text style={styles.textoErro}>{erros.vencimento}</Text>}
        </View>
        <EntradaPersonalizada label="Número do Boleto (Opcional)" valor={numeroBoleto} onChangeText={setNumeroBoleto} placeholder="Linha digitável ou código de barras"/>
        <EntradaPersonalizada label="Observações (Opcional)" valor={observacoes} onChangeText={setObservacoes} multiline numberOfLines={3} style={styles.textArea}/>
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
  dateText: { fontSize: 16, color: tema.cores.texto, },
  datePlaceholder: { fontSize: 16, color: tema.cores.cinza, },
  inputErro: { borderColor: tema.cores.erro, },
  textoErro: { color: tema.cores.erro, fontSize: 12, marginTop: 4, },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: tema.espacamento.medio },
  botaoSalvar: { marginTop: tema.espacamento.grande, },
  listaSugestoes: { maxHeight: 150, backgroundColor: '#FAFAFA', borderRadius: tema.raioBorda.medio, marginTop: -8, marginBottom: 8, elevation: 3, borderColor: tema.cores.borda, borderWidth: 1, },
  sugestaoItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: tema.cores.borda, },
  sugestaoTexto: { fontSize: 16, color: tema.cores.texto },
});

export default FormularioBoletoTela;