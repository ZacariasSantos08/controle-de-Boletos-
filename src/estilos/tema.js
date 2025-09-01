const tema = {
  cores: {
    // Cores Principais
    primaria: '#2A6B7B', // Azul-petróleo profundo (elegante, substitui o ciano vibrante)
    secundaria: '#F8FAFC', // Branco suave com tom acinzentado (fundo limpo)
    acento: '#FFD700', // Dourado suave para detalhes de destaque (moderno e sofisticado)

    // Cores de Ação e Status
    verde: '#34C759', // Verde moderno (inspirado no iOS, para sucesso)
    vermelho: '#FF3B30', // Vermelho vibrante, mas elegante (para erros)
    amarelo: '#FF9500', // Amarelo suave para alertas ou destaques

    // Cores de Texto e UI
    branco: '#FFFFFF', // Branco puro
    preto: '#1A1A1A', // Preto suave (menos agressivo que o grafite escuro)
    cinza: '#6B7280', // Cinza-azulado (moderno, para textos secundários)
    cinzaClaro: '#D1D5DB', // Cinza claro para bordas e fundos secundários
  },
  fontes: {
    familiaRegular: 'Inter-Regular', // Fonte moderna e limpa
    familiaBold: 'Inter-Bold',
    familiaSemiBold: 'Inter-SemiBold', // Para hierarquia intermediária
    tamanhoPequeno: 12, // Ajustado para maior refinamento
    tamanhoMedio: 14,
    tamanhoGrande: 18,
    tamanhoTitulo: 24, // Ligeiramente menor para elegância
  },
  espacamento: {
    pequeno: 8,
    medio: 16,
    grande: 24,
    extraGrande: 32, // Adicionado para layouts mais amplos
  },
  bordas: {
    pequena: 4,
    media: 8,
    grande: 12,
  },
  sombras: {
    pequena: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // Para Android
    },
    media: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
  },
};

export default tema;