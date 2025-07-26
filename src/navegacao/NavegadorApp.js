import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import PainelTela from '../telas/PainelTela';
import ListaBoletosTela from '../telas/ListaBoletosTela';
import FormularioBoletoTela from '../telas/FormularioBoletoTela';
import EstatisticasTela from '../telas/EstatisticasTela';
import { tema } from '../estilos/tema';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PilhaBoletos() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: tema.cores.primaria }, headerTintColor: tema.cores.textoClaro, headerTitleStyle: { fontWeight: 'bold' }, }}>
      <Stack.Screen name="ListaBoletos" component={ListaBoletosTela} options={{ title: 'Meus Boletos' }} />
      <Stack.Screen name="FormularioBoleto" component={FormularioBoletoTela} options={({ route }) => ({ title: route.params?.boletoId ? 'Editar Boleto' : 'Adicionar Boleto' })} />
    </Stack.Navigator>
  );
}

export default function NavegadorApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Painel') iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'Boletos') iconName = focused ? 'list-circle' : 'list-circle-outline';
          else if (route.name === 'Adicionar') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Estatisticas') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: tema.cores.secundaria,
        tabBarInactiveTintColor: tema.cores.textoClaro,
        tabBarStyle: { backgroundColor: tema.cores.primaria, borderTopWidth: 0, elevation: 0 },
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 12 }
      })} >
      <Tab.Screen name="Painel" component={PainelTela} />
      <Tab.Screen 
        name="Boletos" 
        component={PilhaBoletos} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Boletos', { screen: 'ListaBoletos', params: { filtro: 'mostrar_tudo' }, merge: true, });
          },
        })}
      />
      <Tab.Screen name="Adicionar" component={FormularioBoletoTela}
        listeners={({ navigation }) => ({
          tabPress: (e) => { e.preventDefault(); navigation.navigate('Boletos', { screen: 'FormularioBoleto' }); },
        })} />
      <Tab.Screen name="Estatisticas" component={EstatisticasTela} />
    </Tab.Navigator>
  );
}