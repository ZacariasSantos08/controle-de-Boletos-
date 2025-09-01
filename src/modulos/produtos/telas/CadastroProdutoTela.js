import React, { useLayoutEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, ActivityIndicator, Text, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FormularioProdutoProvider, useFormularioProduto } from '../contexts/FormularioProdutoContext';
import CardInfoGerais from '../componentes/formulario/CardInfoGerais';
import CardPrecosCustos from '../componentes/formulario/CardPrecosCustos';
import CardDimensoes from '../componentes/formulario/CardDimensoes';
import CardEstoque from '../componentes/formulario/CardEstoque';
import CardImagens from '../componentes/formulario/CardImagens';
import CardDetalhesAdicionais from '../componentes/formulario/CardDetalhesAdicionais';
import ModaisFormularioProduto from '../componentes/formulario/ModaisFormularioProduto';
import tema from '../../../estilos/tema';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CabecalhoFormulario = () => {
  const { modoEdicao, lidarComSalvarProduto, navigation, salvando } = useFormularioProduto();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: modoEdicao ? 'Editar Produto' : 'Novo Produto',
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {salvando ? (
            <ActivityIndicator color={tema.cores.branco} style={{padding: tema.espacamento.pequeno}}/>
          ) : (
            <TouchableOpacity style={styles.headerButton} onPress={lidarComSalvarProduto} disabled={salvando}>
              <Feather name="check" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          )}
        </View>
      )
    });
  }, [navigation, modoEdicao, lidarComSalvarProduto, salvando]);

  return null;
};

const InterruptorDetalhes = () => {
    const { form, setFormField } = useFormularioProduto();
    return (
        <View style={styles.interruptorContainer}>
            <Text style={styles.interruptorTexto}>Adicionar detalhes como cor, tamanho, etc.?</Text>
            <Switch
                trackColor={{ false: "#E0E0E0", true: "#D5B6E9" }}
                thumbColor={form.mostrarDetalhes ? tema.cores.primaria : "#f4f3f4"}
                onValueChange={(valor) => setFormField('mostrarDetalhes', valor)}
                value={form.mostrarDetalhes}
            />
        </View>
    );
}

const ConteudoFormulario = () => {
    const { form, scrollViewRef, cardRefs } = useFormularioProduto();
  
    return (
      <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0} // Ajuste fino opcional
      enableOnAndroid={true}>

          <View ref={ref => cardRefs.current['nome'] = ref}>
              <CardInfoGerais />
          </View>
          <View ref={ref => cardRefs.current['valorVenda'] = ref}>
              <CardPrecosCustos />
          </View>
          <CardDimensoes />
          <CardEstoque />
          
          <InterruptorDetalhes />
          {form.mostrarDetalhes && <CardDetalhesAdicionais />}

          <CardImagens />
      </KeyboardAwareScrollView>
    );
};

const CadastroProdutoTela = ({ route, navigation }) => {
  return (
    <FormularioProdutoProvider 
      produtoParaEditar={route.params?.produtoParaEditar}
      navigation={navigation}
      route={route}
    >
      <CabecalhoFormulario />
      <ConteudoFormulario />
      <ModaisFormularioProduto />
    </FormularioProdutoProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  contentContainer: { padding: tema.espacamento.medio, paddingBottom: 50 },
  headerRightContainer: { flexDirection: 'row', gap: tema.espacamento.grande },
  headerButton: { padding: tema.espacamento.pequeno },
  interruptorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tema.cores.branco,
    paddingVertical: tema.espacamento.pequeno,
    paddingHorizontal: tema.espacamento.medio,
    borderRadius: 8,
    marginBottom: tema.espacamento.grande,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  interruptorTexto: {
    fontSize: 15,
    flex: 1,
    marginRight: tema.espacamento.medio,
    color: tema.cores.preto,
  },
});

export default CadastroProdutoTela;