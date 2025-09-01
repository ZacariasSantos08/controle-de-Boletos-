import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tema from '../estilos/tema';
import ConfiguracoesTela from '../configuracoes/telas/ConfiguracoesTela';
import GerenciamentoAtributosTela from '../configuracoes/telas/GerenciamentoAtributosTela';

const Stack = createNativeStackNavigator();

const PilhaConfiguracoesNavegacao = () => {
  return (
    <Stack.Navigator
      initialRouteName="ConfiguracoesPrincipal"
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="ConfiguracoesPrincipal" 
        component={ConfiguracoesTela} 
        options={{ title: 'Configurações' }}
      />
      <Stack.Screen 
        name="GerenciamentoAtributos" 
        component={GerenciamentoAtributosTela} 
        options={{ title: 'Gerenciar Atributos' }}
      />
    </Stack.Navigator>
  );
};

export default PilhaConfiguracoesNavegacao;