import { getRepository, Repository } from 'typeorm';

import IOrdersProcuctsRepository from '@modules/orders/repositories/IOrdersProductsRepository';
import ICreateOrderProductDTO from '@modules/orders/dtos/ICreateOrderProductDTO';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersProductsRepository implements IOrdersProcuctsRepository {
  private ormRepository: Repository<OrdersProducts>;

  constructor() {
    this.ormRepository = getRepository(OrdersProducts);
  }

  public async create({
    product,
  }: ICreateOrderProductDTO): Promise<OrdersProducts> {
    const order_product = this.ormRepository.create({
      product,
    });

    await this.ormRepository.save(order_product);

    return order_product;
  }
}

export default OrdersProductsRepository;
