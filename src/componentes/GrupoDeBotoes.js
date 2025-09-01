import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../estilos/tema';

const GrupoDeBotoes = ({ label, opcoes, selecionado, aoSelecionar }) => {
  const handlePress = (opcaoId) => {
    // Se o botão já selecionado for clicado de novo, limpa a seleção
    if (selecionado === opcaoId) {
      aoSelecionar(null);
    } else {
      aoSelecionar(opcaoId);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.opcoesContainer}>
        {opcoes.map((opcao) => {
          const isSelecionado = selecionado === opcao.id;
          const corTexto = isSelecionado ? tema.cores.branco : tema.cores.preto;

          return(
            <TouchableOpacity
              key={opcao.id}
              style={[styles.botao, isSelecionado && styles.botaoSelecionado]}
              onPress={() => handlePress(opcao.id)}
            >
              {opcao.icone && <Feather name={opcao.icone} size={16} color={corTexto} style={styles.icone} />}
              <Text style={[styles.textoBotao, isSelecionado && styles.textoSelecionado]}>
                {opcao.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: tema.espacamento.pequeno,
  },
  label: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.preto,
    marginBottom: tema.espacamento.pequeno,
    fontWeight: 'bold',
  },
  opcoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tema.espacamento.pequeno,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tema.espacamento.pequeno,
    paddingHorizontal: tema.espacamento.medio,
    backgroundColor: tema.cores.branco,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
  },
  botaoSelecionado: {
    backgroundColor: tema.cores.primaria,
    borderColor: tema.cores.primaria,
  },
  icone: {
    marginRight: tema.espacamento.pequeno,
  },
  textoBotao: {
    color: tema.cores.preto,
    fontWeight: '500',
  },
  textoSelecionado: {
    color: tema.cores.branco,
    fontWeight: 'bold',
  },
});

export default GrupoDeBotoes;