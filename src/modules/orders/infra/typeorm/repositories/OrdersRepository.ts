import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  private ormRepository2: Repository<OrdersProducts>;

  constructor() {
    this.ormRepository = getRepository(Order);
    this.ormRepository2 = getRepository(OrdersProducts);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    console.log(products);
    const order = this.ormRepository.create({
      customer,
      orders_products: products,
    });

    const order_products: OrdersProducts[] = [];

    // for (const product of products) {
    //   const order_product = this.ormRepository2.create({
    //     order_id: order.id,
    //     product_id: product.product_id,
    //     quantity: product.quantity,
    //     price: product.price,
    //   });

    //   order_products.push(order_product);
    // }
    // products.forEach(product => {
    // const order_products = this.ormRepository2.create({
    //   order_id: order.id,
    //   product_id: products[0].product_id,
    // });
    // console.log(order_products);
    // });

    await this.ormRepository.save(order);

    order.orders_products = order_products;

    return order;
  }

  // public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
  //   const order = this.ormRepository.create({
  //     customer,
  //     order_products: products.map(product => ({
  //       ...product,
  //       product_id: product.product_id,
  //       quantity: product.quantity,
  //       price: product.price, // Intl.NumberFormat('pt-br', {style: 'currency').format(product.price),
  //     })),
  //   });
  //   // console.log(order);

  //   await this.ormRepository.save(order);

  //   // const orderProducts = this.opRepository.create({
  //   //   order_id: order.id,
  //   //   product: products,
  //   // });

  //   // await this.opRepository.save(orderProducts);

  //   delete order.created_at;
  //   delete order.updated_at;

  //   delete order.customer_id;
  //   delete order.customer.created_at;
  //   delete order.customer.updated_at;

  //   // order.order_products =

  //   return order;
  // }

  public async findById(id: string): Promise<Order | undefined> {
    // console.log(id);
    const order = await this.ormRepository.findOne({ where: { id } });
    return order;
  }
}

export default OrdersRepository;
