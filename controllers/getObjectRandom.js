const getObject = () => {
  // let cant = process.env.CANT_BUCLE;
  let cant = 12;
  if (!cant) {
    cant = 100000000;
  }
  let arr = [];
  let data = {};

  // Creo el array de 0 -1000, utilizo del 1 al 1000
  for (let i = 0; i <= 1000; i++) {
    arr[i] = 0;
  }

  // Utilizo las posiciones del array para guardar el conteo del número random que aparece.
  for (let i = 0; i <= cant; i++) {
    let numRandom = Math.floor(Math.random() * (1001 - 1) + 1);
    arr[numRandom]++;
  }

  //creo el objeto de salida clave - valor
  for (let i = 0; i <= arr.length - 1; i++) {
    if (arr[i] > 0) {
      data[i] = arr[i];
    }
  }

  return data;
};
const objectAleatorio = getObject();

process.send(objectAleatorio);
