import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import HomeFornecedoresTela from '../modulos/fornecedores/telas/HomeFornecedoresTela';
import ListaFornecedoresTela from '../modulos/fornecedores/telas/ListaFornecedoresTela';
import CadastroFornecedorTela from '../modulos/fornecedores/telas/CadastroFornecedorTela';
import tema from '../estilos/tema';

const Stack = createNativeStackNavigator();

const PilhaFornecedoresNavegacao = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeFornecedores"
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="HomeFornecedores" 
        component={HomeFornecedoresTela} 
        options={{ title: 'Fornecedores' }}
      />
      <Stack.Screen 
        name="ListaFornecedores" 
        component={ListaFornecedoresTela} 
        options={({ navigation }) => ({
          title: 'Meus Fornecedores',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('CadastroFornecedor')} style={{ padding: 8 }}>
              <Feather name="plus" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="CadastroFornecedor" 
        component={CadastroFornecedorTela} 
        // ALTERADO: 'options' agora é uma função
        options={({ navigation, route }) => ({
          // Dica: Título dinâmico para edição/criação
          title: route.params?.fornecedorParaEditar ? 'Editar Fornecedor' : 'Novo Fornecedor',
          // ADICIONADO: Ícone de lista para voltar à listagem
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('ListaFornecedores')}>
              <Feather name="list" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default PilhaFornecedoresNavegacao;