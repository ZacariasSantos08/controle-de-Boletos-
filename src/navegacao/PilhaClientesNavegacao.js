import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import ListaClientesTela from '../modulos/clientes/telas/ListaClientesTela';
import CadastroClienteTela from '../modulos/clientes/telas/CadastroClienteTela';
import tema from '../estilos/tema';
import HomeClientesTela from '../modulos/clientes/telas/HomeClientesTela';

const Stack = createNativeStackNavigator();

const PilhaClientesNavegacao = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeClientes"
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="HomeClientes" 
        component={HomeClientesTela} 
        options={{ title: 'Clientes' }} 
      />
      <Stack.Screen 
        name="ListaClientes" 
        component={ListaClientesTela} 
        options={({ navigation }) => ({ 
          title: 'Lista de Clientes',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('CadastroCliente')}>
              <Feather name="plus" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })} 
      />
      <Stack.Screen 
        name="CadastroCliente" 
        component={CadastroClienteTela} 
        // ALTERADO: 'options' agora é uma função para acessar a navegação e a rota
        options={({ navigation, route }) => ({
          // Dica: O título agora é dinâmico, baseado se estamos editando ou criando
          title: route.params?.clienteParaEditar ? 'Editar Cliente' : 'Novo Cliente',
          // ADICIONADO: Ícone de lista para voltar à listagem
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('ListaClientes')}>
              <Feather name="list" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default PilhaClientesNavegacao;