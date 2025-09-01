import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const CardProduto = ({ 
  produto, 
  onPress, 
  onLongPress,
  isSelecionado,
  selectionModeAtivo
}) => {
  const primeiraImagem = produto.imagens && produto.imagens.length > 0
    ? { uri: produto.imagens[0] }
    : null; // Se não houver imagem, não mostraremos nada

  return (
    <TouchableOpacity 
      style={[styles.card, isSelecionado && styles.cardSelecionada]} 
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
    >
      {primeiraImagem ? (
        <Image source={primeiraImagem} style={styles.imagem} />
      ) : (
        <View style={styles.imagemPlaceholder}>
          <Feather name="image" size={24} color={tema.cores.cinza} />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.nome} numberOfLines={2}>{produto.nome}</Text>
        {/* NOVO: Adicionando Categoria */}
        <Text style={styles.categoria}>{produto.categoria?.nome || 'Sem categoria'}</Text>
        <Text style={styles.codigo}>Cód: {produto.codigoProduto || 'N/A'}</Text>
      </View>
      <View style={styles.precoEstoqueContainer}>
        <Text style={styles.preco}>
          {formatarMoeda((produto.valorVenda || 0) * 100)}
        </Text>
        <Text style={styles.estoque}>
          Estoque: {produto.estoqueDisponivel || 0}
        </Text>
      </View>
      {selectionModeAtivo && (
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkboxBase, isSelecionado && styles.checkboxChecked]}>
              {isSelecionado && <Feather name="check" size={18} color="white" />}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tema.cores.branco,
    borderRadius: 12,
    padding: tema.espacamento.medio,
    marginBottom: tema.espacamento.medio,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelecionada: {
    borderColor: tema.cores.primaria,
    backgroundColor: '#F3E9F9',
  },
  imagem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: tema.espacamento.medio,
  },
  imagemPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: tema.espacamento.medio,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: { 
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  nome: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: tema.cores.preto,
  },
  categoria: {
    fontSize: 12,
    color: tema.cores.primaria,
    backgroundColor: '#F3E9F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  codigo: { 
    fontSize: tema.fontes.tamanhoPequeno, 
    color: tema.cores.cinza 
  },
  precoEstoqueContainer: { 
    alignItems: 'flex-end', 
    justifyContent: 'center',
    height: '100%',
    paddingLeft: tema.espacamento.pequeno,
  },
  preco: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: tema.cores.verde,
    marginBottom: 4,
  },
  estoque: { 
    fontSize: tema.fontes.tamanhoPequeno, 
    color: tema.cores.preto 
  },
  checkboxContainer: {
    paddingLeft: tema.espacamento.medio,
    justifyContent: 'center',
    height: '100%',
  },
  checkboxBase: { 
    width: 26, 
    height: 26, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: tema.cores.primaria, 
    borderRadius: 13, 
    backgroundColor: '#fff' 
  },
  checkboxChecked: { 
    backgroundColor: tema.cores.primaria 
  },
});

export default CardProduto;