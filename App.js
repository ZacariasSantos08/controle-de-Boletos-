import 'react-native-gesture-handler'; 
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import tema from './src/estilos/tema';
import DrawerNavegacao from './src/navegacao/DrawerNavegacao';
import PilhaAutenticacaoNavegacao from './src/navegacao/PilhaAutenticacaoNavegacao';

export default function App() {
  // Este estado controla se o usuário está logado ou não.
  // Em um app real, o valor inicial viria do AsyncStorage (ex: um token salvo).
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  // Esta função será chamada pela tela de Login em caso de sucesso
  const handleLoginSuccess = () => {
    setUsuarioAutenticado(true);
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={tema.cores.primaria} />
      
      {/* Se o usuário estiver autenticado, mostra o app principal. Senão, a tela de login. */}
      {usuarioAutenticado ? (
        <DrawerNavegacao />
      ) : (
        <PilhaAutenticacaoNavegacao onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer> 
  );
}