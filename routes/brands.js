import express from "express";
import * as fs from "fs";

const router = express.Router();

async function getBrands() {
  // Importo o arquivo JSON em cars
  const cars = await JSON.parse(fs.readFileSync("./car-list.json"));

  // Adiciono a quantidade de modelos que cada marca de carros tem
  let cars_with_qtdModelos = await cars.map(item => ({qtdModelos: item.models.length, ...item}));
  return cars_with_qtdModelos;
};

//rota que retorna a marca com mais carros
router.get("/maisModelos", async (req, res) => {
  const cars_with_qtdModelos = await getBrands();

  let numeroDeModelos = 0;
  let nomeDaMarca;

  for (let i = 0; i < 39; i++){
  if (cars_with_qtdModelos[i].qtdModelos > numeroDeModelos) {
    numeroDeModelos = cars_with_qtdModelos[i].qtdModelos;
    nomeDaMarca = cars_with_qtdModelos[i].brand;
    };
  };

  console.log('Marca com mais carros:');
  console.log(numeroDeModelos);
  console.log(nomeDaMarca);
  res.send(nomeDaMarca);
}
);

// rota que retorna marca com menos carros
router.get('/menosModelos', async (req, res) => {
  
  const cars_with_qtdModelos = await getBrands();

  let numeroDeModelos = 10000;
  let nomeDaMarca;

  for (let i = 0; i < 39; i++){
  if (cars_with_qtdModelos[i].qtdModelos < numeroDeModelos) {
    numeroDeModelos = cars_with_qtdModelos[i].qtdModelos;
    nomeDaMarca = cars_with_qtdModelos[i].brand;
    };
  };

  console.log('Marca com mais carros:');
  console.log(numeroDeModelos);
  console.log(nomeDaMarca);
  res.send(nomeDaMarca);
});

//retorna uma lista com as marcas com mais modelos
router.get('/listaMaisModelos/:qtd', async (req, res) => {
  const cars_with_qtdModelos = await getBrands();
  let carsSortedByQtdDesc = cars_with_qtdModelos.sort((x, y,) => {
    return y.qtdModelos - x.qtdModelos;
  });

  let listArray = [];
  let x = req.params.qtd;
  for (let i = 0; i < x; i++){
    listArray.push(carsSortedByQtdDesc[i]);
  }

console.table(listArray.map(b => `${b.brand} - ${b.models.length}`));
  res.send(listArray.map(b => `${b.brand} - ${b.models.length}`));
});

//retorna uma lista com as marcas com menos modelos
router.get('/listaMenosModelos/:qtd', async (req, res) => {
  const cars_with_qtdModelos = await getBrands();

  let carsSortedByQtdCres = cars_with_qtdModelos.sort((x, y,) => {
    return x.qtdModelos - y.qtdModelos;
  });

  let listArray = [];
  let x = req.params.qtd;
  for (let i = 0; i < x; i++){
    listArray.push(carsSortedByQtdCres[i]);
  }

  console.table(listArray.map(b => `${b.brand} - ${b.models.length}`));
  res.send(listArray.map(b => `${b.brand} - ${b.models.length}`));
});


// Essa rota é usada para procurar a lista de carros através do nome da marca
router.post('/listaModelos', async (req, res) => {
  try{
    const cars_with_qtdModelos = await getBrands();

    let nomeMarca = req.body.name;
    //let nomeSemJSON = JSON.stringify(nomeMarca);
    console.log(nomeMarca);

    var index = -1;
    var filteredObj = cars_with_qtdModelos.find( (item, marca ) => {
      if (item.brand === nomeMarca) {
        index = marca;
        res.send(marca);
      } 
    });

    console.log(filteredObj);
  } catch (err) {
    res.status(404).send( {error: err.message });
  };
});


export default router;