import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import HomeVendasTela from '../modulos/vendas/telas/HomeVendasTela';
import PdvTela from '../modulos/vendas/telas/PdvTela';
import FinalizarVendaTela from '../modulos/vendas/telas/FinalizarVendaTela';
import HistoricoVendasTela from '../modulos/vendas/telas/HistoricoVendasTela';
import DetalhesVendaTela from '../modulos/vendas/telas/DetalhesVendaTela';
import ReciboVendaTela from '../modulos/vendas/telas/ReciboVendaTela';
import tema from '../estilos/tema';

const Stack = createNativeStackNavigator();

const PilhaVendasNavegacao = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeVendas"
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="HomeVendas" 
        component={HomeVendasTela} 
        options={{ title: 'Vendas' }}
      />
      <Stack.Screen 
        name="Pdv" 
        component={PdvTela} 
        // ALTERADO: Adicionando ícone de lista
        options={({ navigation }) => ({
          title: 'Nova Venda',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('HistoricoVendas')}>
              <Feather name="list" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="FinalizarVenda" 
        component={FinalizarVendaTela} 
        // ALTERADO: Adicionando ícone de lista
        options={({ navigation }) => ({
          title: 'Finalizar Venda',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('HistoricoVendas')}>
              <Feather name="list" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="HistoricoVendas" 
        component={HistoricoVendasTela} 
        options={({ navigation }) => ({
          title: 'Histórico de Vendas',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Pdv')}>
              <Feather name="plus" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="DetalhesVenda" component={DetalhesVendaTela} options={{ title: 'Detalhes da Venda' }} />
      <Stack.Screen name="ReciboVenda" component={ReciboVendaTela} options={{ title: 'Recibo da Venda' }} />
    </Stack.Navigator>
  );
};

export default PilhaVendasNavegacao;