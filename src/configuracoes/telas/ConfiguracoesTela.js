import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useConfiguracoes } from '../hooks/useConfiguracoes';
import CardFormulario from '../../componentes/CardFormulario';
import InputFormulario from '../../componentes/InputFormulario';
import Botao from '../../componentes/Botao';
import tema from '../../estilos/tema';
import { Feather } from '@expo/vector-icons';
import CardOpcao from '../../componentes/CardOpcao';

const ConfiguracoesTela = ({ navigation }) => {
  const { config, carregando, salvando, setValorCampo, salvarAlteracoes, exportarDados, importarDados } = useConfiguracoes();

  const lidarEscolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!resultado.canceled) {
      setValorCampo('logoUri', resultado.assets[0].uri);
    }
  };

  if (carregando) {
    return <View style={styles.containerCentralizado}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* ALTERADO: Adicionado o CardOpcao para navegação */}
      <View style={{paddingHorizontal: tema.espacamento.medio, paddingTop: tema.espacamento.medio}}>
        <CardOpcao 
          icone="tag"
          titulo="Gerenciar Atributos de Produtos"
          descricao="Edite categorias, marcas e outras propriedades"
          onPress={() => navigation.navigate('GerenciamentoAtributos')}
        />
      </View>
      
      <CardFormulario titulo="Dados da Empresa">
        <InputFormulario 
          label="Nome da Empresa"
          valor={config.nomeEmpresa}
          aoMudarTexto={(txt) => setValorCampo('nomeEmpresa', txt)}
        />
        <InputFormulario 
          label="Nome do Proprietário"
          valor={config.proprietario}
          aoMudarTexto={(txt) => setValorCampo('proprietario', txt)}
        />
        <InputFormulario 
          label="Endereço"
          valor={config.endereco}
          aoMudarTexto={(txt) => setValorCampo('endereco', txt)}
          multiline
        />
      </CardFormulario>
      <CardFormulario titulo="Logo da Empresa">
        <TouchableOpacity style={styles.logoPicker} onPress={lidarEscolherImagem}>
          {config.logoUri ? (
            <Image source={{ uri: config.logoUri }} style={styles.logoPreview} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Feather name="camera" size={40} color={tema.cores.cinza} />
              <Text style={styles.logoTexto}>Clique para escolher uma imagem</Text>
            </View>
          )}
        </TouchableOpacity>
      </CardFormulario>
      
      <CardFormulario titulo="Backup e Restauração">
        <View style={styles.backupContainer}>
          <Botao icone="download" titulo="Exportar Dados (Backup)" onPress={exportarDados} />
          <View style={{height: tema.espacamento.medio}} />
          <Botao icone="upload" titulo="Importar Dados (Restaurar)" onPress={importarDados} tipo="secundario" />
        </View>
      </CardFormulario>

      <View style={styles.botaoContainer}>
        <Botao titulo="Salvar Alterações" onPress={salvarAlteracoes} disabled={salvando} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  containerCentralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  botaoContainer: { padding: tema.espacamento.medio },
  logoPicker: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F1F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  logoTexto: {
    marginTop: tema.espacamento.pequeno,
    color: tema.cores.cinza,
  },
  backupContainer: {
    paddingVertical: tema.espacamento.pequeno,
  }
});

export default ConfiguracoesTela;