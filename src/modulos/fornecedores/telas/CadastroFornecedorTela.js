import React from 'react';
import { ScrollView, View, StyleSheet, Text, Button, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import InputFormulario from '../../../componentes/InputFormulario';
import CardFormulario from '../../../componentes/CardFormulario';
import GrupoDeBotoes from '../../../componentes/GrupoDeBotoes';
import tema from '../../../estilos/tema';
import { formatarCPF, formatarCNPJ, formatarTelefone, formatarCEP } from '../../../utilitarios/formatadores';
import { useCadastroFornecedor } from '../hooks/useCadastroFornecedor';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const SeletorTipoPessoa = ({ tipo, setTipo, editando }) => (
  <View style={styles.seletorContainer}>
    <TouchableOpacity
      style={[styles.seletorBotao, tipo === 'Juridica' && styles.seletorAtivo]}
      onPress={() => setTipo('Juridica')}
      disabled={editando}
    >
      <Text style={[styles.seletorTexto, tipo === 'Juridica' && styles.seletorTextoAtivo]}>Pessoa Jurídica</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.seletorBotao, tipo === 'Fisica' && styles.seletorAtivo]}
      onPress={() => setTipo('Fisica')}
      disabled={editando}
    >
      <Text style={[styles.seletorTexto, tipo === 'Fisica' && styles.seletorTextoAtivo]}>Pessoa Física</Text>
    </TouchableOpacity>
  </View>
);

const CadastroFornecedorTela = () => {
  const { form, erros, salvando, buscandoCep, modoEdicao, refs, handleChange, handleCepBlur, lidarComSalvar } = useCadastroFornecedor();

  return (
<KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0} // Ajuste fino opcional
      enableOnAndroid={true}
    >
        <SeletorTipoPessoa tipo={form.tipoPessoa} setTipo={(val) => handleChange('tipoPessoa', val)} editando={modoEdicao} />

        <CardFormulario titulo="Informações Principais" icone="file-text">
          {form.tipoPessoa === 'Juridica' ? (
            <>
              <InputFormulario ref={refs.razaoSocial} label="Razão Social *" valor={form.razaoSocial} aoMudarTexto={(val) => handleChange('razaoSocial', val)} erro={erros.razaoSocial} returnKeyType="next" onSubmitEditing={() => refs.nomeFantasia.current?.focus()} />
              <InputFormulario ref={refs.nomeFantasia} label="Nome Fantasia" valor={form.nomeFantasia} aoMudarTexto={(val) => handleChange('nomeFantasia', val)} erro={erros.nomeFantasia} returnKeyType="next" onSubmitEditing={() => refs.cnpj.current?.focus()} />
              <InputFormulario ref={refs.cnpj} label="CNPJ" valor={form.cnpj} aoMudarTexto={(val) => handleChange('cnpj', val)} tipoTeclado="numeric" formatador={formatarCNPJ} erro={erros.cnpj} returnKeyType="next" onSubmitEditing={() => refs.email.current?.focus()} />
            </>
          ) : (
            <>
              <InputFormulario ref={refs.nomeCompleto} label="Nome Completo *" valor={form.nomeCompleto} aoMudarTexto={(val) => handleChange('nomeCompleto', val)} erro={erros.nomeCompleto} returnKeyType="next" onSubmitEditing={() => refs.cpf.current?.focus()} />
              <InputFormulario ref={refs.cpf} label="CPF" valor={form.cpf} aoMudarTexto={(val) => handleChange('cpf', val)} tipoTeclado="numeric" formatador={formatarCPF} erro={erros.cpf} returnKeyType="next" onSubmitEditing={() => refs.email.current?.focus()} />
            </>
          )}
        </CardFormulario>

        <CardFormulario titulo="Contato" icone="phone">
          <InputFormulario ref={refs.email} label="E-mail" valor={form.email} aoMudarTexto={(val) => handleChange('email', val)} tipoTeclado="email-address" erro={erros.email} autoCapitalize="none" returnKeyType="next" onSubmitEditing={() => refs.telefone.current?.focus()} />
          <InputFormulario ref={refs.telefone} label="Telefone" valor={form.telefone} aoMudarTexto={(val) => handleChange('telefone', val)} tipoTeclado="phone-pad" formatador={formatarTelefone} erro={erros.telefone} returnKeyType="next" onSubmitEditing={() => refs.cep.current?.focus()} />
        </CardFormulario>

        <CardFormulario titulo="Endereço" icone="map-pin">
          <InputFormulario ref={refs.cep} label="CEP" valor={form.cep} aoMudarTexto={(val) => handleChange('cep', val)} tipoTeclado="numeric" formatador={formatarCEP} erro={erros.cep} onBlur={handleCepBlur} rightComponent={buscandoCep ? <ActivityIndicator style={{marginRight: 10}}/> : null} returnKeyType="next" onSubmitEditing={() => refs.logradouro.current?.focus()} />
          <InputFormulario ref={refs.logradouro} label="Rua / Logradouro" valor={form.logradouro} aoMudarTexto={(val) => handleChange('logradouro', val)} erro={erros.logradouro} returnKeyType="next" onSubmitEditing={() => refs.numero.current?.focus()} />
          <View style={styles.linhaEndereco}>
              <View style={{flex: 1}}>
                  <InputFormulario ref={refs.numero} label="Número" valor={form.numero} aoMudarTexto={(val) => handleChange('numero', val)} tipoTeclado="numeric" erro={erros.numero} returnKeyType="next" onSubmitEditing={() => refs.complemento.current?.focus()} />
              </View>
              <View style={{width: tema.espacamento.medio}} />
              <View style={{flex: 2}}>
                  <InputFormulario ref={refs.complemento} label="Complemento" valor={form.complemento} aoMudarTexto={(val) => handleChange('complemento', val)} erro={erros.complemento} returnKeyType="next" onSubmitEditing={() => refs.bairro.current?.focus()} />
              </View>
          </View>
          <InputFormulario ref={refs.bairro} label="Bairro" valor={form.bairro} aoMudarTexto={(val) => handleChange('bairro', val)} erro={erros.bairro} returnKeyType="next" onSubmitEditing={() => refs.cidade.current?.focus()} />
          <View style={styles.linhaEndereco}>
              <View style={{flex: 2}}>
                  <InputFormulario ref={refs.cidade} label="Cidade" valor={form.cidade} aoMudarTexto={(val) => handleChange('cidade', val)} erro={erros.cidade} returnKeyType="next" onSubmitEditing={() => refs.estado.current?.focus()} />
              </View>
              <View style={{width: tema.espacamento.medio}} />
              <View style={{flex: 1}}>
                  <InputFormulario ref={refs.estado} label="UF" valor={form.estado} aoMudarTexto={(val) => handleChange('estado', val)} maxLength={2} autoCapitalize="characters" erro={erros.estado} returnKeyType="next" onSubmitEditing={() => refs.observacoes.current?.focus()} />
              </View>
          </View>
        </CardFormulario>

        <CardFormulario titulo="Outras Informações" icone="info">
          <InputFormulario ref={refs.observacoes} label="Observações" valor={form.observacoes} aoMudarTexto={(val) => handleChange('observacoes', val)} multiline numberOfLines={4} returnKeyType="default" />
        </CardFormulario>
        
        {modoEdicao && (
          <CardFormulario titulo="Status do Fornecedor" icone="toggle-right">
            <GrupoDeBotoes 
              opcoes={[{id: 'Ativo', nome: 'Ativo'}, {id: 'Inativo', nome: 'Inativo'}]}
              selecionado={form.status}
              aoSelecionar={(val) => handleChange('status', val)}
            />
          </CardFormulario>
        )}

        <View style={styles.botaoContainer}>
          <Button
            title={modoEdicao ? "Atualizar Fornecedor" : "Salvar Fornecedor"}
            onPress={lidarComSalvar}
            color={tema.cores.primaria}
            disabled={salvando}
          />
          {salvando && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={tema.cores.branco} />
            </View>
          )}
        </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  contentContainer: { padding: tema.espacamento.medio },
  seletorContainer: { flexDirection: 'row', width: '100%', backgroundColor: tema.cores.branco, borderRadius: 8, marginBottom: tema.espacamento.grande, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, },
  seletorBotao: { flex: 1, padding: tema.espacamento.medio, alignItems: 'center', borderRadius: 8 },
  seletorAtivo: { backgroundColor: tema.cores.primaria },
  seletorTexto: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.preto, fontWeight: 'bold' },
  seletorTextoAtivo: { color: tema.cores.branco },
  botaoContainer: { marginTop: tema.espacamento.grande, marginBottom: 50, position: 'relative' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 8, },
  linhaEndereco: { flexDirection: 'row' },
});

export default CadastroFornecedorTela;