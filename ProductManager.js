const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  #path = "./Productos.json";
  #amount = 0;

  constructor() {
    this.createFile();
    this.#amount = 0;
  }

  async createFile() {
    await fs.writeFile("./Productos.json", JSON.stringify(""));
  }

  async addFirstProduct(title, description, price, thumbnail, code, stock) {
    // Armo el primer Producto
    const newProduct = {
      id: this.#amount,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    // Grabo el primer producto en el archivo JSON
    await fs.writeFile(
      "./Productos.json",
      "[" + JSON.stringify(newProduct) + "]"
    );
    // Incremento el contador
    this.#amount++;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    // defino un arreglo vacío
    let products = [];
    // llamo al método getProducts
    const productsPromise = await this.getProducts();
    // vuelvo a armar mi arreglo
    productsPromise.forEach((oneProd) => {
      products.push(oneProd);
    });
    // Verifico el campo CODE de cada producto existe en el arreglo
    let verifyProduct = false;
    let productCode = "";
    products.forEach((oneProd) => {
      verifyProduct = oneProd.code === code;
      if (verifyProduct) {
        productCode = oneProd.code;
      }
    });
    if (!verifyProduct) {
      const newProduct = {
        id: this.#amount,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      const updatedProducts = [...products, newProduct];
      // Agrego nuevos productos
      async function agregar() {
        //await fs.appendFile(
        await fs.writeFile("./Productos.json", JSON.stringify(updatedProducts));
      }
      agregar();
      this.#amount++;
    } else {
      console.error(`Existe un producto con el CODE ${productCode}`);
    }
  }

  async getProducts() {
    try {
      let products = JSON.parse(await fs.readFile(this.#path, "utf-8"));
      if (JSON.stringify(products) == "") {
        return "[]";
      } else {
        return products;
      }
    } catch (err) {
      return [];
    }
  }

  async getProductById(id) {
    // defino un arreglo vacío
    let products = [];
    // llamo al método getProducts
    const productsPromise = await this.getProducts();
    // vuelvo a armar mi arreglo
    productsPromise.forEach((oneProd) => {
      products.push(oneProd);
    });
    // Verifico el campo ID de cada producto existe en el arreglo
    const verifyProduct = products.find((prod) => prod.id === id);
    if (verifyProduct) {
      return verifyProduct;
    } else {
      console.log("No existe un producto con ID: " + id);
    }
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    // defino un arreglo vacío
    let products = [];
    // llamo al método getProducts
    const productsPromise = await this.getProducts();
    // vuelvo a armar mi arreglo
    productsPromise.forEach((oneProd) => {
      products.push(oneProd);
    });
    // Verifico el campo ID de cada producto existe en el arreglo
    products.forEach((oneProd) => {
      const verifyProduct = oneProd.id === id;
      try {
        if (verifyProduct) {
          const updatedProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          };
          let allButOne = [];
          products.forEach((oneProd) => {
            if (oneProd.id != id) {
              allButOne.push(oneProd);
            } else {
              allButOne.push(updatedProduct);
            }
          });
          // Grabo el archivo con los productos actualizados
          fs.writeFile(this.#path, JSON.stringify(allButOne));
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  async deleteProduct(id) {
    // defino un arreglo vacío
    let products = [];
    // llamo al método getProducts
    const productsPromise = await this.getProducts();
    // vuelvo a armar mi arreglo
    productsPromise.forEach((oneProd) => {
      products.push(oneProd);
    });
    // Verifico el campo ID de cada producto existe en el arreglo
    let allExceptOne = [];
    products.forEach((oneProd) => {
      if (oneProd.id != id) {
        allExceptOne.push(oneProd);
      }
    });
    try {
      async function grabar() {
        await fs.writeFile("./Productos.json", JSON.stringify(allExceptOne));
      }
      grabar();
    } catch (err) {
      console.error(err);
    }
  }
}

async function main() {
  // Instancio un objeto de la clase
  const manager = new ProductManager();
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
  // Creo el primer Producto
  await manager.addFirstProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc101",
    25
  );
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
  // Busco un producto por su ID
  console.log(await manager.getProductById(0));
  // Creo otros Productos
  await manager.addProduct(
    "Título2",
    "Descripción2",
    300,
    "FOTO1",
    "abc102",
    22
  );
  await manager.addProduct(
    "Título2",
    "Descripción2",
    300,
    "FOTO1",
    "abc102",
    22
  );
  await manager.addProduct(
    "Título3",
    "Descripción3",
    400,
    "FOTO2",
    "abc103",
    33
  );
  await manager.addProduct(
    "Título4",
    "Descripción4",
    500,
    "FOTO3",
    "abc104",
    44
  );
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
  // Actualizo un Producto existente
  await manager.updateProduct(
    1,
    "TítuloActualizado",
    "DescripciónAcualizada",
    500,
    "FOTOActualizada",
    "abc104",
    44
  );
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
  // Borro un producto
  await manager.deleteProduct(3);
  // Muestro los Productos existentes
  console.log(await manager.getProducts());
  // Busco un producto por un ID inexistente
  console.log(await manager.getProductById(3));
}

main();
