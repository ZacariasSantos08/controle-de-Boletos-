import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import TabNavegacao from './TabNavegacao';
import PilhaRelatoriosNavegacao from './PilhaRelatoriosNavegacao';
import PilhaConfiguracoesNavegacao from './PilhaConfiguracoesNavegacao';
import PilhaContasNavegacao from './PilhaContasNavegacao';
import tema from '../estilos/tema';

const Drawer = createDrawerNavigator();

const DrawerNavegacao = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.branco,
        drawerActiveTintColor: tema.cores.primaria,
        drawerInactiveTintColor: tema.cores.cinza,
        drawerLabelStyle: { marginLeft: -8, fontSize: 14 },
      }}
    >
      <Drawer.Screen 
        name="InicioPrincipal" 
        component={TabNavegacao} 
        options={{ 
          title: 'Início',
          drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Contas" 
        component={PilhaContasNavegacao} 
        options={{ 
          title: 'Financeiro',
          drawerIcon: ({ color, size }) => <Feather name="dollar-sign" size={size} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Relatorios" 
        component={PilhaRelatoriosNavegacao} 
        options={{ 
          title: 'Relatórios',
          drawerIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="Configuracoes" 
        component={PilhaConfiguracoesNavegacao} 
        options={{ 
          title: 'Configurações',
          drawerIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavegacao;