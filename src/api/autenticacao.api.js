import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const CHAVE_USUARIOS = '@VendasApp:usuarios';

// Função auxiliar para buscar todos os usuários
const buscarTodosUsuarios = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_USUARIOS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao buscar usuários:', e);
    return [];
  }
};

// Simula o registro de um novo usuário
export const registrarUsuario = async (username, password) => {
  const usuarios = await buscarTodosUsuarios();

  if (usuarios.some(u => u.username === username)) {
    throw new Error('Nome de usuário já existe.');
  }

  const novoUsuario = {
    id: uuidv4(),
    username,
    password, // Em um app real, a senha seria hashada
    dataRegistro: Date.now(),
  };

  usuarios.push(novoUsuario);
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
  return novoUsuario;
};

// Simula a autenticação de um usuário
export const autenticarUsuario = async (username, password) => {
  const usuarios = await buscarTodosUsuarios();
  const usuario = usuarios.find(u => u.username === username && u.password === password);

  if (!usuario) {
    throw new Error('Nome de usuário ou senha inválidos.');
  }

  return usuario; // Em um app real, retornaria um token ou sessão
};