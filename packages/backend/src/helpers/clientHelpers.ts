import { IClient } from '../interfaces';

export const closeClient = (client: IClient) => {
  client.close();
};
