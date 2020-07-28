import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ name });
    return product;
  }

  public async findById(product_id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne(product_id);
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const product = await this.ormRepository.findByIds(products);
    return product;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const arrayProducts: Product[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const product of products) {
      const { id, quantity } = product;

      // eslint-disable-next-line no-await-in-loop
      const updateQuantity = await this.ormRepository.findOne(id);

      if (!updateQuantity) {
        throw new AppError('produto não encotrado');
      }
      updateQuantity.quantity = updateQuantity?.quantity - quantity;

      // eslint-disable-next-line no-await-in-loop
      await this.ormRepository.save(updateQuantity);

      arrayProducts.push(updateQuantity);
    }
    return arrayProducts;
  }
}

export default ProductsRepository;
