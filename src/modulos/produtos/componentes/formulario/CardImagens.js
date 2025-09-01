import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CardFormulario from '../../../../componentes/CardFormulario';
import { useFormularioProduto } from '../../contexts/FormularioProdutoContext';
import tema from '../../../../estilos/tema';

const CardImagens = () => {
  const { form, setFormField } = useFormularioProduto();

  const lidarEscolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!resultado.canceled) {
      const novasImagens = [...form.imagens, resultado.assets[0].uri];
      setFormField('imagens', novasImagens);
    }
  };
  
  const lidarRemoverImagem = (uri) => {
    const novasImagens = form.imagens.filter(imgUri => imgUri !== uri);
    setFormField('imagens', novasImagens);
  };

  const renderizarItemImagem = ({ item, drag, isActive }) => (
    <TouchableOpacity 
        onLongPress={drag} 
        disabled={isActive} 
        style={[
            styles.imagemWrapper, 
            { backgroundColor: isActive ? '#c8c8c8' : '#f0f0f0' }
        ]}
    >
      <Image source={{ uri: item }} style={styles.imagemPreview} />
      <TouchableOpacity style={styles.botaoRemoverImagem} onPress={() => lidarRemoverImagem(item)}>
        <Feather name="x" size={16} color={tema.cores.branco} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <CardFormulario titulo="Imagens do Produto" icone="image">
        <View style={styles.containerLista}>
          <DraggableFlatList
            data={form.imagens}
            renderItem={renderizarItemImagem}
            keyExtractor={(item) => item}
            onDragEnd={({ data }) => setFormField('imagens', data)}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={
              form.imagens.length < 5 ? (
                <TouchableOpacity style={styles.botaoUpload} onPress={lidarEscolherImagem}>
                  <Feather name="camera" size={24} color={tema.cores.cinza} />
                  <Text style={styles.uploadTexto}>Adicionar</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
        <Text style={styles.infoTexto}>Arraste para reordenar. A primeira é a principal.</Text>
      </CardFormulario>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    containerLista: { minHeight: 120 },
    botaoUpload: { width: 100, height: 100, borderRadius: 8, borderWidth: 2, borderColor: tema.cores.secundaria, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F9F9', marginLeft: 8 },
    uploadTexto: { fontSize: 12, color: tema.cores.cinza, marginTop: tema.espacamento.pequeno },
    imagemWrapper: { width: 100, height: 100, position: 'relative', marginRight: 8, borderRadius: 8 },
    imagemPreview: { width: '100%', height: '100%', borderRadius: 8 },
    botaoRemoverImagem: { position: 'absolute', top: -5, right: -5, backgroundColor: tema.cores.vermelho, borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', elevation: 4 },
    infoTexto: { textAlign: 'center', marginTop: tema.espacamento.medio, color: tema.cores.cinza, fontSize: 12 },
});

export default CardImagens;