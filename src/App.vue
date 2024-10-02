<template>
  <div class="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
    <header class="flex text-center order-1 justify-center w-full mb-[50px]">
      <div class="flex order-1 flex-col">
        <h1 class="text-3xl font-bold mb-[20px]">Jugador 
          <span class="text-gray-800">{{ player }}</span>
        </h1>
        <h2>Contador de victorias: 
          <span class="text-gray-800 text-[1.3rem]">(X: {{ dataGame.countVictoryX }}) - (O: {{ dataGame.countVictoryO }}) - Empates: {{ dataGame.countEmpates }}</span>
        </h2>
        <h3>Indicador de turno: 
          <span class="text-red-600 text-[1.3rem]">{{ dataGame.playerTurn ? 'X' : 'O' }}</span>
        </h3>
      </div>
    </header>
    
    <div id="table" class="grid grid-cols-3 order-2 gap-1 w-80 h-80">
      <div 
        v-for="(cell, index) in dataGame.board" 
        :key="index" 
        :id="index"
        @click="handleClick(index)"
        class="bg-gray-800 text-center hover:bg-gray-600 transition-transform duration-300 ease-in-out flex items-center justify-center text-white text-4xl font-bold cursor-pointer">
        {{ cell }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  mounted() {
    this.$socket.on("yourId", (Conf) => {
      this.clientID = Conf.id;

      if (Conf.NumPlayer === 0) {
        this.player = 'X';
        this.dataGame.playerTurn = true; // X comienza
      } else {
        this.player = 'O';
        this.dataGame.playerTurn = false; // Esperar turno
      }
    });

    this.$socket.on("updateGame", (dataGame) => {
      this.dataGame = dataGame;
    });

    this.$socket.on("gameWind", (datos) => {
      this.dataGame.countVictoryX = datos.countVictoryX;
      this.dataGame.countVictoryO = datos.countVictoryO;

      toast.success(`El jugador ${datos.playerWind} ha ganado esta mano!`)

      console.log(datos)

      this.cleanTable();
    });

    this.$socket.on("gameDraw", (countDraw) => {
      this.dataGame.countEmpates = countDraw;

      toast.warn(`Se ha empatado esta mano!`)

      this.cleanTable();
    });
  },
  data() {
    return {
      clientID: 0,
      ListVerifyStatuWind: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
        [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8]
      ],
      player: '',
      dataGame: {
        board: Array(9).fill(''),
        playerTurn: false,
        countVictoryX: 0,
        countVictoryO: 0,
        countEmpates: 0,
      }
    };
  },
  methods: {
    handleClick(index) {
      // Verificar si es el turno del jugador actual
      const isMyTurn = (this.player === 'X' && this.dataGame.playerTurn) || 
                       (this.player === 'O' && !this.dataGame.playerTurn);

      if (isMyTurn && this.dataGame.board[index] === '') {
        // Actualizar la celda con el símbolo del jugador
        this.dataGame.board[index] = this.player;

        // Alternar turno
        this.dataGame.playerTurn = !this.dataGame.playerTurn;

        // Enviar actualización al servidor
        this.updateGame();

        // Verificar si hay un ganador
        this.verifyPlayersWind();
      }
    },
    verifyPlayersWind() {
      for (let combo of this.ListVerifyStatuWind) {
        const [a, b, c] = combo;
        if (this.dataGame.board[a] && 
            this.dataGame.board[a] === this.dataGame.board[b] && 
            this.dataGame.board[a] === this.dataGame.board[c]) {
          // Incrementar el contador de victorias
          if (this.dataGame.board[a] === 'X') {
            this.dataGame.countVictoryX++;
          } else {
            this.dataGame.countVictoryO++;
          }

          // Enviar actualización de la victoria
          this.updateGameWind();

          // Limpiar el tablero
          this.cleanTable();
          break;
        } else {
          this.verifyGameDraw();
        }
      }
    },
    verifyGameDraw() {
      const filledCells = this.dataGame.board.filter(cell => cell !== '').length;
      if (filledCells === 9) {
        console.log('El juego está empatado');
        this.dataGame.countEmpates++;
        this.updateGameDraw();
        this.cleanTable();
      }
    },
    cleanTable() {
      this.dataGame.board = Array(9).fill('');
    },
    updateGame() {
      axios.post(`${import.meta.env.VITE_API_SERVER}status`, {
        dataGame: this.dataGame,
        senderId: this.clientID
      }).catch(err => console.log(err));
    },
    updateGameWind() {
      axios.post(`${import.meta.env.VITE_API_SERVER}wind`, {
        dataGame: this.dataGame,
        playerWind: this.player
      }).catch(err => console.log(err));
    },
    updateGameDraw() {
      axios.post(`${import.meta.env.VITE_API_SERVER}draw`, {
        countDraw: this.dataGame.countEmpates
      }).catch(err => console.log(err));
    }
  }
};
</script>
