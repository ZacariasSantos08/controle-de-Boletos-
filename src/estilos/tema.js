import { Appearance } from 'react-native';

// Detecta o tema do dispositivo (light ou dark)
const colorScheme = Appearance.getColorScheme() || 'light';

// Paleta de cores para o tema claro
const lightColors = {
  primaria: '#005792',
  secundaria: '#00BBF0',
  fundo: '#F0F4F7',
  superficie: '#FFFFFF', // Cor para cards e modais
  texto: '#333333',
  textoClaro: '#FFFFFF',
  borda: '#DDDDDD',
  sucesso: '#28a745',
  aviso: '#ffc107',
  erro: '#dc3545',
  cinza: '#6c757d',
};

// Paleta de cores para o tema escuro
const darkColors = {
  primaria: '#007bff', // Um azul um pouco mais vibrante para o fundo escuro
  secundaria: '#00BBF0',
  fundo: '#121212', // Fundo principal escuro
  superficie: '#1e1e1e', // Cor para cards e modais
  texto: '#E0E0E0', // Texto principal claro (não branco puro)
  textoClaro: '#FFFFFF',
  borda: '#272727', // Borda sutil
  sucesso: '#28a745',
  aviso: '#ffc107',
  erro: '#cf6679', // Vermelho mais suave para tema escuro
  cinza: '#888888',
};

// Seleciona a paleta correta baseada no tema do dispositivo
const colors = colorScheme === 'light' ? lightColors : darkColors;

export const tema = {
  cores: colors, // Usa a paleta de cores selecionada
  espacamento: {
    pequeno: 8,
    medio: 16,
    grande: 24,
  },
  tipografia: {
    titulo: { fontSize: 24, fontWeight: 'bold' },
    subtitulo: { fontSize: 18, fontWeight: '600' },
    corpo: { fontSize: 16 },
    legenda: { fontSize: 14 },
  },
  raioBorda: {
    pequeno: 4,
    medio: 8,
    grande: 16,
  },
  // Adiciona o nome do tema para referência futura, se precisarmos
  nomeTema: colorScheme, 
};