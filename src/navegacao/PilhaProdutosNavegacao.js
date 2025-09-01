import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import HomeProdutosTela from '../modulos/produtos/telas/HomeProdutosTela';
import ListaProdutosTela from '../modulos/produtos/telas/ListaProdutosTela';
import CadastroProdutoTela from '../modulos/produtos/telas/CadastroProdutoTela';
import tema from '../estilos/tema';

const Stack = createNativeStackNavigator();

const PilhaProdutosNavegacao = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="HomeProdutos" 
        component={HomeProdutosTela} 
        options={{ title: 'Produtos' }}
      />
      <Stack.Screen 
        name="ListaProdutos" 
        component={ListaProdutosTela} 
        options={({ navigation }) => ({ 
          title: 'Meus Produtos',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('CadastroProduto')}>
              <Feather name="plus" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })} 
      />
      <Stack.Screen 
        name="CadastroProduto" 
        component={CadastroProdutoTela}
        // ALTERADO: 'options' agora é uma função
        options={({ navigation }) => ({
          // O título desta tela já é definido dinamicamente dentro do próprio componente,
          // então aqui apenas adicionamos o botão de lista.
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('ListaProdutos')}>
              <Feather name="list" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default PilhaProdutosNavegacao;