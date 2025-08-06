import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import PainelTela from '../telas/PainelTela';
import ListaBoletosTela from '../telas/ListaBoletosTela';
import FormularioBoletoTela from '../telas/FormularioBoletoTela';
import EstatisticasTela from '../telas/EstatisticasTela';
import ScannerTela from '../telas/ScannerTela';
import ConfiguracoesTela from '../telas/ConfiguracoesTela'; // ATUALIZAÇÃO: Importando
import { tema } from '../estilos/tema';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PilhaBoletos() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.textoClaro,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ListaBoletos"
        component={ListaBoletosTela}
        options={({ navigation }) => ({ // ATUALIZAÇÃO: Adicionando ícone de configurações
          title: 'Meus Boletos',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Configuracoes')}
              style={{ marginRight: tema.espacamento.medio }}
            >
              <Ionicons name="settings-outline" size={24} color={tema.cores.textoClaro} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="FormularioBoleto"
        component={FormularioBoletoTela}
        options={({ route }) => ({
          title: route.params?.boletoId ? 'Editar Boleto' : 'Adicionar Boleto',
        })}
      />
      <Stack.Screen
        name="ScannerTela"
        component={ScannerTela}
        options={{ headerShown: false }}
      />
      {/* ATUALIZAÇÃO: Adicionando a nova tela à pilha */}
      <Stack.Screen
        name="Configuracoes"
        component={ConfiguracoesTela}
        options={{ title: 'Configurações' }}
      />
    </Stack.Navigator>
  );
}

export default function NavegadorApp() {
  const cores = tema.cores;
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cores.primaria,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: cores.secundaria,
        tabBarInactiveTintColor: cores.textoClaro,
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 12 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const navState = navigation.getState();
          const boletosRouteState = navState.routes.find(r => r.name === 'Boletos')?.state;
          const activeStackScreen = boletosRouteState ? boletosRouteState.routes[boletosRouteState.index]?.name : '';

          let isTabActive = focused;
          
          if (route.name === 'Boletos' && (activeStackScreen === 'ListaBoletos' || activeStackScreen === 'FormularioBoleto' || activeStackScreen === 'ScannerTela' || activeStackScreen === 'Configuracoes')) {
              isTabActive = true;
          }

          if (route.name === 'Painel') {
            iconName = isTabActive ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Boletos') {
            iconName = isTabActive ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'Adicionar') {
            iconName = isTabActive ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Estatisticas') {
            iconName = isTabActive ? 'stats-chart' : 'stats-chart-outline';
          }

          const iconColor = isTabActive ? cores.secundaria : cores.textoClaro;
          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen name="Painel" component={PainelTela} />
      <Tab.Screen
        name="Boletos"
        component={PilhaBoletos}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Boletos', { screen: 'ListaBoletos' });
          },
        })}
      />
      <Tab.Screen
        name="Adicionar"
        component={FormularioBoletoTela}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Boletos', { screen: 'FormularioBoleto' });
          },
        })}
      />
      <Tab.Screen name="Estatisticas" component={EstatisticasTela} />
    </Tab.Navigator>
  );
}