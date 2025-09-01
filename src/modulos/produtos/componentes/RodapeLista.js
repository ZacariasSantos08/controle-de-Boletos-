import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import tema from '../../../estilos/tema';

export const RodapeLista = ({ carregandoMais }) => {
  if (!carregandoMais) return null;
  return (
    <View style={{ paddingVertical: 20 }}>
      <ActivityIndicator size="large" color={tema.cores.primaria} />
    </View>
  );
};