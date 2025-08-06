import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import NavegadorApp from './src/navegacao/NavegadorApp';
import { ProvedorBoletos } from './src/contexto/ContextoBoletos';
import { tema } from './src/estilos/tema';

export default function App() {
  return (
    <>
      <NavigationContainer>
        <ProvedorBoletos>
          <StatusBar
            barStyle={tema.nomeTema === 'light' ? 'light-content' : 'dark-content'}
            backgroundColor={tema.cores.primaria}
          />
          <NavegadorApp />
        </ProvedorBoletos>
      </NavigationContainer>
      <Toast />
    </>
  );
}