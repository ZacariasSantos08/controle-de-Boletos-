import 'react-native-gesture-handler'
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import NavegadorApp from './src/navegacao/NavegadorApp';
import { ProvedorBoletos } from './src/contexto/ContextoBoletos';
import { tema } from './src/estilos/tema';

export default function App() {
  return (
    // Usamos um Fragment <> para ter o Toast como irmão da Navegação
    <>
      <NavigationContainer>
        <ProvedorBoletos>
          <StatusBar barStyle="light-content" backgroundColor={tema.cores.primaria} />
          <NavegadorApp />
        </ProvedorBoletos>
      </NavigationContainer>
      {/* O Toast precisa ser renderizado no topo para aparecer sobre tudo */}
      <Toast />
    </>
  );
}