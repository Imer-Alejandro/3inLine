<template>
  <div class="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
    <header class="flex text-center order-1 justify-center w-full mb-[50px]">
      <div class="flex order-1 flex-col">
        <h2>Contador de victorias: 
          <span class="text-gray-800 text-[1.3rem]">(x : {{ countVictoryX }}) - (O : {{ countVictoryO }}) - empates: {{ countEmpates }}</span>
        </h2>
        <h3>Indicador de turno: 
          <span v-if="currentTurn" class=" text-red-600 text-[1.3rem]" >X</span>
          <span v-else class=" text-red-600 text-[1.3rem]" >O</span>
        </h3>
      </div>
    </header>
    
    <div class="grid grid-cols-3 order-2 gap-1 w-80 h-80">
      <div 
        v-for="(cell, index) in board" 
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
import { list } from 'postcss';
export default {
  data() {
    return {
      board: Array(9).fill(''), // Inicializa el tablero vacío
      currentTurn: true, // El primer turno es de 'X'
      ListVerifyStatuWind: [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]],
      countVictoryX:0,
      countVictoryO:0,
      countEmpates:0
    };
  },
  methods: {
  
    handleClick(index) {
      if (this.board[index] === '') { // Solo permitir clics en celdas vacías
        //actualizar el array
        this.board[index] = this.currentTurn ? 'X' : 'O';
        // Alternar entre 'X' y 'O'
        this.currentTurn = !this.currentTurn;

        this.verifyPlayersWind()

      }
    },
    verifyPlayersWind(){
      for (let combo of this.ListVerifyStatuWind) {
        const [a, b, c] = combo; // Extraer las posiciones de cada combinación ganadora
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
          // Si los tres elementos en una combinación son iguales y no están vacíos
          console.log(`El ganador es: ${this.board[a]}`); 
          //incrementar el contador de victirias
          if(this.board[a]=='X'){ this.countVictoryX++} else{this.countVictoryO++}

          this.cleanTable()
          break; // Puedes detener la verificación si encuentras un ganador  
        }
        else{
          this.verifyGameDraw();
        }
      }
    },
    verifyGameDraw(){
        let countVerit = 0;
        this.board.forEach(Element =>{
            if (Element != '') {
              countVerit++
            }
        })

        if(countVerit==9){
          console.log('el juego esta empatado')
          this.countEmpates++

          this.cleanTable()
          }
      },
      cleanTable(){
        this.board = new Array(9).fill('');
      }
    }
};
</script>