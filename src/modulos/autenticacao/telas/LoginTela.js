import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { autenticarUsuario } from '../../../api/autenticacao.api';
import tema from '../../../estilos/tema';
import InputFormulario from '../../../componentes/InputFormulario';
import Botao from '../../../componentes/Botao';

const LoginTela = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const lidarComLogin = async () => {
    /*if (!username || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha o usuário e a senha.');
      return;
    }
    setCarregando(true);
    try {
      await autenticarUsuario(username, senha);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      Alert.alert('Erro de Login', error.message);
    } finally {
      setCarregando(false);
    } */
    onLoginSuccess();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={tema.cores.primaria} />
      
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name="shopping-bag" size={40} color={tema.cores.branco} />
        </View>
        <Text style={styles.titulo}>Bem-vindo(a)!</Text>
        <Text style={styles.subtitulo}>Acesse sua conta para continuar.</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.formTitulo}>Login</Text>
          <InputFormulario 
            label="Nome de usuário"
            placeholder="Digite seu usuário"
            valor={username}
            aoMudarTexto={setUsername}
            autoCapitalize="none"
          />
          <InputFormulario 
            label="Senha"
            placeholder="Digite sua senha"
            valor={senha}
            aoMudarTexto={setSenha}
            secureTextEntry={true}
          />
          <View style={styles.opcoesContainer}>
            <TouchableOpacity>
              <Text style={styles.linkTexto}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.botaoContainer}>
             <Botao 
                titulo={carregando ? "Entrando..." : "Entrar"}
                onPress={lidarComLogin} 
                disabled={carregando}
              />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tema.cores.primaria,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tema.espacamento.extraGrande,
    paddingTop: 30, // Espaço extra para o topo
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fundo translúcido
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tema.espacamento.grande,
  },
  titulo: {
    fontSize: tema.fontes.tamanhoTitulo,
    fontWeight: 'bold',
    color: tema.cores.branco,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: tema.fontes.tamanhoMedio,
    color: tema.cores.branco,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: tema.espacamento.pequeno,
  },
  formContainer: {
    flex: 2, // Ocupa mais espaço na tela
    backgroundColor: tema.cores.branco,
    borderTopLeftRadius: 30, // Cantos arredondados
    borderTopRightRadius: 30,
    padding: tema.espacamento.grande,
    paddingTop: tema.espacamento.extraGrande,
  },
  formTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: tema.cores.preto,
    marginBottom: tema.espacamento.grande,
  },
  opcoesContainer: {
    alignItems: 'flex-end',
    marginBottom: tema.espacamento.grande,
  },
  linkTexto: {
    color: tema.cores.primaria,
    fontWeight: 'bold',
  },
  botaoContainer: {
    marginTop: tema.espacamento.medio,
  },
});

export default LoginTela;