export function gerarCodigoPedido() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
  
    function randomChar(conjunto) {
      return conjunto.charAt(Math.floor(Math.random() * conjunto.length));
    }
  
    // Parte inicial: 3 letras
    let prefixo = '';
    for (let i = 0; i < 3; i++) {
      prefixo += randomChar(letras);
    }
  
    // Parte final: L N L L L N
    let sufixo = '';
    sufixo += randomChar(letras);
    sufixo += randomChar(numeros);
    sufixo += randomChar(letras);
    sufixo += randomChar(letras);
    sufixo += randomChar(letras);
    sufixo += randomChar(numeros);
  
    return `${prefixo}-${sufixo}`;
  }
  
 
  