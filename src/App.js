import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, CheckCircle, Calendar, TrendingUp, 
  AlertCircle, Target, Flame, RefreshCw, Plus, X, Menu,
  Trash2, Activity, BarChart3, Dumbbell, Award, Zap
} from 'lucide-react';

// ⚡ Storage corrigido
const storage = {
  get: async (key) => {
    try {
      const item = localStorage.getItem(key);
      return { value: item ? JSON.parse(item) : null };
    } catch (err) {
      return { value: null };
    }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  }
};

const WorkoutSystem = () => {
  const [currentWorkout, setCurrentWorkout] = useState('A');
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [showHistory, setShowHistory] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(null);
  const [customExercises, setCustomExercises] = useState({A: [], B: [], C: []});
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', target: '', tips: '' });
  
  // 🆕 NOVOS ESTADOS
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workout');
  const [showClearHistory, setShowClearHistory] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentResult = await storage.get('current-workout');
        const historyResult = await storage.get('workout-history');
        const customResult = await storage.get('custom-exercises');
        
        if (currentResult?.value) setCurrentWorkout(currentResult.value);
        if (historyResult?.value) setWorkoutHistory(JSON.parse(historyResult.value));
        if (customResult?.value) setCustomExercises(JSON.parse(customResult.value));
      } catch (err) {
        console.log('Primeira vez usando o sistema');
      }
    };
    loadData();
  }, []);

  // 🆕 FUNÇÃO PARA LIMPAR HISTÓRICO DE UM EXERCÍCIO
  const clearExerciseHistory = async (exerciseId) => {
    const newHistory = { ...workoutHistory };
    delete newHistory[exerciseId];
    setWorkoutHistory(newHistory);
    try {
      await storage.set('workout-history', JSON.stringify(newHistory));
    } catch (err) {
      console.error('Erro ao limpar histórico:', err);
    }
    setShowClearHistory(null);
  };

  // 🆕 FUNÇÃO PARA LIMPAR TODO O HISTÓRICO
  const clearAllHistory = async () => {
    setWorkoutHistory({});
    try {
      await storage.set('workout-history', JSON.stringify({}));
    } catch (err) {
      console.error('Erro ao limpar histórico:', err);
    }
  };

  const exerciseAlternatives = {
    'a1': [
      { name: 'Supino com Halteres', target: 'Peitoral completo', muscle: '💪 Peito', reason: 'Mais amplitude e trabalho estabilizador' },
      { name: 'Flexão com Carga', target: 'Peitoral e core', muscle: '💪 Peito + Core', reason: 'Funcional, trabalha estabilização' }
    ],
    'a2': [
      { name: 'Supino Inclinado com Halteres', target: 'Peitoral superior', muscle: '💪 Peito Superior', reason: 'Maior amplitude de movimento' },
      { name: 'Crossover Inclinado', target: 'Peitoral superior', muscle: '💪 Peito Superior', reason: 'Isolamento perfeito' }
    ],
    'a3': [
      { name: 'Crossover Polia', target: 'Abertura peitoral', muscle: '💪 Peito', reason: 'Tensão constante no músculo' },
      { name: 'Crucifixo com Halteres', target: 'Abertura peitoral', muscle: '💪 Peito', reason: 'Trabalho unilateral' }
    ],
    'a4': [
      { name: 'Desenvolvimento com Halteres', target: 'Ombros', muscle: '🔺 Ombros', reason: 'Maior amplitude e estabilização' },
      { name: 'Arnold Press', target: 'Ombros completos', muscle: '🔺 Ombros', reason: 'Rotação ativa todas as cabeças' }
    ],
    'a5': [
      { name: 'Elevação Lateral na Polia', target: 'Ombros laterais', muscle: '🔺 Ombros', reason: 'Tensão constante' },
      { name: 'Elevação Frontal', target: 'Ombros frontais', muscle: '🔺 Ombros', reason: 'Trabalha parte frontal' }
    ],
    'a6': [
      { name: 'Tríceps Testa (Skull Crusher)', target: 'Tríceps', muscle: '💪 Tríceps', reason: 'Isola perfeitamente' },
      { name: 'Mergulho no Banco', target: 'Tríceps', muscle: '💪 Tríceps', reason: 'Usa peso corporal' }
    ],
    'a7': [
      { name: 'Tríceps Coice (Kickback)', target: 'Tríceps', muscle: '💪 Tríceps', reason: 'Isolamento total' },
      { name: 'Tríceps Overhead Polia', target: 'Cabeça longa', muscle: '💪 Tríceps', reason: 'Alonga mais a cabeça longa' }
    ],
    'a8': [
      { name: 'Tríceps Barra Reta', target: 'Tríceps', muscle: '💪 Tríceps', reason: 'Pegada neutra, mais força' },
      { name: 'Tríceps Unilateral Polia', target: 'Tríceps', muscle: '💪 Tríceps', reason: 'Trabalho isolado de cada braço' }
    ],
    'b1': [
      { name: 'Barra Fixa (Pull-up)', target: 'Largura costas', muscle: '🏔️ Costas', reason: 'Melhor exercício para costas em V' },
      { name: 'Puxada Fechada', target: 'Espessura costas', muscle: '🏔️ Costas', reason: 'Ênfase no meio das costas' }
    ],
    'b2': [
      { name: 'Remada Curvada com Barra', target: 'Costas completas', muscle: '🏔️ Costas', reason: 'Exercício clássico de massa' },
      { name: 'Remada com Halteres', target: 'Costas unilateral', muscle: '🏔️ Costas', reason: 'Corrige desequilíbrios' }
    ],
    'b3': [
      { name: 'Remada Cavalinho', target: 'Espessura', muscle: '🏔️ Costas', reason: 'Menos sobrecarga lombar' },
      { name: 'Pullover Máquina', target: 'Dorsais', muscle: '🏔️ Costas', reason: 'Isolamento do latíssimo' }
    ],
    'b4': [
      { name: 'Crucifixo Inverso com Halteres', target: 'Posterior ombro', muscle: '🔺 Ombro Posterior', reason: 'Trabalho livre' },
      { name: 'Face Pull', target: 'Posterior + Trapézio', muscle: '🔺 Ombro + Postura', reason: 'Excelente para postura' }
    ],
    'b5': [
      { name: 'Rosca Direta Barra', target: 'Bíceps completo', muscle: '💪 Bíceps', reason: 'Exercício clássico' },
      { name: 'Rosca Martelo', target: 'Braquial + Bíceps', muscle: '💪 Bíceps + Antebraço', reason: 'Constrói espessura do braço' }
    ],
    'b6': [
      { name: 'Rosca 21', target: 'Bíceps completo', muscle: '💪 Bíceps', reason: 'Método de alta intensidade' },
      { name: 'Rosca Concentrada', target: 'Pico do bíceps', muscle: '💪 Bíceps', reason: 'Isolamento máximo' }
    ],
    'c1': [
      { name: 'Agachamento Livre', target: 'Pernas completas', muscle: '🦵 Pernas', reason: 'Rei dos exercícios' },
      { name: 'Hack Machine', target: 'Quadríceps', muscle: '🦵 Quadríceps', reason: 'Menos sobrecarga lombar' }
    ],
    'c2': [
      { name: 'Hip Thrust com Barra', target: 'Glúteos', muscle: '🍑 Glúteos', reason: 'Mais carga, mais resultado' },
      { name: 'Glute Bridge Unilateral', target: 'Glúteo isolado', muscle: '🍑 Glúteos', reason: 'Corrige assimetrias' }
    ],
    'c3': [
      { name: 'Afundo Búlgaro', target: 'Glúteos + Quadríceps', muscle: '🍑 Glúteos', reason: 'Unilateral, alto trabalho glúteo' },
      { name: 'Stiff Sumô', target: 'Posterior + Glúteos', muscle: '🦵 Posterior', reason: 'Alonga e fortalece posterior' }
    ],
    'c4': [
      { name: 'Afundo Frontal', target: 'Quadríceps', muscle: '🦵 Quadríceps', reason: 'Funcional e completo' },
      { name: 'Sissy Squat', target: 'Quadríceps isolado', muscle: '🦵 Quadríceps', reason: 'Isolamento extremo' }
    ],
    'c5': [
      { name: 'Stiff (Peso Morto Romeno)', target: 'Posterior completo', muscle: '🦵 Posterior', reason: 'Melhor exercício para posterior' },
      { name: 'Mesa Flexora', target: 'Posterior coxa', muscle: '🦵 Posterior', reason: 'Isolamento deitado' }
    ],
    'c6': [
      { name: 'Agachamento Lateral', target: 'Glúteo médio', muscle: '🍑 Glúteo Lateral', reason: 'Funcional e efetivo' },
      { name: 'Clamshell com Banda', target: 'Glúteo médio', muscle: '🍑 Glúteo Lateral', reason: 'Ativação perfeita' }
    ],
    'c7': [
      { name: 'Panturrilha em Pé', target: 'Gastrocnêmio', muscle: '🦵 Panturrilha', reason: 'Trabalha a "barriga" da panturrilha' },
      { name: 'Panturrilha no Leg Press', target: 'Panturrilha completa', muscle: '🦵 Panturrilha', reason: 'Permite muita carga' }
    ],
    'c8': [
      { name: 'Dead Bug', target: 'Core anti-extensão', muscle: '🎯 Core', reason: 'Protege lombar, trabalha coordenação' },
      { name: 'Pallof Press', target: 'Core anti-rotação', muscle: '🎯 Core', reason: 'Fortalece estabilidade lateral' }
    ]
  };

  const workouts = {
    A: {
      name: 'EMPURRAR',
      subtitle: 'Peito, Ombros, Tríceps',
      icon: '💪',
      color: 'from-red-500 to-orange-500',
      exercises: [
        {
          id: 'a1',
          name: 'Supino Reto Máquina',
          target: 'Peitoral completo',
          tips: ['Mantenha os pés firmes no chão', 'Empurre com o peito, não com os ombros', 'Desça controlado até o peito'],
          strategic: false
        },
        {
          id: 'a2',
          name: 'Supino Inclinado Máquina',
          target: 'Peitoral superior',
          tips: ['Foco na parte de cima do peito', 'Cotovelos levemente para dentro', 'Não arqueie as costas'],
          strategic: false
        },
        {
          id: 'a3',
          name: 'Crucifixo Peitoral Máquina (Voador)',
          target: 'Abertura do peitoral',
          tips: ['Esprema o peito no final do movimento', 'Mantenha leve flexão nos cotovelos', 'Controle na volta'],
          strategic: false
        },
        {
          id: 'a4',
          name: 'Desenvolvimento Máquina (Ombros)',
          target: 'Ombros completos',
          tips: ['Empurre direto para cima', 'Não travar os cotovelos', 'Core contraído'],
          strategic: false
        },
        {
          id: 'a5',
          name: 'Elevação Lateral',
          target: 'Ombros laterais (largura)',
          tips: ['Cotovelos levemente flexionados', 'Não subir os ombros (trapézio)', 'Controle total do peso'],
          strategic: false
        },
        {
          id: 'a6',
          name: 'Tríceps Paralela na Máquina (Dips)',
          target: 'Tríceps completo',
          tips: ['Corpo levemente inclinado à frente', 'Desça até 90º nos cotovelos', 'Foco na extensão total'],
          strategic: true,
          note: 'Exercício-chave para volume de braço. Construção do "braço grande".'
        },
        {
          id: 'a7',
          name: 'Tríceps Francês',
          target: 'Cabeça longa do tríceps',
          tips: ['Cotovelos fixos e apontando para cima', 'Desça até alongar bem', 'Suba controlado'],
          strategic: false
        },
        {
          id: 'a8',
          name: 'Tríceps na Polia (Corda)',
          target: 'Definição e finalização',
          tips: ['Cotovelos colados no corpo', 'Abra a corda no final', 'Contraia forte por 1 segundo'],
          strategic: false
        }
      ]
    },
    B: {
      name: 'PUXAR',
      subtitle: 'Costas, Bíceps, Postura',
      icon: '🏔️',
      color: 'from-blue-500 to-cyan-500',
      exercises: [
        {
          id: 'b1',
          name: 'Puxada Aberta (Pulldown)',
          target: 'Largura das costas',
          tips: ['Puxe com as costas, não com os braços', 'Peito estufado', 'Esprema as escápulas no final'],
          strategic: true,
          note: 'Essencial para corrigir a "postura torta". Constrói as costas em V.'
        },
        {
          id: 'b2',
          name: 'Remada Baixa Sentada',
          target: 'Miolo das costas',
          tips: ['Peito para frente sempre', 'Puxe até o abdômen', 'Esprema as costas no final por 1 segundo'],
          strategic: true,
          note: 'Exercício N°1 para postura ereta. Fortalece a região que "puxa" os ombros pra trás.'
        },
        {
          id: 'b3',
          name: 'Remada Articulada (Máquina)',
          target: 'Espessura das costas',
          tips: ['Apoie bem o peito no suporte', 'Puxe os cotovelos para trás', 'Foco na contração das costas'],
          strategic: false
        },
        {
          id: 'b4',
          name: 'Voador Inverso (Crucifixo Inverso)',
          target: 'Posterior de ombro e postura',
          tips: ['Peito colado no banco', 'Abra bem os braços', 'Contraia as escápulas'],
          strategic: true,
          note: 'Corretor de postura. Trabalha a musculatura que "abre" o peito e corrige ombros caídos.'
        },
        {
          id: 'b5',
          name: 'Rosca Scott (Máquina ou Barra)',
          target: 'Bíceps completo',
          tips: ['Cotovelos apoiados e fixos', 'Não tirar os cotovelos do apoio', 'Controle na descida'],
          strategic: false
        },
        {
          id: 'b6',
          name: 'Rosca com Halteres (Alternada)',
          target: 'Pico do bíceps',
          tips: ['Cotovelos colados no corpo', 'Gire o punho (supinação)', 'Contraia no topo'],
          strategic: false
        }
      ]
    },
    C: {
      name: 'PERNAS',
      subtitle: 'Motor V8: Quadríceps, Posterior, Glúteo',
      icon: '🦵',
      color: 'from-green-500 to-emerald-500',
      exercises: [
        {
          id: 'c1',
          name: 'Leg Press 45',
          target: 'Quadríceps e glúteos',
          tips: ['Pés na parte superior da plataforma (para glúteo)', 'Desça até 90º', 'Empurre com o calcanhar'],
          strategic: true,
          note: 'Motor V8 ligado! Base da construção de pernas e glúteos. Use carga!'
        },
        {
          id: 'c2',
          name: 'Elevação Pélvica (Máquina ou Banco)',
          target: 'Glúteos (foco total)',
          tips: ['Esprema o glúteo no topo', 'Quadril totalmente estendido', 'Pause 2 segundos no topo'],
          strategic: true,
          note: '⭐ EXERCÍCIO N°1 ANTI-BUNDA-RETA. Isolamento perfeito do glúteo. Prioridade máxima!'
        },
        {
          id: 'c3',
          name: 'Agachamento Sumô com Déficit',
          target: 'Glúteos e interno de coxa',
          tips: ['Pés bem afastados, pontas para fora', 'Desça fundo (abaixo do paralelo)', 'Suba empurrando com glúteo'],
          strategic: true,
          note: 'Construtor de glúteo! A posição sumô dá ênfase total na parte de trás.'
        },
        {
          id: 'c4',
          name: 'Cadeira Extensora',
          target: 'Quadríceps (isolamento)',
          tips: ['Tronco encostado', 'Extensão total no topo', 'Desça controlado'],
          strategic: false
        },
        {
          id: 'c5',
          name: 'Cadeira Flexora',
          target: 'Posterior de coxa',
          tips: ['Quadril encaixado no banco', 'Puxe até encostar no glúteo', 'Controle na volta'],
          strategic: false
        },
        {
          id: 'c6',
          name: 'Cadeira Abdutora',
          target: 'Glúteo médio (lateral)',
          tips: ['Afaste as pernas com força', 'Pause 1 segundo no final', 'Volte controlado'],
          strategic: true,
          note: 'Construtor da "lateral do bumbum". Dá formato e largura ao glúteo.'
        },
        {
          id: 'c7',
          name: 'Panturrilha Sentado',
          target: 'Panturrilha (sóleo)',
          tips: ['Amplitude total', 'Pausa no topo', 'Alongue bem embaixo'],
          strategic: false
        },
        {
          id: 'c8',
          name: 'Abdominal Educativo (Prancha ou Pernas 90º)',
          target: 'Core e proteção lombar',
          tips: ['Prancha: Core duro, quadril alinhado', 'Pernas 90º: Lombar sempre no chão', 'Respire normal'],
          strategic: true,
          note: 'Adaptado para quem tem vão na lombar. Fortalece sem risco de lesão.'
        }
      ]
    }
  };

  // 🆕 COMPONENTE SIDEBAR
  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-8 h-8 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Meu Treino</h2>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        <button
          onClick={() => {
            setActiveTab('workout');
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            activeTab === 'workout' 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span>Treino Atual</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('progress');
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            activeTab === 'progress' 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Meu Progresso</span>
        </button>

        <div className="pt-4 border-t border-slate-700">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Selecionar Treino</h3>
          {Object.entries(workouts).map(([key, workout]) => (
            <button
              key={key}
              onClick={() => {
                setCurrentWorkout(key);
                setActiveTab('workout');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all ${
                currentWorkout === key
                  ? 'bg-slate-800 text-white border border-slate-600'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{workout.icon}</span>
              <div className="text-left">
                <div className="font-medium">Treino {key}</div>
                <div className="text-xs text-slate-500">{workout.name}</div>
              </div>
            </button>
          ))}
        </div>

        {Object.keys(workoutHistory).length > 0 && (
          <div className="pt-4 border-t border-slate-700">
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que quer limpar TODO o histórico?')) {
                  clearAllHistory();
                }
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>Limpar Todo Histórico</span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );

  // 🆕 COMPONENTE DE PROGRESSO
  const ProgressTab = () => {
    const exercisesWithHistory = Object.entries(workoutHistory)
      .filter(([_, history]) => history.length > 0);

    if (exercisesWithHistory.length === 0) {
      return (
        <div className="max-w-2xl mx-auto px-4 mt-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum histórico ainda</h3>
            <p className="text-slate-400">Comece a registrar seus treinos para ver seu progresso aqui!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <BarChart3 className="w-6 h-6" />
          Meu Progresso
        </h2>

        <div className="space-y-4">
          {exercisesWithHistory.map(([exerciseId, history]) => {
            const exercise = Object.values(workouts)
              .flatMap(w => w.exercises)
              .find(e => e.id === exerciseId) || 
              Object.values(customExercises)
                .flatMap(e => e)
                .find(e => e.id === exerciseId);

            if (!exercise) return null;

            const latestLog = history[history.length - 1];
            const previousLog = history.length > 1 ? history[history.length - 2] : null;
            
            const weightDiff = previousLog ? latestLog.weight - previousLog.weight : 0;
            const repsDiff = previousLog ? latestLog.reps - previousLog.reps : 0;

            return (
              <div key={exerciseId} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white">{exercise.name}</h3>
                    <p className="text-sm text-slate-400">{exercise.target}</p>
                  </div>
                  <button
                    onClick={() => setShowClearHistory(showClearHistory === exerciseId ? null : exerciseId)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {showClearHistory === exerciseId && (
                  <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
                    <p className="text-red-300 text-sm mb-2">Limpar histórico deste exercício?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => clearExerciseHistory(exerciseId)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Sim, Limpar
                      </button>
                      <button
                        onClick={() => setShowClearHistory(null)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{latestLog.sets}x{latestLog.reps}</div>
                    <div className="text-xs text-slate-400">Séries x Reps</div>
                    {repsDiff !== 0 && (
                      <div className={`text-xs ${repsDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {repsDiff > 0 ? '+' : ''}{repsDiff} reps
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-cyan-400">{latestLog.weight}kg</div>
                    <div className="text-xs text-slate-400">Peso</div>
                    {weightDiff !== 0 && (
                      <div className={`text-xs ${weightDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {weightDiff > 0 ? '+' : ''}{weightDiff}kg
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-white">{history.length}</div>
                    <div className="text-xs text-slate-400">Registros</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowHistory(showHistory === exerciseId ? null : exerciseId)}
                  className="w-full mt-3 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  {showHistory === exerciseId ? 'Esconder' : 'Ver'} Histórico Completo
                </button>

                {showHistory === exerciseId && (
                  <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                    {history.slice().reverse().map((log, i) => (
                      <div key={i} className="text-xs bg-slate-900 p-2 rounded border border-slate-700">
                        <span className="font-semibold text-white">{log.sets}x{log.reps}</span> • 
                        <span className="text-cyan-400 mx-1">{log.weight}kg</span> • 
                        <span className="text-slate-400">
                          {new Date(log.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getNextWorkout = () => {
    const order = ['A', 'B', 'C'];
    const currentIndex = order.indexOf(currentWorkout);
    return order[(currentIndex + 1) % 3];
  };

  const completeWorkout = async () => {
    const next = getNextWorkout();
    setCurrentWorkout(next);
    try {
      await storage.set('current-workout', next);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  const saveLog = async (exerciseId, sets, reps, weight) => {
    const timestamp = new Date().toISOString();
    const newHistory = {
      ...workoutHistory,
      [exerciseId]: [
        ...(workoutHistory[exerciseId] || []),
        { sets, reps, weight, date: timestamp }
      ].slice(-10)
    };
    setWorkoutHistory(newHistory);
    try {
      await storage.set('workout-history', JSON.stringify(newHistory));
    } catch (err) {
      console.error('Erro ao salvar histórico:', err);
    }
  };

  const addCustomExercise = async () => {
    if (!newExercise.name || !newExercise.target) return;
    
    const customId = `custom_${Date.now()}`;
    const exercise = {
      id: customId,
      name: newExercise.name,
      target: newExercise.target,
      tips: newExercise.tips.split('\n').filter(t => t.trim()),
      strategic: false,
      custom: true
    };

    const updated = {
      ...customExercises,
      [currentWorkout]: [...customExercises[currentWorkout], exercise]
    };
    
    setCustomExercises(updated);
    try {
      await storage.set('custom-exercises', JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }

    setNewExercise({ name: '', target: '', tips: '' });
    setShowAddExercise(false);
  };

  const removeCustomExercise = async (exerciseId) => {
    const updated = {
      ...customExercises,
      [currentWorkout]: customExercises[currentWorkout].filter(e => e.id !== exerciseId)
    };
    
    setCustomExercises(updated);
    try {
      await storage.set('custom-exercises', JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  const ExerciseCard = ({ exercise, workoutType }) => {
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const isExpanded = expandedExercise === exercise.id;
    const history = workoutHistory[exercise.id] || [];
    const lastLog = history[history.length - 1];
    const alternatives = exerciseAlternatives[exercise.id] || [];

    return (
      <div className="border border-slate-700 rounded-lg overflow-hidden mb-3 bg-slate-800/50 backdrop-blur">
        <div
          onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
          className="p-4 cursor-pointer hover:bg-slate-700/50 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">{exercise.name}</h3>
                {exercise.strategic && (
                  <Flame className="w-5 h-5 text-cyan-400" />
                )}
                {exercise.custom && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">CUSTOM</span>
                )}
              </div>
              <p className="text-sm text-slate-300 mt-1">🎯 {exercise.target}</p>
              {lastLog && (
                <p className="text-xs text-slate-400 mt-1">
                  Último: {lastLog.sets}x{lastLog.reps} • {lastLog.weight}kg
                </p>
              )}
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-300" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-slate-700 bg-slate-900/50 p-4 space-y-4">
            {exercise.custom && (
              <button
                onClick={() => removeCustomExercise(exercise.id)}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Remover Exercício
              </button>
            )}

            {exercise.strategic && (
              <div className="bg-cyan-500/10 border-l-4 border-cyan-400 p-3 rounded">
                <div className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-cyan-100">{exercise.note}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Pontos-Chave de Execução:
              </h4>
              <ul className="space-y-1">
                {exercise.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {alternatives.length > 0 && (
              <div>
                <button
                  onClick={() => setShowAlternatives(showAlternatives === exercise.id ? null : exercise.id)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  {showAlternatives === exercise.id ? 'Esconder' : 'Ver'} Exercícios Alternativos ({alternatives.length})
                </button>

                {showAlternatives === exercise.id && (
                  <div className="mt-3 space-y-2">
                    {alternatives.map((alt, i) => (
                      <div key={i} className="bg-slate-800 border border-slate-700 rounded p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                            {alt.muscle.split(' ')[0]}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-white">{alt.name}</h5>
                            <p className="text-xs text-cyan-400 mt-1">{alt.muscle}</p>
                            <p className="text-xs text-slate-400 mt-1">💡 {alt.reason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-slate-700 pt-4">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Registrar Treino:
              </h4>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Séries"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-center focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-center focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-center focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  if (sets && reps && weight) {
                    saveLog(exercise.id, sets, reps, weight);
                    setSets('');
                    setReps('');
                    setWeight('');
                  }
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 rounded transition-all"
              >
                Salvar Progresso
              </button>

              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(showHistory === exercise.id ? null : exercise.id)}
                  className="w-full mt-2 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  {showHistory === exercise.id ? 'Esconder' : 'Ver'} Histórico ({history.length})
                </button>
              )}

              {showHistory === exercise.id && (
                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                  {history.slice().reverse().map((log, i) => (
                    <div key={i} className="text-xs bg-slate-800 p-2 rounded border border-slate-700">
                      <span className="font-semibold text-white">{log.sets}x{log.reps}</span> • <span className="text-cyan-400">{log.weight}kg</span>
                      <span className="text-slate-400 ml-2">
                        {new Date(log.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const current = workouts[currentWorkout];
  const allExercises = [...current.exercises, ...customExercises[currentWorkout]];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* 🆕 SIDEBAR */}
      <Sidebar />
      
      {/* 🆕 OVERLAY PARA FECHAR SIDEBAR */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* HEADER ATUALIZADO */}
      <div className={`bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 shadow-2xl border-b border-slate-600 ${sidebarOpen ? 'blur-sm' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">TREINO {currentWorkout}</h1>
                <p className="text-lg text-cyan-400">{current.name}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-300 mt-2">{current.subtitle}</p>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className={sidebarOpen ? 'blur-sm' : ''}>
        {activeTab === 'workout' ? (
          <>
            {/* Next Workout Info */}
            <div className="max-w-2xl mx-auto px-4 mt-4">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Próximo Treino:</p>
                  <p className="font-bold text-white">Treino {getNextWorkout()}: {workouts[getNextWorkout()].name}</p>
                </div>
                <button
                  onClick={completeWorkout}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <CheckCircle className="w-5 h-5" />
                  Concluir
                </button>
              </div>
            </div>

            {/* Exercises */}
            <div className="max-w-2xl mx-auto px-4 mt-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                Exercícios ({allExercises.length})
              </h2>
              {allExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  workoutType={currentWorkout}
                />
              ))}
            </div>

            {/* Add Exercise Button */}
            <div className="max-w-2xl mx-auto px-4 mt-6">
              {!showAddExercise ? (
                <button
                  onClick={() => setShowAddExercise(true)}
                  className="w-full bg-slate-800/50 hover:bg-slate-700/50 border-2 border-dashed border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Exercício Personalizado
                </button>
              ) : (
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Novo Exercício
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nome do Exercício"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Músculo Alvo (ex: Peitoral superior)"
                      value={newExercise.target}
                      onChange={(e) => setNewExercise({...newExercise, target: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Dicas de Execução (uma por linha)"
                      value={newExercise.tips}
                      onChange={(e) => setNewExercise({...newExercise, tips: e.target.value})}
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addCustomExercise}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 rounded transition-all"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => {
                          setShowAddExercise(false);
                          setNewExercise({ name: '', target: '', tips: '' });
                        }}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Strategy Note */}
            <div className="max-w-2xl mx-auto px-4 mt-6 mb-6">
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-lg p-4 backdrop-blur">
                <h3 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Lembre-se:
                </h3>
                <p className="text-sm text-slate-200">
                  {currentWorkout === 'C' && 'Dia do Motor V8! Foco total em pernas e glúteos. São os músculos que mais aceleram seu metabolismo.'}
                  {currentWorkout === 'B' && 'Dia da Postura! Cada puxada constrói suas costas e corrige a "postura torta".'}
                  {currentWorkout === 'A' && 'Dia de Empurrar! Construa peito, ombros e braços com foco e intensidade.'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <ProgressTab />
        )}
      </div>
    </div>
  );
};

export default WorkoutSystem;