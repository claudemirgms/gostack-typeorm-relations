import OrdersProducts from '../infra/typeorm/entities/OrdersProducts';

import ICreateOrderProductDTO from '../dtos/ICreateOrderProductDTO';

export default interface IOrdersProcuctsRepository {
  create(data: ICreateOrderProductDTO): Promise<OrdersProducts>;
}
