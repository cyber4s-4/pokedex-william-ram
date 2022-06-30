import IComponent from "../components/IComponent";

export default class PageHandler {
  protected components: IComponent[];
  protected readonly productStorage: Product[];
  constructor() {
    this.components = [];
    this.productStorage = this.readLocalStorage();
    this.readLocalStorage();
  }

  private readLocalStorage(): Product[] {
    let productsObj: Product[];
    if (localStorage.getItem('laptops-list') === null) {
      productsObj = this.buildProductsArray();
      localStorage.setItem('laptops-list', JSON.stringify(productsObj));
    } else {
      // By using 'as Product' we don't need any deserialize function because we are sure this is a Product[] object.
      productsObj = (JSON.parse(localStorage.getItem('laptops-list') || '{}') as Product[]);
    }
    return productsObj;
  }

  private buildProductsArray(): Product[] {
    const products: Product[] = [];
    let id = 0;
    for (const currentReadedProduct of Object.values(productsFile.products)) {
      products.push({
        id: id++,
        productPicturePath: currentReadedProduct.productPicturePath,
        productTitle: currentReadedProduct.productTitle,
        productSpecs: {
          productType: currentReadedProduct.productSpecs.productType,
          manufacture: currentReadedProduct.productSpecs.manufacture,
          module: currentReadedProduct.productSpecs.module,
          cpuModule: currentReadedProduct.productSpecs.cpuModule,
          internalStorageCapacity: currentReadedProduct.productSpecs.internalStorageCapacity,
          externalStorageCapacity: currentReadedProduct.productSpecs.externalStorageCapacity,
          storageType: currentReadedProduct.productSpecs.storageType,
          screenSize: currentReadedProduct.productSpecs.screenSize,
          resolution: currentReadedProduct.productSpecs.resolution,
          graphicsCard: currentReadedProduct.productSpecs.graphicsCard,
          operatingSystem: currentReadedProduct.productSpecs.operatingSystem,
          warrantyDuration: currentReadedProduct.productSpecs.warrentyDuration,
          warrantyType: currentReadedProduct.productSpecs.warrentyType,
          warrantyProvider: currentReadedProduct.productSpecs.warrentyProvider
        },
        productPrice: currentReadedProduct.productPrice,
        brandPicture: currentReadedProduct.brandPicture
      });
    }
    return products;
  }
  protected renderComponents(parentElement: HTMLElement): void {
    parentElement.innerHTML = '';
    this.components.forEach((component) => component.render());
  }
}
