import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginTela from '../modulos/autenticacao/telas/LoginTela';

const Stack = createNativeStackNavigator();

const PilhaAutenticacaoNavegacao = ({ onLoginSuccess }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {/* Passamos a função onLoginSuccess para a tela de Login */}
        {(props) => <LoginTela {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default PilhaAutenticacaoNavegacao;