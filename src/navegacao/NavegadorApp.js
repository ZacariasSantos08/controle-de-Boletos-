import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
    // CORREÇÃO 1: Usando tema.cores em vez de tema.light.cores
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: tema.cores.primaria }, headerTintColor: tema.cores.textoClaro, headerTitleStyle: { fontWeight: 'bold' }, }}>
      <Stack.Screen name="ListaBoletos" component={ListaBoletosTela} options={{ title: 'Meus Boletos' }} />
      <Stack.Screen name="FormularioBoleto" component={FormularioBoletoTela} options={({ route }) => ({ title: route.params?.boletoId ? 'Editar Boleto' : 'Adicionar Boleto' })} />
    </Stack.Navigator>
  );
}

const BotaoTabBarPersonalizado = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.botaoAdicionarContainer}
    onPress={onPress}
  >
    <View style={styles.botaoAdicionarView}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function NavegadorApp() {
  // CORREÇÃO 2: Usando tema.cores em vez de tema.light.cores
  const cores = tema.cores;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { 
          backgroundColor: cores.primaria, 
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Painel') iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'Boletos') iconName = focused ? 'list-circle' : 'list-circle-outline';
          else if (route.name === 'Adicionar') iconName = 'add';
          else if (route.name === 'Estatisticas') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          
          const iconSize = route.name === 'Adicionar' ? size + 10 : size;
          const iconColor = route.name === 'Adicionar' ? cores.primaria : (focused ? cores.secundaria : cores.textoClaro);

          return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
        },
      })} >
      <Tab.Screen name="Painel" component={PainelTela} />
      <Tab.Screen 
        name="Boletos" 
        component={PilhaBoletos} 
        listeners={({ navigation }) => ({
          tabPress: (e) => { e.preventDefault(); navigation.navigate('Boletos', { screen: 'ListaBoletos', params: { filtro: 'mostrar_tudo' }, merge: true, }); },
        })}
      />
      <Tab.Screen 
        name="Adicionar" 
        component={FormularioBoletoTela}
        options={{
          tabBarButton: (props) => (
            <BotaoTabBarPersonalizado {...props} />
          )
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => { e.preventDefault(); navigation.navigate('Boletos', { screen: 'FormularioBoleto' }); },
        })} 
      />
      <Tab.Screen name="Estatisticas" component={EstatisticasTela} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  botaoAdicionarContainer: {
    top: -1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoAdicionarView: {
    width: 40,
    height: 40,
    borderRadius: 30,
    // CORREÇÃO 3: Usando tema.cores em vez de tema.light.cores
    backgroundColor: tema.cores.secundaria,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});