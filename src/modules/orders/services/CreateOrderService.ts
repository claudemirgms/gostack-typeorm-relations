import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IProduct2 {
  id: string;
  price: number;
  quantity: number;
}

interface IRequest2 {
  customer_id: string;
  products: IProduct2[];
}
@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest2): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('cliente não encontrado');
    }

    const array_products: IProduct[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const product of products) {
      const { id } = product;

      // eslint-disable-next-line no-await-in-loop
      const dado = await this.productsRepository.findById(id);

      if (!dado) {
        throw new AppError('produto não entrado');
      }

      if (dado.quantity < product.quantity) {
        throw new AppError('sem produto em estoque');
      }
      array_products.push({
        product_id: id,
        price: dado.price,
        quantity: product.quantity,
      });
    }

    const order = await this.ordersRepository.create({
      customer,
      products: array_products,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;
