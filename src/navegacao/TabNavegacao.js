import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import PilhaProdutosNavegacao from './PilhaProdutosNavegacao';
import PilhaClientesNavegacao from './PilhaClientesNavegacao';
import PilhaVendasNavegacao from './PilhaVendasNavegacao';
import PilhaFornecedoresNavegacao from './PilhaFornecedoresNavegacao';
import DashboardTela from '../modulos/dashboard/telas/DashboardTela';
import tema from '../estilos/tema';

const Tab = createBottomTabNavigator();

const TabNavegacao = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Início') {
              iconName = 'home';
            } else if (route.name === 'Produtos') {
              iconName = 'package';
            } else if (route.name === 'Clientes') {
              iconName = 'users';
            } else if (route.name === 'Vendas') {
              iconName = 'shopping-cart';
            } else if (route.name === 'Fornecedores') {
              iconName = 'truck';
            }
            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: tema.cores.primaria,
          tabBarInactiveTintColor: tema.cores.cinza,
        })}
      >
        {/* ALTERADO: Ordem das abas ajustada e Contas/Relatórios removidos */}
        <Tab.Screen name="Início" component={DashboardTela} />
        <Tab.Screen name="Produtos" component={PilhaProdutosNavegacao} />
        <Tab.Screen name="Clientes" component={PilhaClientesNavegacao} />
        <Tab.Screen name="Vendas" component={PilhaVendasNavegacao} />
        <Tab.Screen name="Fornecedores" component={PilhaFornecedoresNavegacao} />
      </Tab.Navigator>
      <Toast />
    </>
  );
};

export default TabNavegacao;